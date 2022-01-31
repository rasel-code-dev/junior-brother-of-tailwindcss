
import plugins from "../plugins"
import postcss from "postcss";
const {theme} = require("../variable.config")
const config = require("../variable.config")

function makeTextColor(classPrefix, cssPropValue){
  return {
    selector:  `text-${classPrefix}`,
    cssValue: `color: ${cssPropValue}`
  }
}

export function selectTheme(themeKey){
  return theme[themeKey]
}





function initClass(root, rule, state){
  let candidate = state.candidateRuleMap
  
  candidate.forEach((candidateValue, candidateKey)=>{
    
    // find plugin to get
    // let plugin = plugins[candidateValue.meta.pluginName] && plugins[candidateValue.meta.pluginName]()
    if(candidateValue.meta.themeKey !== ""){ // like display
      // console.log(candidateValue.meta, candidateValue.rules)
      let strCss = candidateValue.generateCSS(candidateValue.meta, candidateValue.rules, null, "")
      root.append(postcss.parse(strCss))
  
      // like backgroundColor
    } else {
      let strCss = candidateValue.generateCSS(candidateValue.meta, candidateValue.rules, null, "")
      root.append(postcss.parse(strCss))
    }
    
    // this create that has theme value
    // if(plugin.themeKey) {
      // console.log(plugin.themeKey)

      // let themeObj = theme[plugin.themeKey]
      // if (typeof themeObj === "function") {
      //   themeObj = themeObj(selectTheme)
      //   let strCss = plugin.generateCSS(themeObj)
      //   // root.append(postcss.parse(strCss))
      // }
    // } else {
      // like display, textAlign
      // let plugin = plugins[candidateValue.meta.pluginName]()
      //
      // let stringCSS = plugin.generateCSS(candidateValue.meta)
      // root.append(postcss.parse(stringCSS))
    // }
  })
  
  // for (let candidateKey in candidate) {
  //   let plugin = plugins[candidate[candidateKey].meta.cssName]
  //   let pluginObj = plugin()
  //   let themeObj = theme[pluginObj.themeKey]
  //   if( typeof themeObj === "function"){
  //     themeObj = themeObj(selectTheme)
  //     let strCss = pluginObj.generateCSS(themeObj)
  //     root.append(postcss.parse(strCss))
  //   }
  // }
  
  // make background classes...
  // for (let colorsKey in variable.colors) {
  //   let cssResult = makeBackground(colorsKey, variable.colors[colorsKey])
  //   let selector = new postcss.Rule({selector: `.${cssResult.selector}`})
  //   selector.append(cssResult.cssValue)
  //   root.append(selector)
  //
  //   // let textResult = makeTextColor(colorsKey, variable.colors[colorsKey])
  //   // let selector2 = new postcss.Rule({selector: `.${textResult.selector}`})
  //   // selector2.append(textResult.cssValue)
  //   // root.append(selector2)
  // }
  
  // root.append(a)
  // root.nodes.push('.nnn{color: red}')
  
  
}

export default initClass