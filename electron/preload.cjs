// Electron preload script: accesorio para seguridad y futura IPC
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  api: {
    signup: (payload) => ipcRenderer.invoke('auth:signup', payload),
    login: (payload) => ipcRenderer.invoke('auth:login', payload),
    googleLogin: () => ipcRenderer.invoke('auth:google-login'),
    list: (payload) => ipcRenderer.invoke('data:list', payload),
    get: (payload) => ipcRenderer.invoke('data:get', payload),
    create: (payload) => ipcRenderer.invoke('data:create', payload),
    update: (payload) => ipcRenderer.invoke('data:update', payload),
    remove: (payload) => ipcRenderer.invoke('data:delete', payload),
    driveListFiles: (payload) => ipcRenderer.invoke('drive:list-files', payload),
    driveReadFileText: (payload) => ipcRenderer.invoke('drive:read-file-text', payload),
    driveWriteFileText: (payload) => ipcRenderer.invoke('drive:write-file-text', payload),
  },
})
