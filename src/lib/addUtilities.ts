import { configValueType} from "./matchUtilities";

// const objectToCSSProperty = require("./objectToCSSProperty");


export interface AddUtilities_utilityType{
  [className: string]: string
}
export interface AddUtilities_configValueType{
  cssName?: string,
  ruleName?: string,
  pluginName?: string,
  themeKey?: string,
}

export default function addUtilities(utility: AddUtilities_utilityType, configValue: AddUtilities_configValueType, candiName: string, where: ["apply", ""]){
  let result = ''
  for (let utilityKey in utility) {
    if (where === "apply" && utilityKey === candiName) {
      let rule = `${configValue.cssName}: ${utility[utilityKey]}`
      result += rule
    } else {
      let rule = `.${utilityKey}{${configValue.cssName}: ${utility[utilityKey]}}`
      result += rule
    }
  }
  return result
  
  
  // console.log(configValue)
  
  // let result = ''
  // let hoverResult = ''
  // for (const utilitiesKey in utilities) {
  //   let rule;
  //   if(typeof utilities[utilitiesKey] === "object") {   // like transform
  //     let objToStringCss = objectToCSSProperty(utilities[utilitiesKey])
  //     rule = `${utilitiesKey}{${objToStringCss}}`
  //     if(hover){ hoverResult += `.hover\\:${utilitiesKey.slice(1)}:hover{${objToStringCss}}`}
  //
  //   } else {  // like [textAlign, transform]
  //     if(hover){ hoverResult += `.hover\\:${utilitiesKey.slice(1)}:hover{${cssPropName}: ${utilities[utilitiesKey]}}`}
  //     rule = `${utilitiesKey}{${cssPropName}: ${utilities[utilitiesKey]}}`
  //   }
  //
  //   forMedia && forMedia(rule)
  //   result += rule
  // }
  // return JSON.stringify({ result, hoverResult})
}

