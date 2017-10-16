import {
  readFile, readFileSync,
  writeFile, writeFileSync,
  unlink, unlinkSync,
  mkdir, mkdirSync,
  access, accessSync,
} from 'fs'
import {dirname, resolve} from 'path'
import {remote} from 'electron'

const NOOP = () => {}
const PATH = process.env.NODE_ENV === 'production' ?
  dirname(process.execPath) :
  resolve(remote.app.getAppPath(), 'src')

export const FileStorage = {
  fetch(key, initial, callback) {
    return this.load(key, function (err, data) {
      if (!err || !initial) {
        return callback(err, data)
      }
      this.save(key, initial)
      return initial
    })
  },
  fetchSync(key, initial) {
    let data = this.loadSync(key)
    if (data !== null || !initial) {
      return data
    }
    this.save(key, initial)
    return initial
  },
  load(key, callback) {
    callback = callback || NOOP
    return readFile(this.filename(key), (err, data) => {
      if (!err && data) {
        data = JSON.parse(data)
      }
      callback(err, data)
    })
  },
  loadSync(key) {
    try {
      return JSON.parse(readFileSync(this.filename(key)))
    } catch (e) {
      return null
    }
  },
  delete(key, callback) {
    callback = callback || NOOP
    return unlink(this.filename(key), (...args) => {
      callback(...args)
    })
  },
  deleteSync(key) {
    try {
      unlinkSync(this.filename(key))
    } catch (e) {}
  },
  save(key, data, callback) {
    const filename = this.filename(key)
    return mkdir(dirname(filename), (...args) => {
      writeFile(filename, this.stringify(data), callback || NOOP)
    })
  },
  saveSync(key, data) {
    const filename = this.filename(key)
    try {
      mkdirSync(dirname(filename))
    } catch (e) {}
    return writeFileSync(filename, this.stringify(data))
  },
  require(key, callback) {
    const filename = this.filename(key, 'js')
    access(filename, (err) => {
      if (err) return
      callback(global.require(filename))
    })
  },
  requireSync(key) {
    const filename = this.filename(key, 'js')
    try {
      accessSync(filename)
      return global.require(filename)
    } catch (e) {
      return null
    }
  },
  rawdata(key, suffix, callback) {
    return readFile(this.filename(key, suffix), (err, data) => {
      if (err) return
      callback(data)
    })
  },
  rawdataSync(key, suffix) {
    try {
      return readFileSync(this.filename(key, suffix))
    } catch (e) {
      return null
    }
  },

  stringify(data) {
    return JSON.stringify(data, null, 2)
  },
  filename(key, suffix = 'json') {
    return resolve(PATH, `storage/${key}.${suffix}`)
  },
}

export default {
  install: function(Vue, options) {
    Vue.prototype.$storage = FileStorage
  }
}
