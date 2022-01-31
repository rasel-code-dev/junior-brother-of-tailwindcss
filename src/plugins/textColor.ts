
import matchUtilities from "../lib/matchUtilities";

const withAlphaVariable = require("../lib/withAlphaVariable");

export default function textColor(){
  return {
    cssName: "color",
    ruleName: "text",
    themeKey: "textColor",
    pluginName: "textColor",
    rules: [
      {
        text: (value: string) => {
          return {'color': value}
        }
      }
    ],
    generateCSS: (meta, rules, candiValue: string, where: string) =>{
       // console.log(meta, rules, candiValue, where)
      return matchUtilities(rules, meta, candiValue, where)
      
      // old implementation
      // return matchUtilities({
      //   text: (value) => {
      //     return {'color': value}
      //   }
      // }, {
      //   values: theme, // themes values like background color all values
      //   type: 'unit',
      //   hover: true
      // })
    }
  }
};

