import {remote} from 'electron'
import {readFileSync} from 'fs'
import {resolve} from 'path'
import {FileStorage} from './storage'

const translations = [
  {
    file: 'fr-FR.json',
    locales: ['fr', 'fr-CA', 'fr-CH', 'fr-FR'],
  },
  {
    file: 'zh-CN.json',
    locales: ['zh', 'zh-CN'],
  },
  {
    file: 'zh-TW.json',
    locales: ['zh-TW'],
  },
]

function load(file) {
  const path = resolve(__dirname, 'assets/locales', file)
  try {
    return JSON.parse(readFileSync(path))
  } catch (e) {
    return null
  }
}

export default {
  install(Vue, options) {
    let locale = remote.app.getLocale()
    const custom = FileStorage.loadSync('translation.json') || {}
    if (custom['@use']) locale = custom['@use']
    // Load translation data
    const translation = translations
      .find(({locales}) => locales.includes(locale))
    const dictionary = (translation && load(translation.file)) || {}
    // Merge user defined translation data
    for (const [key, value] of Object.entries(custom)) {
      if (value) dictionary[key] = value
    }
    Vue.prototype.i18n = function (message) {
      return dictionary[message] || message.split('#!')[0]
    }
  }
}
