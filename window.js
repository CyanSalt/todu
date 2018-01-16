const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')

let frame = null

function init() {
  frame = new BrowserWindow({
    title: 'TODU',
    width: 900,
    height: 700,
    minWidth: 450,
    frame: false,
  })
  frame.loadURL(`file://${__dirname}/src/index.html`)
  frame.on('closed', () => {
    frame = null
  })
  frame.setMenu(createMenu())
  frame.setMenuBarVisibility(false)
  // these handler must be binded in main process
  transferEvents()
}

function createMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'Print',
      accelerator: 'CommandOrControl+P',
      click() {
        frame && frame.webContents.print()
      }
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: 'CommandOrControl+Shift+I',
      click() {
        frame && frame.webContents.openDevTools()
      }
    }
  ])
}

function transferEvents() {
  frame.on('maximize', () => {
    frame.webContents.send('maximize')
  })
  frame.on('unmaximize', () => {
    frame.webContents.send('unmaximize')
  })
  frame.webContents.session.on('will-download', (e, item, webContents) => {
    item.setSavePath(path.resolve(app.getPath('downloads'), item.getFilename()))
    frame.webContents.send('will-download')
  })
}

const second = app.makeSingleInstance((argv, directory) => {
  if (frame) {
    if (frame.isMinimized()) {
      frame.restore()
    }
    frame.focus()
  }
  return true
})

if (second) {
  app.quit()
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
