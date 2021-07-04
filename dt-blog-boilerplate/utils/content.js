import fs from 'fs'
import yaml from 'js-yaml'
import matter from 'gray-matter'
import toc from 'markdown-toc'
import { config } from './config'

/**
 * `path`=>`dirent`
 *
 * e.g.: `"/index/"`=>`dirent`
 */
let pathMap = {}
/**
 * `tag` => `[path]`
 */
let tagMap = {}
/**
 * The `../content` folder.
 */
let root = loadFolder('../content')
/**
 * Construct pathMap & tagMap, return content tree
 */
function loadFolder(absPath, path = '/') {
  // init folderConfig
  let folderConfig = {
    icon: config.folderIcon,
    orderDecider: config.orderDecider,
    title: '',
    reverse: config.reverse,
    description: '',
    tags: [],
    img: ''
  }
  // update folderConfig if `_config.yml` exists
  let ymlContent = ''
  try {
    // config file is optional
    ymlContent = fs.readFileSync(absPath + '/_config.yml', 'utf8')
  } catch {}
  if (ymlContent) {
    // if config is not a valid yml, throw err
    let t = yaml.safeLoad(ymlContent)
    // update folderConfig
    for (let key in folderConfig) {
      if (t[key]) folderConfig[key] = t[key]
    }
  }
  // construct children
  let children = fs
    .readdirSync(absPath, { withFileTypes: true })
    .filter(dirent => !dirent.name.startsWith('_')) // ignore dirents starts with `_`
    .map(child => {
      let childRawName = child.name // => 'order@name.suffix'
      let childAbsPath = [absPath, childRawName].join('/') // '../content/rawName1/rawName2'
      let childRawPath = childAbsPath.slice(10) // '/rawName1/rawName2'
      let childOrder = 0
      let childName = childRawName
      let childPath = '' // '/name1/name2'

      // update childName, childPath and childOrder by orderDecider & file name suffix
      let orderDeciderIndex = childRawName.indexOf(folderConfig.orderDecider)
      if (orderDeciderIndex !== -1) {
        // orderDecider exists
        let t = childRawName.split(folderConfig.orderDecider)
        if (t[0] !== '') {
          childOrder = Number(t[0])
          if (isNaN(childOrder))
            throw new Error(
              `Invalid file name, please check the orderDecider of: ${childRawPath}`
            )
        }
        childName = childRawName.slice(orderDeciderIndex + 1)
      }
      childName = childName.split('.')[0] // remove file name suffix
      if (childName == '') childName = String(childOrder) // default childName is childOrder
      childPath = path + childName + '/'

      // construct child by chile type
      let ret = {
        isDir: child.isDirectory(),
        icon: '', // will be overwrote below
        name: childName, // in path
        rawName: childRawName, // 'order@name.suffix'
        title: '', // for display, will be overwrote below.
        order: childOrder,
        absPath: childAbsPath,
        rawPath: childRawPath,
        path: childPath,
        description: '', // if current is a folder, will be overwrote below
        img: '', // will be overwrote below
        tags: [], // will be overwrote below
        children: [], // will be overwrote below
        toc: null, // only effective for md file
        siblings: true, // only effective for md file
        parentPath: path // ref the parent object will cause circular structure, so ref parent path
      }
      if (child.isDirectory()) {
        // if this child is a folder
        let t = loadFolder(childAbsPath, childPath)
        ret.icon = t.icon
        ret.title = t.title || childName
        ret.children = t.children
        ret.description = t.description || ret.title
        ret.img = t.img
        ret.tags = t.tags
      } else {
        // this child is not a folder
        // get markdown attributes
        let mdFileContent = fs.readFileSync(childAbsPath).toString()
        let attributes = matter(mdFileContent).data
        // update result
        ret.icon = attributes.icon || config.fileIcon
        ret.title = attributes.title || childName
        ret.description = attributes.description || ret.title
        ret.img = attributes.img
        ret.tags = attributes.tags || []
        ret.toc = attributes.toc == null ? true : attributes.toc
        ret.siblings = attributes.siblings == null ? true : attributes.siblings
        // get toc
        if (ret.toc) {
          ret.toc = toc(mdFileContent).json
          // get max level
          let maxLvl = 0
          let minLvl = 0
          ret.toc.map(header => {
            if (header.lvl > maxLvl) maxLvl = header.lvl
            if (!minLvl || header.lvl < minLvl) minLvl = header.lvl
          })
          // make sure toc header levels start from 1
          ret.toc = ret.toc.map(header => {
            header.lvl = header.lvl - minLvl + 1
            return header
          })
        }
      }

      // update tagMap
      ret.tags.map(tag => {
        if (tagMap[tag]) tagMap[tag].push(ret.path)
        else tagMap[tag] = [ret.path]
      })
      // update pathMap
      pathMap[ret.path] = ret
      return ret
    }) // end of children construction

  // sort children by their order
  children.sort((a, b) =>
    folderConfig.reverse ? b.order - a.order : a.order - b.order
  )

  // construct result
  let result = {
    isDir: true,
    icon: folderConfig.icon,
    rawName: '', // will be overwritten by parent
    name: '', // will be overwritten by parent
    title: folderConfig.title,
    order: 0, // will be overwritten by parent
    absPath: '../content', // will be overwritten by parent
    rawPath: '/', // will be overwritten by parent
    path: '/', // will be overwritten by parent
    description: folderConfig.description,
    img: folderConfig.img,
    tags: folderConfig.tags,
    children,
    toc: null, // only effective for md file
    siblings: true, // only effective for md file
    parentPath: ''
  }

  return result
}

/**
 * For `nuxt generate`
 */
let contentRoutes = []
for (let key in pathMap) {
  contentRoutes.push(key)
}
let tagsRoutes = (function() {
  let result = []
  for (let key in tagMap) {
    result.push('/tags/' + key + '/')
  }
  return result
})()

export { pathMap, tagMap, root, contentRoutes, tagsRoutes }
