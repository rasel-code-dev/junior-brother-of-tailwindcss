const postcss = require("postcss");
const display = require("../plugins/display");
const config = require("../../variable.config")
const alignItems = require("../plugins/alignItems");


let media = {
  "sm": "500px"
}

let qq = new Map()

function forMedia(rule, mediaQueries){
  
  let q = config.theme[mediaQueries]
  for (const qKey in q) {
    let f = `.${qKey}\\:${rule.slice(1)}`
    if(qq.get(qKey)) {
      qq.set(qKey, qq.get(qKey)+ "; \n" +  f )
    } else {
        qq.set(qKey, f)

      // qq[qKey] = [f]
    }
  }
}

module.exports = (root) => {
  // makeRules(display(), root)
  // makeRules(alignItems(), root)
  //
  //
  // let mediaKeys = qq.keys()
  // for (const mediaKey of mediaKeys) {
  //
  //   let mediaValue =  config.theme["screens"][mediaKey]
  //   let mediaQ = `@media screen and (min-width: ${mediaValue}){
  //     ${qq.get(mediaKey)}
  //   }`
  //   root.append(mediaQ)
  // }
  
}


function makeRules(items, root){
  let rules = ''
  if(items.classes && items.cssPropName){
    for (let classesKey in items.classes) {
      if(items.mediaQueries) {
        forMedia(
          `${classesKey}{${items.cssPropName}: ${items.classes[classesKey]}}`
          , items.mediaQueries)
      }
      let rule = `${classesKey}{${items.cssPropName}: ${items.classes[classesKey]}}`
      
      rules += rule
    }
  }
    root.append(postcss.parse(rules))
}




// module.exports = (root) => {
//   let n = root.nodes
//   n.sort((nodeA, nodeB)=>{
//     if(nodeA.selector < nodeB.selector){
//       return  1
//     } else if(nodeA.selector > nodeB.selector){
//       return -1
//     } else {
//       return 0
//     }
//   })
//   root.nodes = n
// }