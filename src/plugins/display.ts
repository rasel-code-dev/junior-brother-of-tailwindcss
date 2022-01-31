
import addUtilities, {AddUtilities_configValueType} from "../lib/addUtilities";

interface RuleType{
  [ruleName: string]: string
}

let rules: RuleType =  {
  'block': 'block',
  'flex': 'flex',
  'inline': 'inline-block',
}

export default  function display (): any{
  return {
    cssName: "display",
    ruleName: "",
    pluginName: "display",
    themeKey: "",
    rules: rules,
    generateCSS: (configValue: AddUtilities_configValueType, rule: any, candiName: string, where: ["apply", ""])=>{
      return addUtilities(rule, configValue, candiName, where)
    }
  }
}


