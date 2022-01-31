import postcss from "postcss";

let p = []

export default function initStatePopulate(root, state){
  // console.log(root)
    root.walkAtRules(rule => {
     
      if (rule.type === "atrule" && rule.name === "apply"){
        let params = rule.params.split(" ")
        params.forEach((p: string)=>{
          state.applyClassCache.add(p)
        })
      }
    })
    makeCSSFORApplyCache(state, root);
}
function parseApplyClass(params){
  let p;
  if(params.indexOf("-") !== -1){
    p = params.split("-")
  } else {
    p = params  // no under line single string like [block flex]
  }
  return p
}
function makeCSSFORApplyCache(state, root) {
  // console.log(applyClassCache)
  let index = 1
  state.applyClassCache.forEach((className: string)=>{
    let ruleName = parseApplyClass(className)
    let strCSS = ""
    // that not depending on theme.config.js and one single word string like block alignCenter
    if(typeof ruleName === "string"){ // block flex none
      let candidate = state.candidateRuleMap.get(ruleName)
      strCSS = candidate.generateCSS(candidate.meta, candidate.rules, ruleName, "apply") // meta: any, utilityVariations: any,
    } else {
      
      // find something class that has between underscore like bg-primary, margin-10, text-primary
      let candiName = ruleName[0]
      let candiValue = ruleName[1]
      let candidate = state.candidateRuleMap.get(candiName)
      
      
      if (candidate) {
        strCSS = candidate.generateCSS(candidate.meta, candidate.rules, candiValue, "apply") // meta: any, utilityVariations: any,
      
      } else {
        console.error("not implement " + className)
      }
    }
  
    // append css inside rule...
    root.walkAtRules((rule, i) => {
      if (rule.type === "atrule" && rule.name === "apply") {
        rule.parent.nodes.push(postcss.parse(strCSS))
        if (index === state.applyClassCache.size) {
          rule.remove()  // remove @apply atrule
        }
        index = index + 1
      }
    })
    
  })
  // return str
}
