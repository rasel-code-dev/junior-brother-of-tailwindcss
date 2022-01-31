
const getThemeObj = require("./getThemeObj")


export default function (themeKey){
  let colors = {}
  if(typeof themeKey === "function"){
    let item = themeKey(getThemeObj)
    colors = makeFlattenObj(item)
    
  } else if(typeof themeKey === "string"){
    let item = getThemeObj(themeKey)
    if (typeof item === "function"){
      if(typeof item(getThemeObj) === "function"){
        let f = item(getThemeObj)(getThemeObj)
        colors = makeFlattenObj(f)
      }
    }
  } else if(typeof  themeKey == "object"){
    colors = makeFlattenObj(themeKey)
  }
  return colors
}


function makeFlattenObj(items){
  let result = {}
  for (const itemKey in items) {
    if(typeof items[itemKey] === "object"){
      let nestedColorObj = items[itemKey]
      for (const nestedColorObjKey in nestedColorObj) {
        result[itemKey+'-'+nestedColorObjKey] = nestedColorObj[nestedColorObjKey]
      }
    } else {
      result[itemKey] = items[itemKey]
    }
  }
  return result
}