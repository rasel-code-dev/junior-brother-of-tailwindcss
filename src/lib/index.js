const expandApplyAtRules = require("./expandApplyAtRules");
const generateRules = require("./generateRules")
const parseConfigToUtilities = require("../util/parseConfigToUtilities");
const parseColorsUtilities = require("../util/parseColorsUtilities");
const makeContainer = require("../util/makeContainer");
const makeTransformRule = require("../util/makeTransformRule");


const utilities = require("../plugins")
const config =  require("../../variable.config");
const postcss = require("postcss");
const makeTranslateRule = require("../util/makeTranslateRule");

let storeCSS = new Map()


function forMedia(rule){
  let q = config.theme["screens"]
  for (const qKey in q) {
    let f = `.${qKey}\\:${rule.slice(1)}`
    if(storeCSS.get(qKey)) {
      storeCSS.set(qKey, storeCSS.get(qKey) +  f )
    } else {
      storeCSS.set(qKey, f)
    }
  }
}

/* use this like
  if(items.mediaQueries) {
    forMedia(
      `${classesKey}{${items.cssPropName}: ${items.classes[classesKey]}}`
      , items.mediaQueries)
  }
*/


function myPlugin (){
  
  return (root) => {
    // generateRulesAll(root, forMedia)
    // // expandApplyAtRules(root)
    // // parseConfigToUtilities(root)
  
    console.log(root)
    
    setTimeout(()=>{
      // console.log(storeCSS)
    }, 100)
    
    
    // push mediaQuery...
    let mediaKeys = storeCSS.keys()
    for (const mediaKey of mediaKeys) {

      let mediaValue =  config.theme["screens"][mediaKey]
      let mediaQ = `@media screen and (min-width: ${mediaValue}){
      ${storeCSS.get(mediaKey)}
    }`
      root.append(mediaQ)
    }
  }
}

function parseColor(configItem) {
  // configItem.fn()
}

function theme(prop){
  if(typeof config.theme[prop] === "function"){
    return config.theme[prop](theme)
  } else {
    return config.theme[prop]
  }
}


function generateRulesAll(root, forMedia) {
  let result = ""
  
  
  
  let items = []
  for (let utilityKey in utilities) {
    items.push(utilities[utilityKey])
  }
  
  for (const item of items) {
    let c = item(forMedia)
    
    if(typeof c === "function"){
      let obj = c(theme)
      if(obj){
        let r = JSON.parse(obj)
        if(r.result){
          result+=r.result
        }
        if(r.hoverResult){
          result+=r.hoverResult
        }
      }
    } else {
      if(c){
        let r = JSON.parse(c)
        if(r.result){
          result+=r.result
        }
        if(r.hoverResult){
          result+=r.hoverResult
        }
      }
    }
  }

  let withOpacity = ["color", "background-color", "border-color", "p"]
  
  // for (const item of items) {
    // let itemO = item()
    // parseColor(itemO)
    // if(withOpacity.indexOf(itemO.cssPropName) !== -1){
    //   let {result, hover} = parseColorsUtilities(itemO, forMedia)
    //   root.append(postcss.parse(result))
    //   root.append(postcss.parse(hover))
    //
    // } else {
    //   if(itemO.themeKey === "container") {
    //     makeContainer(itemO, root, forMedia)
    //   } else if(itemO.themeKey === "transform"){
    //     makeTransformRule(itemO, root, forMedia)
    //   } else if(itemO.themeKey === "translate"){
    //     makeTranslateRule(itemO, root, forMedia)
    //   } else {
    //     generateRules(itemO, root, forMedia)
    //   }
    // }
  // }

  root.append(postcss.parse(result))
  
  
  
  // for (let node of root.nodes){
  //   if(node.selector.startsWith(".bg-") && node.selector.indexOf("opacity") === -1){
  //     console.log(node)
  //     node.append(`--rsl-bg-opacity: 1`)
  //   }
  // }
  
}


function makeDefaultCss(preloadCss, root){
  root.append(preloadCss)
}



module.exports = { forMedia: forMedia, myPlugin}
