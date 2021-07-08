import MarkdownIt from 'markdown-it'
import mip from 'markdown-it-prism'
import mia from 'markdown-it-anchor'
import math from 'markdown-it-mathjax'
import uslug from 'uslug'
import loadLanguages from 'prismjs/components/'

loadLanguages() // load all prismjs supported languages

function buildRenderer() {
  /**
   * Markdown renderer
   */
  const md = new MarkdownIt({
    html: true,
    typographer: true
  })

  let repeatedHeader = {} // {header: count}
  function uslugify(s) {
    if (s in repeatedHeader) {
      repeatedHeader[s] += 1
    } else {
      repeatedHeader[s] = 0
    }

    if (repeatedHeader[s] == 0) return uslug(s)
    else {
      // ref: https://gist.github.com/jonschlinkert/ac5d8122bfaaa394f896
      return uslug(s) + '-' + repeatedHeader[s]
    }
  }

  md.use(mip, {
    defaultLanguage: 'bash'
  })
    .use(mia, { slugify: uslugify })
    .use(math())
  return md
}

export { buildRenderer }
