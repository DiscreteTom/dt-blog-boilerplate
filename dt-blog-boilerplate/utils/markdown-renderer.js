import MarkdownIt from 'markdown-it'
import mip from 'markdown-it-prism'
import mia from 'markdown-it-anchor'
import math from 'markdown-it-mathjax'
import uslug from 'uslug'
import loadLanguages from 'prismjs/components/'

loadLanguages() // load all prismjs supported languages

/**
 * Markdown renderer
 */
const md = new MarkdownIt({
  html: true,
  typographer: true
})
const uslugify = s => uslug(s)
md.use(mip, {
  defaultLanguage: 'bash'
})
  .use(mia, { slugify: uslugify })
  .use(math())

export { md }
