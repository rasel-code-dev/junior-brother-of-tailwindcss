import makeApplyCSS from "./lib/makeApplyCSS"
const postCss = require("postcss")
const { writeFile, readFile } = require("fs/promises")
const fs = require("fs");
const postcss = require("postcss");
import initStatePopulate from "./lib/createCandidateRuleMap";
import initClass from "./lib/buildCandidateMapToCSS";


let css = postcss.parse(fs.readFileSync(`${__dirname}/index.css`, 'utf8'))

function run(css) {
  let output = postCss([
    myPlugin(),
    // ruleSort,
    // require('postcss-prettify')
  ]).process(css)
  // console.log(output.toString())
  writeFile("src/dist/index.css", output.toString()).then((_) => {
    console.info("utilities css file rebuild.")
  }).catch(err => {
    console.error(err.message)
  })
}



type CandidateRuleMaps = {
  meta: {
    ruleName: string,
    cssName: string,
    pluginName: string,
    themeKey: string,
  },
  generateCSS: (theme: object) => any
  rules: any // arr | object
}

export const state = {
  postCssNodeCache:  {},  // {'.m-2': [], '.m-5': [] }
  candidateRuleMap: new Map<string, CandidateRuleMaps>(),
    // {
    // 'align-start': {  meta: null, rules: [] },
    // 'bg': { meta: { cssName: "backgroundColor", ruleName: "bg" }, makeRule: ()=>{} }
    // },
  classCache: new Map
    // 'block': [ [] ]
  ,
  applyClassCache: new Set
}



function myPlugin(){
  return {
    postcssPlugin: 'plugin-inline',
    Once (root: any){
      initStatePopulate(state)         // map candidate utility classes
      initClass(root, null, state) // create all utility classes
      makeApplyCSS(root, state)    // create only @apply directive utility classes and store cache it inside store
    }
  }
}


run(css)