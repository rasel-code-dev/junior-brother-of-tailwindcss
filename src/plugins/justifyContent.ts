
import addUtilities, {AddUtilities_configValueType} from "../lib/addUtilities";



export default  function justifyContent (){
  return {
    cssName: "justify-content",
    ruleName: "",
    pluginName: "justifyContent",
    themeKey: "",
    rules: {
      'justify-center': 'center',
      'justify-between': 'space-between',
    },
    generateCSS: (configValue: AddUtilities_configValueType)=>{
      return addUtilities(justifyContent().rules, configValue)
    }
  }
}


