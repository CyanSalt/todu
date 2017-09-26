const {app, BrowserWindow, Menu, MenuItem} = require('electron')

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
  frame.setMenu(createMenu())
  frame.setMenuBarVisibility(false)
}

function createMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'Toggle Developer Tools',
      accelerator: 'CommandOrControl+Shift+I',
      click() {
        frame && frame.webContents.openDevTools()
      }
    }
  ])
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
