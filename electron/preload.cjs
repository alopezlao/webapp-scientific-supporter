// Electron preload script: accesorio para seguridad y futura IPC
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  // expone aquí API de seguridad si se necesita
})
