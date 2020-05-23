export default function({ route, redirect, store }) {
  let path = route.path
  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }
  let dirent = store.state.pathMap[path]
  if (dirent == null) {
    redirect('/404')
    return
  }
  // update state
  store.commit('setCurrent', dirent)
}
