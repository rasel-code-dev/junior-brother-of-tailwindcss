const getScapeSign = require("./getScapeSign");
const objectToCSSProperty = require("./objectToCSSProperty");
const hasStringColor = require("./hasStringColor");




// interface configValue {
//   type: string,
//   values: {}[]
//   breakpoint: boolean
// }


function matchUtilities(utilityVariations, configValue, forMedia){
  let result = ''
  
  let { values,  breakpoint, type } = configValue
  
  
  let ruleName = Object.keys(utilityVariations)[0]
  
  for(let valueKey in values) {
    if(type === "color") {
      let ruleStr = ''
      let css;
      let ruleName = Object.keys(utilityVariations)[0]
      if(hasStringColor(values[valueKey])){
        css = utilityVariations[ruleName](values[valueKey], false)
      } else {
        css = utilityVariations[ruleName](values[valueKey], true)
      }
      
      for (const cssKey in css) {
        
        // like
        if(cssKey.startsWith("&::")){
          let pseudo = cssKey.replace("::", '')
          
          /*{
            '--rsl-placeholder-opacity': 1,
            color: 'rgba(116, 42, 42, var(--rsl-placeholder-opacity))'
          }*/
          if(typeof css[cssKey] === "object") {
            // ruleStr += `${pseudo}-${valueKey}: ${css[cssKey]}; `
            let allCssPros = ''
            let csssObj =  css[cssKey]
            for (const csssObjKey in csssObj) {
              allCssPros += `${csssObjKey}: ${csssObj[csssObjKey]};`
            }
            result += `.${ruleName}-${valueKey}${cssKey.slice(1)}{ ${allCssPros}}`
            
          } else {
            ruleStr += `${ruleName}-${valueKey}: ${css[cssKey]}; `
          }
          
          
          /* like divideColor */
        } else if(cssKey.startsWith("& >")) {
          
          if(typeof css[cssKey] === "object") {
            let allCssPros = ''
            let csssObj = css[cssKey]
            for (const csssObjKey in csssObj) {
              allCssPros += `${csssObjKey}: ${csssObj[csssObjKey]};`
            }
            result += `.${ruleName}-${valueKey}${cssKey.slice(1)}{ ${allCssPros}}`
          }
          
        } else{
          
          ruleStr += `${cssKey}: ${css[cssKey]}; `
          let rule = `.${ruleName}-${valueKey}{ ${ruleStr}}`
          ruleStr = ''
          forMedia && forMedia(rule)
          result += rule
          
        }
      }
      
    } else {
      
      /* handle for margin padding borderWidth placeholder-opacity */
      for (let utilityVariationsKey in utilityVariations) {
        /* also handle here
          'mx': ['margin-left', 'margin-right'],
          'my': ['margin-top', 'margin-bottom'],
        */
        if (typeof utilityVariations[utilityVariationsKey] === "object") {
          
          let info = getInfo(valueKey)
          if(info.isDot){
            let splitter = getScapeSign(".")
            let CSSString = ''
            let pairCSSObj = utilityVariations[utilityVariationsKey]
            
            for (const pairCSSItem of pairCSSObj) {
              CSSString += `${pairCSSItem}: ${values[valueKey]};`
            }
            let valueKeySplit = valueKey.split(".")
            if(info.isNegative){
              let rule = createDoubleRuleName(
                utilityVariations,
                utilityVariationsKey,
                values,
                valueKey,
                valueKeySplit,
                true,
                splitter,
                CSSString,
              )
              result += rule
            } else {
              let rule = createDoubleRuleName(
                utilityVariations,
                utilityVariationsKey,
                values,
                valueKey,
                valueKeySplit,
                false,
                splitter,
                CSSString
              )
              // forMedia && forMedia(rule)
              result += rule
            }
          } else if(info.isSlash){
            let splitter = getScapeSign("/")
            
          } else {
            
            let CSSString = ''
            let pairCSSObj = utilityVariations[utilityVariationsKey]
            
            for (const pairCSSItem of pairCSSObj) {
              CSSString += `${pairCSSItem}: ${values[valueKey]};`
            }
            if(info.isNegative) {
              let rule = createSimpleRuleName(
                utilityVariations,
                utilityVariationsKey,
                values,
                valueKey,
                true,
                CSSString
              )
              result += rule
            } else {
              let rule = createSimpleRuleName(
                utilityVariations,
                utilityVariationsKey,
                values,
                valueKey,
                false,
                CSSString
              )
              result += rule
            }
          }
          
        } else if(typeof utilityVariations[utilityVariationsKey] === "function") {
          
          /// complex pseudo class like placeholder-opacity
          let utilityVariationObj = utilityVariations[utilityVariationsKey](values[valueKey])
          for (const utilityVariationObjKey in utilityVariationObj) {
            
            if(utilityVariationObjKey.startsWith("&::")){
              let s = objectToCSSProperty(utilityVariationObj[utilityVariationObjKey])
              let rule = `.${ruleName}-${valueKey}${utilityVariationObjKey.slice(1)}{${s}}`
              // .placeholder-opacity-5::placeholder{--rsl-placeholder-opacity: 0.05;}
              result += rule
            } else if(utilityVariationObjKey.startsWith("& >")) {
              
              // .divide-x-2 > :not([hidden]) ~ :not([hidden]) {}
              
              // .space-x-4 > :not([hidden]) ~ :not([hidden]) {
              //   --tw-space-x-reverse: 0;
              //   margin-right: calc(1rem * var(--tw-space-x-reverse));
              //   margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
              // }
              
              let cssObjString = objectToCSSProperty(utilityVariationObj[utilityVariationObjKey])
              let empty = valueKey === ""
              let rule = `.${utilityVariationsKey}${empty ? "" : "-"}${valueKey}${utilityVariationObjKey.slice(1)} {
                  ${cssObjString}
                }`
              result += rule
              
            } else {
              let s = objectToCSSProperty(utilityVariationObj[utilityVariationObjKey])
              let rule = `.${ruleName}-${valueKey}{${s}}`
              result += rule
            }
          }
          
        } else if(typeof utilityVariations[utilityVariationsKey] === "string" || typeof utilityVariations[utilityVariationsKey] === "number"){
          // like width margin borderWidth
          let info = getInfo(valueKey)
          
          if (info.isDot){
            let splitter = getScapeSign(".")
            if(info.isNegative){
              
              let valueKeySplit =  valueKey.split(".")
              let r = createDoubleRuleName(
                utilityVariations,
                utilityVariationsKey,
                values,
                valueKey,
                valueKeySplit,
                true,
                splitter
              )
              result += r
              forMedia && forMedia(r)
            } else {
              
              let valueKeySplit =  valueKey.split(".")
              let r = createDoubleRuleName(
                utilityVariations,
                utilityVariationsKey,
                values,
                valueKey,
                valueKeySplit,
                false,
                splitter
              )
              forMedia && forMedia(r)
              result += r
            }
          } else if(info.isSlash) {
            let splitter = getScapeSign("/")
            if(info.isNegative){
              // let rule = createSimpleRuleName(
              //   utilityVariations,
              //   utilityVariationsKey,
              //   values,
              //   valueKey,
              //   true,
              //   undefined,
              //   splitter
              // )
              // console.log(rule)
            } else {
              
              let valueKeySplit = valueKey.split("/")
              let rule = createDoubleRuleName(
                utilityVariations,
                utilityVariationsKey,
                values,
                valueKey,
                valueKeySplit,
                false,
                splitter
              )
              result += rule
            }
            
          } else {
            // handle plugin like maxWidth
            if(info.isNegative) {
              let rule = createSimpleRuleName(
                utilityVariations,
                utilityVariationsKey,
                values,
                valueKey,
                true
              )
              forMedia && forMedia(rule)
              result += rule
            } else {
              
              let rule = createSimpleRuleName(
                utilityVariations,
                utilityVariationsKey,
                values,
                valueKey,
                false
              )
              forMedia && forMedia(rule)
              result += rule
            }
          }
        }
      }
    }
  }
  return result
}
module.exports  = matchUtilities

