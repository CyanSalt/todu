const packager = require('electron-packager')
const path = require('path')
const fs = require('fs')

const options = {
  dir: '.',
  name: 'todu',
  out: 'dist/',
  overwrite: true,
  icon: path.resolve(__dirname, 'src/resource/img/icon.ico'),
  ignore: [
    '^/(?!src|package\\.json|window\\.js)',
    '^/src/(storage|component|plugin)($|/)',
    '^/src/storage/.*_$',
  ],
  win32metadata: {
    FileDescription: 'TODU',
    OriginalFilename: 'todu.exe',
  }
}

packager(options).then(appPaths => {
  appPaths.forEach(dir => {
    if (dir.includes('win32')) {
      const manifest = 'todu.VisualElementsManifest.xml'
      fs.createReadStream(manifest)
        .pipe(fs.createWriteStream(`${dir}/${manifest}`))
    }
  })
  console.log('Build finished.')
}).catch(e => {
  console.error(e)
})
