import matchUtilities from "../lib/matchUtilities";
import createUtilityPlugin from "../lib/createUtilityPlugin";

const withAlphaVariable = require("../lib/withAlphaVariable");

export default function margin(){
  return {
    cssName: "margin",
    ruleName: "margin",
    themeKey: "margin",
    pluginName: "margin",
    rules: [
      { "m": "margin" },
      { "mt": "margin-top" },
      // { "mx": ["margin-left", "margin-right"] }
    ],
    generateCSS: (meta: any, utilityVariations: any, themeValue: string | number) =>{
      return createUtilityPlugin(meta, utilityVariations, themeValue)
    }
  }
};

// const createUtilityPlugin = require("../lib/createUtilityPlugin");

//
// module.exports =  function (forMedia) {
//   return createUtilityPlugin(
//     "margin",
//     {
//       // 'm': 'margin',
//       // 'mx': ['margin-left', 'margin-right'],
//       'my': ['margin-top', 'margin-bottom'],
//       // 'mt': 'margin-top',
//       // 'mr': 'margin-right',
//       // 'mb': 'margin-bottom',
//       // 'ml': 'margin-left'
//     },
//     forMedia
//   )
// }

