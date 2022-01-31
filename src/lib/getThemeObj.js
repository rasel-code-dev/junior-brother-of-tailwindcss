const config = require("../variable.config");


function getThemeObj(prop){
  return config.theme[prop]
}

module.exports = getThemeObj