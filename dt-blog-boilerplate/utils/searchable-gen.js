import fs from 'fs'
import { pathMap } from './content'
import jieba from 'nodejieba'
import remark from 'remark'
import strip from 'strip-markdown'
import fm from 'remark-frontmatter'
import rimraf from 'rimraf'
import { config } from './config'

/**
 * For example, search `apple` in a file:
 * ```
 * {
 *   'a': {
 *     'apple': [paths]
 *   }
 * }
 * ```
 */
let searchTable = {}
let searchRoutes = []
const staticDir = './static/searchable-static'

let md = remark()
  .use(fm)
  .use(strip)

const noise = ' \\\n\t\r"\'>|?<[.,/#!$%^&*;:{}=-+_`~()]！？｡。＂＃＄％＆＇（）＊＋，－／：；＜＝＞＠［＼］＾＿｀｛｜｝～｟｠｢｣､、〃》「」『』【】〔〕〖〗〘〙〚〛〜〝〞〟〰〾〿–—‘’‛“”„‟…‧﹏.'.split(
  ''
)

/**
 * generate searchable static files, `searchTable` and `searchRoutes`
 */
function generateSearchableContent() {
  // clear existing static files
  rimraf.sync(staticDir)

  // construct searchTable according to pathMap
  for (const [path, dirent] of Object.entries(pathMap)) {
    // ignore dir, parse markdown files only
    if (dirent.isDir) continue

    // read file and split words
    let text = fs.readFileSync(dirent.absPath, 'utf8')
    let words = new Set(
      jieba
        .cutForSearch(String(md.processSync(text)), true)
        .filter(word => !(word.length == 0 || noise.includes(word)))
        .map(word => word.toLowerCase())
    )

    // construct searchTable and searchRoutes
    words.forEach(w => {
      let start = w[0]
      if (!(start in searchTable)) {
        searchTable[start] = {}
      }
      if (!(w in searchTable[start])) {
        searchTable[start][w] = []
      }
      searchTable[start][w].push(dirent.path)
      searchRoutes.push(`/search/${w}/`)
    })
  }

  // write searchTable to static files
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir)
  }
  for (const [start, content] of Object.entries(searchTable)) {
    try {
      fs.writeFileSync(`${staticDir}/${start}.json`, JSON.stringify(content))
    } catch (error) {
      console.log(`Failed to generate static file: ${staticDir}/${start}.json`)
      console.log(error)
    }
  }
}

generateSearchableContent()

// add tab-to-search
let openSearchFile = `
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${config.searchName}</ShortName>
  <Description>${config.searchDescription}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url type="text/html" template="https://${config.domainName}/search/{searchTerms}/"/>
</OpenSearchDescription>
`
fs.writeFileSync(`./static/content-search.xml`, openSearchFile)

export { searchRoutes }
