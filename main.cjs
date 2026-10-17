const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');

let mainWindow;
autoUpdater.autoDownload = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: '#050b18',
    autoHideMenuBar: true,
    title: 'PC Character Games',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdates().catch(err => console.log('خطأ في الفحص التلقائي:', err));
  });
}

// الفحص اليدوي عند الضغط على الزر في صفحة الإعدادات
ipcMain.handle('check-for-updates-manual', async () => {
  try {
    const res = await autoUpdater.checkForUpdates();
    if (res && res.updateInfo && res.updateInfo.version !== app.getVersion()) {
      return { hasUpdate: true, version: res.updateInfo.version };
    }
    return { hasUpdate: false };
  } catch (err) {
    throw new Error('فشل الفحص');
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

autoUpdater.on('update-available', (info) => {
  if (mainWindow) {
    mainWindow.webContents.send('update-available', info.version);
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  if (mainWindow) {
    mainWindow.webContents.send('update-progress', Math.floor(progressObj.percent));
  }
});

autoUpdater.on('update-downloaded', () => {
  if (mainWindow) {
    mainWindow.webContents.send('update-downloaded');
  }
});

ipcMain.handle('start-update-download', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.handle('quit-and-install', () => {
  autoUpdater.quitAndInstall(false, true);
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});