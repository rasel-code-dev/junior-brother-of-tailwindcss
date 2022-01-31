
function getInfo (key){
  let isNegative = false
  let isDot = false
  let isSlash = false
  if (key.startsWith("-")){
    isNegative = true
  }
  if(key.indexOf(".") !== -1){
    isDot = true
  }
  if(key.indexOf("/") !== -1){
    isSlash = true
  }
  
  return { isNegative, isDot, isSlash }
}


module.exports = getInfo