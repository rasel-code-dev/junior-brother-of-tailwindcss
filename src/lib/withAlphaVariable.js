import hexToRGB from "../util/hexToRGB";
const hasStringColor = require("./hasStringColor");


function withAlphaVariable({color, property, variable}){
  
  if(hasStringColor(color)) {
    /// color value as a string can't convert ro rgba format like [red, green]
    return {
      [variable]: 1,
      [property]: color
    }
  } else {
    let rgba = hexToRGB(color, `var(${variable})`)
    return {
      [variable]: 1,
      [property]: rgba
    }
  }
}

module.exports = withAlphaVariable

