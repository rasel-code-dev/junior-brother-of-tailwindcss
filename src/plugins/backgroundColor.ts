const flattenColorPalette = require("../lib/flattenColorPalette")
//
// const config = require("../../variable.config");
// const hexToRGB = require("../util/hexToRGB");

import matchUtilities from "../lib/matchUtilities";

const withAlphaVariable = require("../lib/withAlphaVariable");

function backgroundColor(){
  return {
      cssName: "backgroundColor",
      ruleName: "bg",
      pluginName: "backgroundColor",
      themeKey: "backgroundColor",
      rules: [
        { bg: (value: string) => {
            return {'background-color': value}
          }
        }
      ],
      generateCSS: (meta, rules, candiValue: string, where: string) =>{
        // console.log(meta, rules, candiValue, where)
        return matchUtilities(rules, meta, candiValue, where)
        // return matchUtilities({
        //   bg: (value) => {
        //     return {'background-color': value}
        //   }
        // }, {
        //   values: theme, // themes values like background color all values
        //   type: 'color',
        //   hover: true
        // })
      }
    }
};

export default backgroundColor

//
//
// export default function (forMedia) {
//   return function (theme){
//     return matchUtilities(
//       {
//           bg: (value, withOpacity) => {
//             if(withOpacity) {
//               return withAlphaVariable({
//                 color: value,
//                 property: 'background-color',
//                 variable: '--rsl-bg-opacity',
//               })
//             } else {
//               return {'background-color': value}
//             }
//           }
//         },
//       {
//         values: flattenColorPalette(theme('backgroundColor')),
//         //   variants: variants('backgroundColor'),
//         type: 'color',
//         hover: true
//       },
//       forMedia
//     )
//   }
//
  
  
  // let obj = {
  //   themeKey: "colors", // value take from...
  //   cssPropName: 'background-color',
  //   classes: null, // these class property/value inside config file..
  //   prefixCls: "bg",
  //   prefixOpacityCls: "--rsl-bg-opacity",
  //   variable: "--rsl-bg-opacity",
  //   opacityCssPropName: "opacity",
  //   mediaQueries: "screens",
  //   hover: true
  // }
  // return {
  //   ...obj,
  //   fn: (color)=>{
  //
  //     withAlphaVariable({color})
  //   },
  // }
// }
