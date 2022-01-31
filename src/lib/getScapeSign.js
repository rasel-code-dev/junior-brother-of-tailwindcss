
function getScapeSign(sign){

  let s = ''
  if(sign === ".") {
    s = '\\.'
  } else if(sign === "/") {
    s = "\\/"
  }
  return s
}

module.exports = getScapeSign