function createSimpleRuleName(utilityVariations, utilityVariationsKey, values, valueKey, isNegative, CSSString){
  const isEmpty = valueKey === ""
  let css = `${utilityVariations[utilityVariationsKey]}: ${values[valueKey]}`
  
  let rule = `.${isNegative ? "-" : ''}${utilityVariationsKey}${ isNegative ? '' : isEmpty ? "" : '-'}${valueKey}{
      ${CSSString ? CSSString : css}
  } `
  return rule
}

function createDoubleRuleName(utilityVariations, utilityVariationsKey, values, valueKey, valueKeySplit, isNegative, splitter, CSSString){
  let css = `${utilityVariations[utilityVariationsKey]}: ${values[valueKey]}`
  const isEmpty = valueKey === ""
  let r = `.${isNegative ? "-" : ''}${utilityVariationsKey}${isNegative ? '' : isEmpty ? "" : '-' }${valueKeySplit[0]}${splitter}${valueKeySplit[1]}{
    ${CSSString ? CSSString : css}
  }`
  return r
}

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



/*
let ruleStr = ''
let css;
let ruleName = Object.keys(utilityVariations)[0]
// if(hasStringColor(values[valueKey])){
//   css = utilityVariations[ruleName](values[valueKey], false)
// } else {
css = utilityVariations[ruleName](values[valueKey], true)
console.log(css)
// }
// for (const cssKey in css) {
//   ruleStr += `${cssKey}: ${css[cssKey]}; `
// }

// let rule = `.${ruleName}-${valueKey}{ ${ruleStr}}`
// console.log(rule)
// ruleStr = ''
// forMedia && forMedia(rule)
// result += rule

 */