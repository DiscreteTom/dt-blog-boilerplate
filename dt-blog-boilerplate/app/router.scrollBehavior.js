export default function(to, from, savedPosition) {
  // if in same page
  if (to.path == from.path) {
    if (to.hash) {
      // same page click anchor
      return {} // don't scroll, use $vuetify.goTo to get a correct position
    } else {
      // no anchor, go to top
      return { x: 0, y: 0 }
    }
  } else {
    // different page, go to top
    return { x: 0, y: 0 }
  }
}
