import {selectTheme} from "./buildCandidateMapToCSS";

const {theme} = require("../variable.config")


function cssDeclToString(obj) {
  let result = ''
  for (let objKey in obj) {
    result += `${objKey}: ${obj[objKey]}`
  }
  return result
}

interface matchUtilitiesType {

}

export interface MetaType {
  values: object
  type: string,
  hover?: boolean
  themeKey?: string
}

export interface utilityVariationsType {
  [elemName: string]: (values: string) => { [cssProp: string]: string }
}


function getThemeValues(meta: MetaType){
  if (meta.themeKey) {
    let values = theme[meta.themeKey]
    if (typeof values === "function") {
      values = values(selectTheme)
      return values
    }
  }
}

function matchUtilities(utilityVariations: utilityVariationsType, meta: MetaType, candiValue: string, where: string): string {
  
  let result = ''
  for (let utilityVariationsKey in utilityVariations) {
    let utility = utilityVariations[utilityVariationsKey]
    
    if (typeof utility === "function") {
      /// 1. Here make CSS for @apply that for only one value...
      /// 2. Number Two for all value that define inside config.json file...
  
      // pull all values from config.json that return function or object
      let values = getThemeValues(meta)
      
      for (let valuesKey in values) {
        if (where === "apply") {
          // no. 1 description
          if(valuesKey === candiValue){
            let rule = utility(values[valuesKey])
            let ruleString = cssDeclToString(rule) + ";"
            result += ruleString
          }
          
        } else {
          // no. 2 description
  

          let rule = utility(values[valuesKey])
          
          let ruleString = cssDeclToString(rule)
          let stringRule = `.${utilityVariationsKey}-${valuesKey}{${ruleString}}`
  
          result += stringRule
          // let rule = postcss.parse(stringRule)
          // console.log(rule)
  
        }
      }
    }
  }
  
  return result
  
  // console.log(utilityVariations)
  // console.log(meta)
  //
}

export default matchUtilities

