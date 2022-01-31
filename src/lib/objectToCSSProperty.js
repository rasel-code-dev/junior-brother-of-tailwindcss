function objectToCSSProperty(obj){
  let r = ''
  for (let objKey in obj) {
    r+= `${objKey}: ${obj[objKey]};`
  }
  return r
}

module.exports = objectToCSSProperty