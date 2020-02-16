export default function({ route, redirect, store }) {
  if (route.path == '/') {
    // redirect to the root object
    redirect('/' + store.state.config.root)
  }
}
