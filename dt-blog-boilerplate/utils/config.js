import yaml from 'js-yaml'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

/**
 * Global config info in `_config.yml`
 */
let config = {
  title: "DiscreteTom's Blog Boilderplate",
  root: 'index',
  repo: '',
  email: '',
  author: '',
  folderIcon: 'mdi-folder-outline',
  fileIcon: 'mdi-file',
  orderDecider: '@',
  reverse: false,
  description: '',
  headScripts: [],
  friends: [],
  friendsIcon: 'mdi-open-in-new',
  friendsLabel: 'Friends',
  searchName: '',
  searchDescription: '',
  domainName: ''
}

// load global config
let t = yaml.safeLoad(fs.readFileSync('../_config.yml', 'utf8')) || {}
for (let key in config) {
  if (t[key]) config[key] = t[key]
}
if (!config.description) config.description = config.title
if (!config.searchName) config.searchName = config.title
if (!config.searchDescription) config.searchDescription = config.description
if (!config.domainName)
  config.domainName = `${config.author.toLowerCase()}.github.io`

/**
 * ref: https://vue-meta.nuxtjs.org/api/#dangerouslydisablesanitizersbytagid
 */
let dangerouslyDisableSanitizersByTagID = (function(config) {
  let result = {}
  for (let i = 0; i < config.headScripts.length; ++i) {
    if (config.headScripts[i].innerHTML) {
      let hid = uuidv4()
      config.headScripts[i].hid = hid
      result[hid] = ['innerHTML']
    }
  }
  return result
})(config)

export { config, dangerouslyDisableSanitizersByTagID }
