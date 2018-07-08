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
    webPreferences: {
      experimentalFeatures: true,
    },
  })
  frame.loadURL(`file://${__dirname}/src/index.html`)
  frame.on('closed', () => {
    frame = null
  })
  const menu = createMenu()
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(menu)
  } else {
    frame.setMenu(menu)
    frame.setMenuBarVisibility(false)
  }
  // these handler must be binded in main process
  transferEvents()
}

function createMenu() {
  return Menu.buildFromTemplate([
    {
      label: app.getName(),
      submenu: [
        {role: 'toggledevtools'},
        {
          label: 'Print',
          accelerator: 'CommandOrControl+P',
          click() {
            frame && frame.webContents.print()
          }
        }
      ]
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
  global.downloads = new Map()
  frame.webContents.session.on('will-download', (e, item, webContents) => {
    const target = path.join(
      process.resourcesPath,
      `${item.getFilename()}.download`,
    )
    item.setSavePath(target)
    global.downloads.set(target, item)
    webContents.send('will-download', target)
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
  app.quit()
})
