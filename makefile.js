const packager = require('electron-packager')
const png2icons = require('png2icons')
const path = require('path')
const fs = require('fs')
const app = require('./package.json')

const ICON_PATH = 'src/assets/img/icon.ico'

// Check icon file
try {
  fs.accessSync(ICON_PATH)
} catch (error) {
  console.log('Generating program icon...')
  const folder = path.dirname(ICON_PATH)
  const input = fs.readFileSync(`${folder}/icon.png`)
  // eslint-disable-next-line new-cap
  const output = png2icons.PNG2ICO_BMP(input, png2icons.BICUBIC, false)
  fs.writeFileSync(ICON_PATH, output)
}

const options = {
  dir: '.',
  name: 'todu',
  out: 'dist/',
  overwrite: true,
  icon: ICON_PATH,
  ignore: [
    '^/(?!src|package\\.json|window\\.js)',
    '^/src/(components|plugins|resources|storage)($|/)',
    '^/src/assets/.*(\\.ico|_)$',
  ],
  appVersion: app.executableVersion,
  win32metadata: {
    FileDescription: app.productName,
    OriginalFilename: `${app.name}.exe`,
  }
}

function copy(source, target) {
  const basename = path.basename(source)
  if (fs.lstatSync(source).isDirectory()) {
    target = path.join(target, basename)
    try {
      fs.mkdirSync(target)
    } catch (e) {}
    const entries = fs.readdirSync(source)
    for (const entry of entries) {
      copy(path.join(source, entry), target)
    }
  } else {
    fs.copyFileSync(source, path.join(target, basename))
  }
}

packager(options).then(appPaths => {
  appPaths.forEach(dir => {
    copy('src/resources', dir)
    if (dir.includes('win32')) {
      const manifest = 'todu.VisualElementsManifest.xml'
      fs.renameSync(`${dir}/resources/visual/${manifest}`, `${dir}/${manifest}`)
    }
  })
  console.log('Build finished.')
}).catch(e => {
  console.error(e)
})
