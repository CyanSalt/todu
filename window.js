const {app, BrowserWindow, globalShortcut} = require('electron')

let frame = null

function init() {
  frame = new BrowserWindow({
    title: 'TODU',
    width: 900,
    height: 700,
    minWidth: 800,
  })
  frame.loadURL(`file://${__dirname}/src/index.html`)
  frame.on('closed', () => {
    frame = null
  })
  globalShortcut.register('CommandOrControl+Shift+I', function () {
    frame && frame.webContents.openDevTools()
  })
}

app.on('ready', init)

app.on('activate', () => {
  if (frame === null) {
    init()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
