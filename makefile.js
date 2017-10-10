const packager = require('electron-packager')
const path = require('path')

const options = {
  dir: '.',
  name: 'todu',
  out: 'dist/',
  overwrite: true,
  icon: path.resolve(__dirname, 'src/resource/img/icon.ico'),
  ignore: [
    '^/(?!src|package\\.json|window\\.js)',
    '^/src/(storage|component|plugin)($|/)',
  ],
  win32metadata: {
    OriginalFilename: 'todu.exe',
  }
}

packager(options, appPaths => {
  console.log('Build finished.')
})
