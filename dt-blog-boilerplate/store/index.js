export default {
  state() {
    return {
      // load env constants from nuxt config
      config: process.env.config,
      root: process.env.root,
      pathMap: process.env.pathMap,
      tagMap: process.env.tagMap,
      // other vars
      /**
       * ```
       * [{ text: '', exact: true, to: '/' }]
       * ```
       */
      navs: [], // displayed in components/BreadCrumbs
      current: process.env.root, // current dirent
      hasToc: false
    }
  },
  mutations: {
    /**
     * Set current `dirent`, update `navs`
     */
    setCurrent(state, dirent) {
      state.current = dirent
      state.navs = dirent.path // => '/xxx/xxx/'
        .split('/') // =>['', 'xxx', 'xxx', '']
        .slice(1, -1) // => ['xxx', 'xxx']
        .reduce(
          (result, name, i) => {
            let to = result[i].to + name + '/'
            result.push({
              text: state.pathMap[to].title,
              exact: true,
              to
            })
            return result
          },
          [{ text: '', exact: true, to: '/' }]
        )
        .slice(1) // remove the '' route
      // the last nav is not exact, it allows `#`
      state.navs[state.navs.length - 1].exact = false
    },
    setHasToc(state, v = false) {
      state.hasToc = v
    }
  }
}
