
function parseUnit(o){
  let oo = {}
  for (const oKey in o) {
    let val =  o[oKey] === "0px" ? 0 : o[oKey]
    if(oKey === "DEFAULT"){
      oo[''] = val
    } else {
      oo[oKey] = val
    }
  }
  return oo
}


module.exports = parseUnit