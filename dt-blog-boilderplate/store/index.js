export default {
  state() {
    return {
      // load env constants from nuxt config
      config: process.env.config,
      root: process.env.root,
      pathMap: process.env.pathMap,
      // other vars
      ready: false, // routes are correct, ready to render
      navs: [], // displayed in components/BreadCrumbs
      current: process.env.root
    }
  },
  mutations: {
    /**
     * Set current `dirent`, update `navs` and set `ready` to true
     */
    setCurrent(state, dirent) {
      state.current = dirent
      state.navs = dirent.path // => '/xxx/xxx'
        .split('/') // =>['', 'xxx', 'xxx]
        .slice(1) // => ['xxx', 'xxx']
        .reduce(
          (result, name, i) => {
            let to = [result[i].to, name].join('/')
            result.push({
              text: state.pathMap[to].title,
              exact: true,
              to
            })
            return result
          },
          [{ text: '', exact: true, to: '' }]
        )
        .slice(1) // remove the '' route
      state.ready = true
    }
  }
}
