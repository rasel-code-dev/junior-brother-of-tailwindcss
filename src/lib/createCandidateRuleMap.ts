
/* first make a source map inside candidateRuleMap  */
import plugins from "../plugins";

const config = require("../variable.config");
const {theme} = require("../variable.config");

function initStatePopulate(state){

  
  config.variants.forEach((variant: string)=>{
    let item = theme[variant]
    if(!item){
      
      // here available these plugin that has no themes key in variable.config.js file
      if(plugins[variant]) {
        let info = plugins[variant]()
        for (let rulesKey in info.rules) {
  
          // console.log(rulesKey, info.rules[rulesKey])
          
          state.candidateRuleMap.set(rulesKey, {
            meta: {
              cssName: info.cssName,
              pluginName: info.pluginName,
              ruleName: "",
              themeKey: ""
            },
            generateCSS: info.generateCSS,
            rules: {[rulesKey]: info.rules[rulesKey]}
          })
        }
      }
      
      // state.candidateRuleMap.set(info.ruleName, {
      //   meta: {
      //     cssName: info.cssName,
      //     ruleName: info.ruleName,
      //     pluginName: info.pluginName,
      //     themeKey: info.themeKey
      //   },
      //   rules: info.generateCSS
      // })
      
      
    } else {
      ///
      if(plugins[variant]) {
        let info = plugins[variant]()
       
        if (Array.isArray(info.rules)){ // like margin
          info.rules.forEach((rule: {[rule: string]: any})=>{
            for (let ruleKey in rule) {
              state.candidateRuleMap.set(ruleKey, {
                meta: {
                  cssName: info.cssName,
                  ruleName: info.ruleName,
                  pluginName: info.pluginName,
                  themeKey: info.themeKey
                },
                generateCSS: info.generateCSS,
                rules: {[ruleKey]: rule[ruleKey]}
              })
            }
            
          })
        }
        
        // state.candidateRuleMap.set(info.ruleName, {
        //   meta: {
        //     cssName: info.cssName,
        //     ruleName: info.ruleName,
        //     pluginName: info.pluginName,
        //     themeKey: info.themeKey
        //   },
        //   rules: info.generateCSS
        // })
      }
    }
    
    
    // if(typeof item === "function"){
    //   let themeValues = item(selectTheme)
    // }
    
  })
  // console.log(plugins["display"]())
  // console.log(state.candidateRuleMap)
}

export default initStatePopulate