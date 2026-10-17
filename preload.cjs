const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pcgUpdater', {
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  checkForUpdatesManual: () => ipcRenderer.invoke('check-for-updates-manual'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (e, version) => callback(version)),
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (e, percent) => callback(percent)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', () => callback()),
  startDownload: () => ipcRenderer.invoke('start-update-download'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install')
});