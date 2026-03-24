const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, ipcMain } = require('electron')
const {
  initLocalDb,
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  signUp,
  login,
  upsertGoogleUser,
} = require('./local-db.cjs')
const {
  startGoogleLogin,
  listDriveFiles,
  readDriveFileText,
  writeDriveFileText,
} = require('./google-drive.cjs')

// Default to development if not explicitly set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

function loadEnvFromFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator <= 0) continue
    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

function loadProjectEnv() {
  const projectRoot = path.join(__dirname, '..')
  loadEnvFromFile(path.join(projectRoot, '.env.local'))
  loadEnvFromFile(path.join(projectRoot, '.env'))
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const startUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : resolveProductionUrl()

  win.loadURL(startUrl)

  // Abre DevTools en dev
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }
}

function registerIpcHandlers() {
  ipcMain.handle('auth:signup', (_event, payload) => signUp(payload))
  ipcMain.handle('auth:login', (_event, payload) => login(payload))
  ipcMain.handle('auth:google-login', async () => {
    const googleProfile = await startGoogleLogin(app.getPath('userData'))
    return upsertGoogleUser(googleProfile)
  })
  ipcMain.handle('data:list', (_event, payload) => listRecords(payload.collection, payload.page, payload.perPage))
  ipcMain.handle('data:get', (_event, payload) => getRecord(payload.collection, payload.id))
  ipcMain.handle('data:create', (_event, payload) => createRecord(payload.collection, payload.data))
  ipcMain.handle('data:update', (_event, payload) => updateRecord(payload.collection, payload.id, payload.data))
  ipcMain.handle('data:delete', (_event, payload) => deleteRecord(payload.collection, payload.id))
  ipcMain.handle('drive:list-files', (_event, payload) => listDriveFiles(app.getPath('userData'), payload?.pageSize))
  ipcMain.handle('drive:read-file-text', (_event, payload) => readDriveFileText(app.getPath('userData'), payload.fileId))
  ipcMain.handle('drive:write-file-text', (_event, payload) => writeDriveFileText(app.getPath('userData'), payload))
}

function resolveProductionUrl() {
  const override = process.env.ELECTRON_START_URL
  if (override) return override

  const candidates = [
    path.join(__dirname, '..', 'apps', 'desktop', 'out', 'index.html'),
    path.join(__dirname, '..', 'apps', 'desktop', '.next', 'server', 'app', 'index.html'),
    path.join(__dirname, '..', 'apps', 'desktop', '.next', 'standalone', 'apps', 'desktop', '.next', 'server', 'app', 'index.html'),
  ]

  const htmlEntry = candidates.find((filePath) => fs.existsSync(filePath))
  if (htmlEntry) return `file://${htmlEntry}`

  return 'http://localhost:3000'
}

app.on('ready', () => {
  loadProjectEnv()
  const dbPath = path.join(app.getPath('userData'), 'research-hub.sqlite')
  initLocalDb(dbPath)
  registerIpcHandlers()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
