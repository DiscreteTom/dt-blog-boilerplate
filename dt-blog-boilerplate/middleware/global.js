export default function({ route, redirect, store }) {
  // redirect to the root object
  if (route.path == '/' || route.path == '') {
    return redirect('/' + store.state.config.root + '/')
  }

  // format path
  if (!route.path.endsWith('/')) {
    return redirect(route.path + '/')
  }

  // update displayToc && current
  let dirent = store.state.pathMap[route.path]
  if (dirent == null) {
    // this is not a dirent, e.g. 404, friends, tags
    store.commit('setHasToc', false)
  } else {
    // this is a dirent
    store.commit('setCurrent', dirent)
    store.commit('setHasToc', !dirent.isDir && dirent.toc)
  }
}
