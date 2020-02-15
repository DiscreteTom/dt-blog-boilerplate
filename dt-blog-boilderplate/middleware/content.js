export default function({ route, redirect, store }) {
  let dirent = store.state.pathMap[route.path]
  if (dirent == null) {
    redirect('/404')
    return
  }
  // update state
  store.commit('setCurrent', dirent)
}
