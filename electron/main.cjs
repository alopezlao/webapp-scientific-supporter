const path = require('path')
const { app, BrowserWindow } = require('electron')

// Default to development if not explicitly set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
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
    : `file://${path.join(__dirname, '..', 'apps', 'desktop', '.next', 'standalone', 'app', 'page.html')}`

  win.loadURL(startUrl)

  // Abre DevTools en dev
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }
}

app.on('ready', createWindow)

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
