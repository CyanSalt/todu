const packager = require('electron-packager')
const png2icons = require('png2icons')
const path = require('path')
const fs = require('fs')
const app = require('./package.json')

const suffix = process.platform === 'darwin' ? 'icns' : 'ico'
const ICON_PATH = `src/assets/images/icon.${suffix}`

// Check icon file
try {
  fs.accessSync(ICON_PATH)
} catch (error) {
  console.log('Generating program icon...')
  const folder = path.dirname(ICON_PATH)
  const input = fs.readFileSync(`${folder}/icon.png`)
  const builder = suffix === 'icns' ? png2icons.createICNS : png2icons.createICO
  const output = builder(input, png2icons.BICUBIC, false)
  fs.writeFileSync(ICON_PATH, output)
}

const options = {
  dir: '.',
  name: app.name,
  out: 'dist/',
  overwrite: true,
  asar: true,
  icon: ICON_PATH,
  ignore: [
    '^/(?!src|package\\.json|window\\.js)',
    '^/src/(components|plugins|resources|storage)($|/)',
    '^/src/assets/.*\\.(ico|icns)$',
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
      const manifest = `${app.name}.VisualElementsManifest.xml`
      fs.renameSync(`${dir}/resources/visual/${manifest}`, `${dir}/${manifest}`)
    }
  })
  console.log('Build finished.')
}).catch(e => {
  console.error(e)
})
