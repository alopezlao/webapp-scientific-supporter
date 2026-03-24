const fs = require('fs')
const path = require('path')
const http = require('http')
const { shell } = require('electron')
const { google } = require('googleapis')

const TOKEN_FILE = 'google-oauth-token.json'
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/drive',
]

function loadStoredToken(userDataDir) {
  const tokenPath = path.join(userDataDir, TOKEN_FILE)
  if (!fs.existsSync(tokenPath)) return null
  try {
    return JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
  } catch {
    return null
  }
}

function storeToken(userDataDir, token) {
  const tokenPath = path.join(userDataDir, TOKEN_FILE)
  fs.writeFileSync(tokenPath, JSON.stringify(token, null, 2), 'utf8')
}

function createOAuthClient(redirectUri) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET son obligatorios')
  }
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

function exchangeCodeForToken(oauth2Client, redirectPort) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const requestUrl = new URL(req.url, `http://127.0.0.1:${redirectPort}`)
        const code = requestUrl.searchParams.get('code')
        if (!code) throw new Error('No se recibio codigo OAuth')
        const tokenResult = await oauth2Client.getToken(code)
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Autenticacion completada. Puedes volver a la aplicacion.')
        server.close()
        resolve(tokenResult.tokens)
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Error de autenticacion de Google.')
        server.close()
        reject(error)
      }
    })
    server.listen(redirectPort, '127.0.0.1')
  })
}

async function startGoogleLogin(userDataDir) {
  const redirectPort = Number(process.env.GOOGLE_REDIRECT_PORT || '54329')
  const redirectUri = `http://127.0.0.1:${redirectPort}`
  const oauth2Client = createOAuthClient(redirectUri)

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  })
  await shell.openExternal(authUrl)
  const tokens = await exchangeCodeForToken(oauth2Client, redirectPort)
  oauth2Client.setCredentials(tokens)
  storeToken(userDataDir, tokens)

  const oauth2Api = google.oauth2({ auth: oauth2Client, version: 'v2' })
  const userInfo = await oauth2Api.userinfo.get()
  if (!userInfo.data.email || !userInfo.data.id) {
    throw new Error('No se pudo obtener perfil de Google')
  }

  return {
    id: userInfo.data.id,
    email: userInfo.data.email,
    name: userInfo.data.name || undefined,
    avatar: userInfo.data.picture || undefined,
  }
}

async function getAuthorizedClient(userDataDir) {
  const redirectPort = Number(process.env.GOOGLE_REDIRECT_PORT || '54329')
  const redirectUri = `http://127.0.0.1:${redirectPort}`
  const oauth2Client = createOAuthClient(redirectUri)
  const token = loadStoredToken(userDataDir)
  if (!token) {
    throw new Error('No hay sesion de Google. Inicia sesion primero.')
  }
  oauth2Client.setCredentials(token)
  if (oauth2Client.credentials.expiry_date && oauth2Client.credentials.expiry_date <= Date.now()) {
    const refreshed = await oauth2Client.refreshAccessToken()
    oauth2Client.setCredentials(refreshed.credentials)
    storeToken(userDataDir, oauth2Client.credentials)
  }
  return oauth2Client
}

async function listDriveFiles(userDataDir, pageSize = 25) {
  const auth = await getAuthorizedClient(userDataDir)
  const drive = google.drive({ version: 'v3', auth })
  const response = await drive.files.list({
    pageSize,
    fields: 'files(id,name,mimeType,modifiedTime,size)',
    orderBy: 'modifiedTime desc',
  })
  return response.data.files || []
}

async function readDriveFileText(userDataDir, fileId) {
  const auth = await getAuthorizedClient(userDataDir)
  const drive = google.drive({ version: 'v3', auth })
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'text' }
  )
  return String(response.data || '')
}

async function writeDriveFileText(userDataDir, payload) {
  const auth = await getAuthorizedClient(userDataDir)
  const drive = google.drive({ version: 'v3', auth })
  const media = {
    mimeType: payload.mimeType || 'text/plain',
    body: payload.content || '',
  }
  if (payload.fileId) {
    const updated = await drive.files.update({
      fileId: payload.fileId,
      media,
    })
    return updated.data
  }
  const created = await drive.files.create({
    requestBody: {
      name: payload.name || 'Nuevo archivo.txt',
      mimeType: payload.mimeType || 'text/plain',
      parents: payload.parentId ? [payload.parentId] : undefined,
    },
    media,
  })
  return created.data
}

module.exports = {
  startGoogleLogin,
  listDriveFiles,
  readDriveFileText,
  writeDriveFileText,
}

