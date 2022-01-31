function hasStringColor(color) {
  return !(
    color.startsWith('rgba(') ||
    color.startsWith('hsla(') ||
    (color.startsWith('#'))
  )
}

module.exports = hasStringColor