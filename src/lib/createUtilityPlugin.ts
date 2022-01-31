import {state} from "../index";

const getThemeObj = require("../lib/getThemeObj");
const matchUtilities = require("./matchUtilities");
const parseUnit = require("./parseUnit");

// function prefixNegativeModifiers(base, modifier) {
//   if (modifier === '-') {
//     return `-${base}`
//   } else if ("s".startsWith(modifier, '-')) {
//     return `-${base}-${modifier.slice(1)}`
//   } else {
//     return `${base}-${modifier}`
//   }
// }
//
// const config = require("../../variable.config")
const {theme} = require("../variable.config");

function asClass(name) {
  // return escapeCommas(`.${escapeClassName(name)}`)
}

// function nameClass(classPrefix, key) {
//   if (key === 'DEFAULT') {
//     return asClass(classPrefix)
//   }
//
//   if (key === '-') {
//     return asClass(`-${classPrefix}`)
//   }
//
//   if (key.startsWith('-')) {
//     return asClass(`-${classPrefix}${key}`)
//   }
//
//   return asClass(`${classPrefix}-${key}`)
// }


type Meta = {
  cssName: string,
  ruleName: string,
  themeKey: string,
  pluginName: string
}


// function flatten(key, values){
//   let flat = {}
//   for (let valuesKey in values) {
//     flat[`${key.slice(0, key.length - 1)}-${valuesKey}`] = values[valuesKey]
//   }
//   return flat
// }


function selectTheme(themeKey){
  return theme[themeKey]
}




function createUtilityPlugin(meta: Meta, utilityVariations: object, themeValue: (string | number)){
  let result = ''
  
  for (let utilityVariationsKey in utilityVariations) {
    
    let themeValues = theme[meta.themeKey](selectTheme)
    // for all values
    for (let themeValuesKey in themeValues) {
      // console.log(utilityVariationsKey, utilityVariations[utilityVariationsKey], themeValuesKey)
      
      // Here are two direction one create css for @apply and another for all css make with theme values...
      if(!themeValuesKey){
        let css = `.${utilityVariationsKey}-${themeValuesKey}{
          ${utilityVariations[utilityVariationsKey]} : ${themeValues[themeValuesKey]}
        }`
        result += css
        
        
        
      } else {
        if(themeValuesKey == themeValue){
          console.log("----------------")
          let css = `${utilityVariations[utilityVariationsKey]} : ${themeValues[themeValue]};`
          
          state.classCache.set(
            `.${utilityVariationsKey}-${themeValue}`,
            `${utilityVariations[utilityVariationsKey]} : ${themeValues[themeValue]}`
          )
          result += css
        }
      }
    }
  }

  // console.log(state)
  return result
  // let result = ''
  // let f = getThemeObj(themeKey)
  // if(typeof f === "function"){
  //   let values = f((key)=>  {
  //     if(key === "screens") {
  //       return flatten(key, getThemeObj(key))
  //     } else {
  //       return getThemeObj(key)
  //     }
  //   })
  //
  //     result += matchUtilities(
  //       utilityVariations,
  //       { values: parseUnit(values), type: "any", hover: options.hover },
  //       options.forMedia
  //     )
  //   } else {
  //
  //     result += matchUtilities(
  //       utilityVariations,
  //       { values: parseUnit(f), type: "any", hover: options.hover },
  //       options.forMedia
  //     )
  // }
  //
  // return result
}



export default createUtilityPlugin