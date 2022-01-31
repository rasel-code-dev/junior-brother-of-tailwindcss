const config = require("../../variable.config");
const isFloat = require("../util/isFloat");
const postcss = require("postcss");
const chalk = require("chalk");
const hexToRGB = require("../util/hexToRGB");
const makeDividerColor = require("../util/makeDivideColorRule");
const makeSpaceRule = require("../util/makeSpaceRule");
const makeDivideWidthRule = require("../util/makeDivideWidthRule")
const makeDivideOpacityRule = require("../util/makeDivideOpacityRule")


function generateRules(utilities, root, forMedia){
  
  let property = new Map()  // { className: css_prop_value }
  
  const {classes: utilityClasses, utilityVariations,  themeKey, prefixCls, cssPropName, extendSuffixCls, mediaQueries, hover, axis } = utilities
  
  // console.log(utilityVariations)
  
  // console.log(utilityVariations)
  
  if(themeKey && utilityVariations){
    /** margin, padding */
    parseUtilityVariationsToClasses2(utilityVariations, themeKey, prefixCls, cssPropName, root)
    
    
  }
  else if(themeKey && !utilityClasses && !utilityVariations){
    /**
     *  width,
     *  height
     *  fontWeight
     *  fontSize
     *  width
     *  height
     *  borderRadius
     *  backgroundOpacity
     * space (special case)
     */
  
   
    let result = ''
    let hoverCss = ''
    
    if (config.theme[themeKey]){
      
      if(themeKey === "space" || themeKey === "divideColor" || themeKey === "divideWidth" || themeKey === "divideOpacity" ){
        if(typeof config.theme[themeKey] === "object") {        /// config.theme.space return an object
          // let utilityClassObj = config.theme[themeKey]
          
        } else {                                                /// config.theme.space return an function
          
          let utilityUnitFn = config.theme[themeKey]
          let allWidth = utilityUnitFn((value)=>{
            return config.theme[value]
          }, (obj)=>{
            let renamedScreens = {}
            for (const objKey in obj) {
              if(extendSuffixCls) {
                renamedScreens[extendSuffixCls + "-" + objKey] = obj[objKey]
              } else {
                renamedScreens[objKey] = obj[objKey]
              }
            }
            return renamedScreens
          })
  
         
          /// nested function like dividerColor return borderColor fn borderColor return another Fn
          if(typeof allWidth === "function"){
            let allUnit = allWidth((themeName)=>{
              return config.theme[themeName]
            })
            if(themeKey === "divideColor"){
              result += makeDividerColor({prefixCls, colors: allUnit, mediaQueries, hover})
            }
        
            if(themeKey === "divideOpacity"){
              let {result: r, hoverCss: h} = makeDivideOpacityRule({allUnit, prefixCls, cssPropName, hover, mediaQueries, forMedia})
              result+=r
              hoverCss+=h
            }
            
          } else {
            if(themeKey === "divideWidth"){
              result += makeDivideWidthRule({prefixCls, axis, allWidth, mediaQueries, hover})
              root.append(postcss.parse(result))
              return
            }
            
            for (let allWidthKey in allWidth) {
              let splitViaSlash = allWidthKey.split("/")
              if(splitViaSlash.length > 1){
                // handle classname like 1.5 ==> 1\\/.5
      
              } else {
      
                // handle classname like 1, 3, 4, 5
                let spaceRule = ""
                if(themeKey === "space") {
                  spaceRule = makeSpaceRule({splitViaSlash, allWidth, allWidthKey})
                } else if (themeKey === "divideColor"){
                
                }
                if(mediaQueries){
                  forMedia(spaceRule, mediaQueries)
                }
                result += spaceRule
              }
            }
  
          }
         
        }
        if(hoverCss){
          root.append(postcss.parse(hoverCss))
        }
        root.append(postcss.parse(result))
        
        return
      }
   
      /*
       if config file.[themeKey] return object
       */
      if(typeof config.theme[themeKey] === "object") {
        let utilityClassObj = config.theme[themeKey]

        for (const utilityClassObjKey in utilityClassObj) {
          if (utilityClassObjKey === "DEFAULT") {
            let eachRule = `.${prefixCls}{ ${cssPropName}: ${utilityClassObj[utilityClassObjKey]} }`
            if(hover){
              hoverCss += `.hover\\:${prefixCls}{ ${cssPropName}: ${utilityClassObj[utilityClassObjKey]} }`
            }
            result += eachRule
            if(mediaQueries){
              forMedia(eachRule, mediaQueries)
            }
          } else {
            let eachRule = `.${prefixCls}-${utilityClassObjKey}{ ${cssPropName}: ${utilityClassObj[utilityClassObjKey]} }`
            result += eachRule
            if(hover){
              hoverCss += `.hover\\:${prefixCls}-${utilityClassObjKey}:hover{ ${cssPropName}: ${utilityClassObj[utilityClassObjKey]} }`
            }
            if(mediaQueries){
              forMedia(eachRule, mediaQueries)
            }
          }
        }
        
        
      } else if(typeof config.theme[themeKey]  === "function") {
        /** config.theme return function */
        // get value from variable.config.js file
        
        let utilityClassFn = config.theme[themeKey]
        let allWidth = utilityClassFn((value)=>{
          return config.theme[value]
        }, (obj)=>{
            let renamedScreens = {}
            for (const objKey in obj) {
              if(extendSuffixCls) {
                renamedScreens[extendSuffixCls + "-" + objKey] = obj[objKey]
              } else {
                renamedScreens[objKey] = obj[objKey]
              }
            }
            return renamedScreens
        })
        
        for (let allWidthKey in allWidth) {
          let splitViaSlash = allWidthKey.split("/")
          
          // floating point class name like .w-1.5 .w-2.5
          if(splitViaSlash.length > 1) {
            let newRule =  `.${prefixCls}-${splitViaSlash[0]}\\/${splitViaSlash[1]}`
            let eachRule = `${newRule}{${cssPropName}: ${allWidth[allWidthKey]}} `
     
            result += eachRule
            if(hover){
              hoverCss+=`.hover\\:${newRule}:hover{${cssPropName}: ${allWidth[allWidthKey]}} `
            }
            if(mediaQueries){
              forMedia(eachRule, mediaQueries)
            }
          } else {
            
            // string or int  class name like .w-1 .w-5 .w-auto
            let eachRule = `.${prefixCls}-${allWidthKey}{ ${cssPropName}: ${allWidth[allWidthKey]} }`
            
            if(hover){
              hoverCss+=`.hover\\:${prefixCls}-${allWidthKey}:hover{ ${cssPropName}: ${allWidth[allWidthKey]} }`
            }
            result += eachRule
            if(mediaQueries){
              forMedia(eachRule, mediaQueries)
            }
          }
        }
      }
    }
  
    hoverCss && root.append(postcss.parse(hoverCss))
    root.append(postcss.parse(result))
    
  }
  
  else if(utilityClasses) {
    let result = ''
    let hoverCss= ''
    /** display  */
    for (let utilityClassKey in utilityClasses) {
      
      let eachRule = `${utilityClassKey}{ ${cssPropName}: ${utilityClasses[utilityClassKey]} } `
      if(hover){
        hoverCss += `.hover\\:${utilityClassKey.slice(1)}:hover{ ${cssPropName}: ${utilityClasses[utilityClassKey]} } `
      }
      result += eachRule
      if(mediaQueries){
        forMedia(eachRule, mediaQueries)  /// store rule for media-query
      }
    }
    
    root.append(postcss.parse(hoverCss))  // rule add class name
    root.append(postcss.parse(result))  // rule add class name
  } else {
    console.info(chalk.red("Not Matching plugin handler to Generate CSS class. please check line 122"))
  }
}


/** this function took positive  value and return positive classes ... */
function parseUtilityVariationsToClasses(utilityVariations, themeKey, prefixCls, cssPropName, root){

  if(typeof config.theme[themeKey] === "function"){
    
    // get all value from config js file via calling callback function
    let utilityClassFn = config.theme[themeKey]
    let allUnits = utilityClassFn((value)=>{
      return config.theme[value]
    }, { negative: (a)=> {
        // parseUtilityVariationsToClasses_negative(utilityVariations, themeKey, prefixCls, cssPropName, root, a)
    } })
    
    
    
    let result = ""
    for (let unitKey in allUnits) {
  
      /** this need to given two slash between floating class name like m-1.5{} **/
      let floatUnitKey = isFloat(unitKey)
  
      /** for detect px and auto */
      let isNumber =  !isNaN(Number(unitKey))
      
      for (const utilityVariation in utilityVariations) {
        
        /**  this block for dual css properties like mx my px py **/
        if(Array.isArray(utilityVariations[utilityVariation])){
          
          
          if(isNumber || Number(unitKey) === 0){
            /** this is for all number of classes like 1, 2, 0.5, 20 */
            // for floating point classes like m-2.5{}
            if(floatUnitKey){
              /** if rule name like this 0.5, 1.5, 2.5, 3.5 */
              let floatUnitKeyArray = unitKey.split(".")
              let pairRule = ''
              for (let eachProp of utilityVariations[utilityVariation]){
                pairRule += `${eachProp}: ${allUnits[unitKey]};`
              }
              result += `.${utilityVariation}-${floatUnitKeyArray[0]}\\.${floatUnitKeyArray[1]}{${pairRule}}`
            } else {
              let pairRule = ''
              for (let eachProp of utilityVariations[utilityVariation]){
                pairRule += `${eachProp}: ${allUnits[unitKey]};`
              }
              result += `.${utilityVariation}-${unitKey}{${pairRule} }`
            
            }
            
          } else {
          
            /** this block for px auto */
            let pairRule = ''
            for (let eachProp of utilityVariations[utilityVariation]){
              pairRule += `${eachProp}: ${allUnits[unitKey]};`
            }
            result += `.${utilityVariation}-${unitKey}{${pairRule} }`
          }
          
          
        } else {
        /**  this block for single css properties like m mt mb p pt pb **/
          // console.log(utilityVariation)
  
          if(isNumber){
            /** this is for all number of classes like 1, 2, 0.5, 20 */
            // for floating point classes like m-2.5{}
            if(floatUnitKey){
             
              /** if rule name like this 0.5, 1.5, 2.5, 3.5 */
              let floatUnitKeyArray = unitKey.split(".")
              result += `.${utilityVariation}-${floatUnitKeyArray[0]}\\.${floatUnitKeyArray[1]}{${utilityVariations[utilityVariation]}: ${allUnits[unitKey]}}`
            } else {
              /** else if rule name like this 1, 2, 3 */
              result += `.${utilityVariation}-${unitKey}{ ${utilityVariations[utilityVariation]}: ${allUnits[unitKey]} }`
            }
          } else {
            /** this block for px auto */
            if(unitKey ===  "auto") {
              result += `.${utilityVariation}-${unitKey}{${utilityVariations[utilityVariation]}: ${allUnits[unitKey]} }`
            }
          }
        }
      }
    
    }
    root.append(postcss.parse(result))  // rule add class names
  }
}

/** this function took only negative value and return negative classes ... */
function parseUtilityVariationsToClasses_negative(utilityVariations, themeKey, prefixCls, cssPropName, root, allUnits){
  
  let result = ""
  
  for (let unitKey in allUnits) {
    
    /** this need to given two slash between floating class name like m-1.5{} **/
    let floatUnitKey = isFloat(unitKey)
    
    /** for detect px and auto */
    let isNumber =  !isNaN(Number(unitKey))
    
    for (const utilityVariation in utilityVariations) {
      
      /**  this block for dual css properties like mx my px py **/
      if(Array.isArray(utilityVariations[utilityVariation])){
        
        
        if(isNumber){
          /** this is for all number of classes like 1, 2, 0.5, 20 */
          // for floating point classes like m-2.5{}
          if(floatUnitKey){
            /** if rule name like this 0.5, 1.5, 2.5, 3.5 */
            let floatUnitKeyArray = unitKey.split(".")
            let pairRule = ''
            for (let eachProp of utilityVariations[utilityVariation]){
              pairRule += `${eachProp}: -${allUnits[unitKey]};`
            }
            result += `.-${utilityVariation}-${floatUnitKeyArray[0]}\\.${floatUnitKeyArray[1]}{${pairRule}}`
          } else {
            let pairRule = ''
            for (let eachProp of utilityVariations[utilityVariation]){
              pairRule += `${eachProp}: -${allUnits[unitKey]};`
            }
            result += `.-${utilityVariation}-${unitKey}{${pairRule} }`
          }
          
        } else {
          /** this is for all number of classes like 1, 2, 0.5, 20 */
          /** this block for px auto */
          
          // console.log(utilityVariation, unitKey, allUnits[unitKey])
          
        }
        
        
      } else {
        /**  this block for single css properties like m mt mb p pt pb **/
        
        if(isNumber){
          /** this is for all number of classes like 1, 2, 0.5, 20 */
          // for floating point classes like m-2.5{}
          if(floatUnitKey){
            
            /** if rule name like this 0.5, 1.5, 2.5, 3.5 */
            let floatUnitKeyArray = unitKey.split(".")
            result += `.-${utilityVariation}-${floatUnitKeyArray[0]}\\.${floatUnitKeyArray[1]}{${utilityVariations[utilityVariation]}: -${allUnits[unitKey]}}`
          } else {
            /** else if rule name like this 1, 2, 3 */
            if(unitKey !== "0"){
              result += `.-${utilityVariation}-${unitKey}{ ${utilityVariations[utilityVariation]}: -${allUnits[unitKey]} }`
            }
          }
        }
      }
    }
    
  }
  
  root.append(postcss.parse(result))  // rule add class names
  
}

function makeFloatingPointRule(unitKey){
  let floatArr = unitKey.split(".")
  let pair = ''
  // for (let item of classes[classesKey]) {
  //   pair += `${item}: -${unitObj[unitObjKey]};`
  // }
  // result += `.-${classesKey}-${floatArr[0]}\\.${floatArr[1]}{${pair}}`
}


/** this function able to received negative and positive both value and return both type of css classes... */
function parseUtilityVariationsToClasses2(utilityVariations, themeKey, prefixCls, cssPropName, root){
  

  
  if(typeof config.theme[themeKey] === "function"){
    
    // get all value from config js file via calling callback function
    let utilityClassFn = config.theme[themeKey]
    let allUnits = utilityClassFn((value)=>{
      return config.theme[value]
    })
    
    /*
    NaN 1/4
    NaN 2/4
    NaN 3/4
    NaN full
    NaN -1/2
    NaN -1/3
    NaN -2/3
    NaN -1/4
    NaN -2/4
    NaN -3/4
    NaN -full*/
  
    let result = ""
    for (let unitKey in allUnits) {
      
      // if(unitKey.indexOf("/") !== 0){  // if like this => 1/2, -2/4
      /** this need to given two slash between floating class name like m-1.5{} **/
      let floatUnitKey = isFloat(unitKey)

      result += createUtilityClasses(allUnits, unitKey,utilityVariations, themeKey, prefixCls, cssPropName, root)
      
      /** for detect px and auto */

      // }
      //
      // for (const utilityVariation in utilityVariations) {
      //
      //   /**  this block for dual css properties like mx my px py **/
      //   if(Array.isArray(utilityVariations[utilityVariation])){
      //
      //     if(isNumber || Number(unitKey) === 0){
      //       /** this is for all number of classes like 1, 2, 0.5, 20 */
      //       // for floating point classes like m-2.5{}
      //       if(floatUnitKey){
      //         /** if rule name like this 0.5, 1.5, 2.5, 3.5 */
      //         let floatUnitKeyArray = unitKey.split(".")
      //         let pairRule = ''
      //         for (let eachProp of utilityVariations[utilityVariation]){
      //           pairRule += `${eachProp}: ${allUnits[unitKey]};`
      //         }
      //         result += `.${utilityVariation}-${floatUnitKeyArray[0]}\\.${floatUnitKeyArray[1]}{${pairRule}}`
      //       } else {
      //         let pairRule = ''
      //         for (let eachProp of utilityVariations[utilityVariation]){
      //           pairRule += `${eachProp}: ${allUnits[unitKey]};`
      //         }
      //         result += `.${utilityVariation}-${unitKey}{${pairRule} }`
      //
      //       }
      //
      //     } else {
      //
      //       /** this block for px auto */
      //       let pairRule = ''
      //       for (let eachProp of utilityVariations[utilityVariation]){
      //         pairRule += `${eachProp}: ${allUnits[unitKey]};`
      //       }
      //       result += `.${utilityVariation}-${unitKey}{${pairRule} }`
      //     }
      //
      //
      //   } else {
      //     /**  this block for single css properties like m mt mb p pt pb **/
      //     // console.log(utilityVariation)
      //
      //     if(isNumber){
      //
      //
      //       /** this is for all number of classes like 1, 2, 0.5, 20 -10 -1, -2 */
      //       // for floating point classes like m-2.5{}
      //       if(floatUnitKey){
      //
      //         /** if rule name like this 0.5, 1.5, 2.5, 3.5 -1.5, -3.5 */
      //         let floatUnitKeyArray = unitKey.split(".")
      //         if(unitKey >= 0){
      //           result += `.${utilityVariation}-${floatUnitKeyArray[0]}\\.${floatUnitKeyArray[1]}{${utilityVariations[utilityVariation]}: ${allUnits[unitKey]}}`
      //         } else {
      //           result += `.-${utilityVariation}-${floatUnitKeyArray[0].slice(1)}\\.${floatUnitKeyArray[1]}{${utilityVariations[utilityVariation]}: ${allUnits[unitKey]}}`
      //         }
      //       } else {
      //         /** else if rule name like this 1, 2, 3 */
      //         if(unitKey >= 0) {
      //           result += `.${utilityVariation}-${unitKey}{ ${utilityVariations[utilityVariation]}: ${allUnits[unitKey]} }`
      //         } else {
      //           result += `.-${utilityVariation}-${unitKey.slice(1)}{ ${utilityVariations[utilityVariation]}: -${allUnits[unitKey]} }`
      //         }
      //       }
      //     } else {
      //       /** this block for px auto */
      //       if(unitKey ===  "auto") {
      //         result += `.${utilityVariation}-${unitKey}{${utilityVariations[utilityVariation]}: ${allUnits[unitKey]} }`
      //       }
      //     }
      //   }
      // }
      //
    }
    root.append(postcss.parse(result))  // rule add class names
  } else {
  
    // console.log(themeKey)
    
    let result = ""
    let allUnits = config.theme[themeKey]
    for (let unitKey in allUnits) {
    
      // if(unitKey.indexOf("/") !== 0){  // if like this => 1/2, -2/4
      /** this need to given two slash between floating class name like m-1.5{} **/
      let floatUnitKey = isFloat(unitKey)
      
      result += createUtilityClasses(allUnits, unitKey,utilityVariations, themeKey, prefixCls, cssPropName, root)
    
      /** for detect px and auto */
    
      // }
      //
      // for (const utilityVariation in utilityVariations) {
      //
      //   /**  this block for dual css properties like mx my px py **/
      //   if(Array.isArray(utilityVariations[utilityVariation])){
      //
      //     if(isNumber || Number(unitKey) === 0){
      //       /** this is for all number of classes like 1, 2, 0.5, 20 */
      //       // for floating point classes like m-2.5{}
      //       if(floatUnitKey){
      //         /** if rule name like this 0.5, 1.5, 2.5, 3.5 */
      //         let floatUnitKeyArray = unitKey.split(".")
      //         let pairRule = ''
      //         for (let eachProp of utilityVariations[utilityVariation]){
      //           pairRule += `${eachProp}: ${allUnits[unitKey]};`
      //         }
      //         result += `.${utilityVariation}-${floatUnitKeyArray[0]}\\.${floatUnitKeyArray[1]}{${pairRule}}`
      //       } else {
      //         let pairRule = ''
      //         for (let eachProp of utilityVariations[utilityVariation]){
      //           pairRule += `${eachProp}: ${allUnits[unitKey]};`
      //         }
      //         result += `.${utilityVariation}-${unitKey}{${pairRule} }`
      //
      //       }
      //
      //     } else {
      //
      //       /** this block for px auto */
      //       let pairRule = ''
      //       for (let eachProp of utilityVariations[utilityVariation]){
      //         pairRule += `${eachProp}: ${allUnits[unitKey]};`
      //       }
      //       result += `.${utilityVariation}-${unitKey}{${pairRule} }`
      //     }
      //
      //
      //   } else {
      //     /**  this block for single css properties like m mt mb p pt pb **/
      //     // console.log(utilityVariation)
      //
      //     if(isNumber){
      //
      //
      //       /** this is for all number of classes like 1, 2, 0.5, 20 -10 -1, -2 */
      //       // for floating point classes like m-2.5{}
      //       if(floatUnitKey){
      //
      //         /** if rule name like this 0.5, 1.5, 2.5, 3.5 -1.5, -3.5 */
      //         let floatUnitKeyArray = unitKey.split(".")
      //         if(unitKey >= 0){
      //           result += `.${utilityVariation}-${floatUnitKeyArray[0]}\\.${floatUnitKeyArray[1]}{${utilityVariations[utilityVariation]}: ${allUnits[unitKey]}}`
      //         } else {
      //           result += `.-${utilityVariation}-${floatUnitKeyArray[0].slice(1)}\\.${floatUnitKeyArray[1]}{${utilityVariations[utilityVariation]}: ${allUnits[unitKey]}}`
      //         }
      //       } else {
      //         /** else if rule name like this 1, 2, 3 */
      //         if(unitKey >= 0) {
      //           result += `.${utilityVariation}-${unitKey}{ ${utilityVariations[utilityVariation]}: ${allUnits[unitKey]} }`
      //         } else {
      //           result += `.-${utilityVariation}-${unitKey.slice(1)}{ ${utilityVariations[utilityVariation]}: -${allUnits[unitKey]} }`
      //         }
      //       }
      //     } else {
      //       /** this block for px auto */
      //       if(unitKey ===  "auto") {
      //         result += `.${utilityVariation}-${unitKey}{${utilityVariations[utilityVariation]}: ${allUnits[unitKey]} }`
      //       }
      //     }
      //   }
      // }
      //
    }
    root.append(postcss.parse(result))  // rule add class names
  }
}

/** create utility classes negative and positive direction */
function createUtilityClasses(allUnits, unitKey, utilityVariations, themeKey, prefixCls, cssPropName, root ){

  let result = ''
  /** check negative class name */
  if(unitKey.indexOf("/") !== -1){
    let isNegative = (unitKey && unitKey[0] === "-")
    // if (isNegative) {
    //   let unitKeyArr = unitKey.slice(1).split("/")
    //   if (!Array.isArray(utilityVariations)) {
    //     for (let eachCls in utilityVariations) {
    //       result += `.-${eachCls}-${unitKeyArr[0]}\\/${unitKeyArr[1]}{${eachCls}: ${allUnits[unitKey]}}`
    //     }
    //   }
    // } else {
    //   let unitKeyArr = unitKey.split("/")
    //   if (!Array.isArray(utilityVariations)) {
    //     for (let eachCls in utilityVariations) {
    //       result += `.${eachCls}-${unitKeyArr[0]}\\/${unitKeyArr[1]}{${eachCls}: ${allUnits[unitKey]}}`
    //     }
    //   }
    // }
  } else if(unitKey.indexOf(".") !== -1) {  /** if unit value 2.5 -1.5 like that */
    let unitKeyArr = unitKey.split(".")
    let isPositiveValue = Number(unitKey) > 0
    if(!Array.isArray(utilityVariations)) {
      for (let eachCls in utilityVariations) {
        if (isPositiveValue) {
          if(typeof utilityVariations[eachCls] === "object" ) {
            // result += twoPropForClass(allUnits, unitKey, utilityVariations, eachCls, themeKey, prefixCls, cssPropName)
          } else {
            result += `.${eachCls}-${unitKeyArr[0]}\\.${unitKeyArr[1]}{${utilityVariations[eachCls]}: ${allUnits[unitKey]}}`
          }
        } else {
          // for negative value like
          if(typeof utilityVariations[eachCls] === "object" ) {
            // result += twoPropForClass(allUnits, unitKey, utilityVariations, eachCls, themeKey, prefixCls, cssPropName, false)
          } else {
            result += `.-${eachCls}-${unitKeyArr[0].slice(1)}\\.${unitKeyArr[1]}{${utilityVariations[eachCls]}: ${allUnits[unitKey]}}`
          }
        }
      }
    }
  
  
  } else {
    
    /**
     simple value like 1, 2, 3, full, auto
     */
    
    /** this is for unitKey like full, auto px all are a string value */
    if(isNaN(Number(unitKey))){
      
      if (!Array.isArray(utilityVariations)) {
        for (let eachCls in utilityVariations) {
          if(unitKey === "full" || unitKey === "-full" || unitKey === "px" || unitKey === "-px" ||  unitKey === "DEFAULT" || unitKey === "auto") {
            if(unitKey === "full" || unitKey === "px" ||  unitKey === "auto"  ) {
              if(typeof utilityVariations[eachCls] === "object"){
                let pairRule = ''
                for (let eachProp of utilityVariations[eachCls]){
                  pairRule += `${eachProp}: ${allUnits[unitKey]};`
               
                }
                result += `.${eachCls}-${unitKey}{${pairRule} }`
                
              } else {
              // .ml-auto{margin-left: auto} .mb-px{margin-bottom: 1px}
                result += `.${eachCls}-${unitKey}{ ${utilityVariations[eachCls]}: ${allUnits[unitKey]} }`
              }
            } else if(unitKey === "DEFAULT"){
              result += `.${eachCls}{ ${utilityVariations[eachCls]}: ${allUnits[unitKey]} }`
            } else {
              // handle unit key for -px
              // result += `.-${eachCls}-${unitKey.slice(1)}{ ${eachCls}: ${allUnits[unitKey]} }`
            }
          } else{
            // if(unitKey === "full" || unitKey === "-full" || unitKey === "px" || unitKey === "-px" || unitKey === "auto")
            // else other...
            result += `.${eachCls}-${unitKey}{ ${eachCls}: ${allUnits[unitKey]} }`
          }
        }
      }
      
      
    } else {
      // numeric all value
      
      /** unit value positive and utilityVariations return as object   */

      /** else if rule name like this 1, 2, 3 */
      if (!Array.isArray(utilityVariations)) {
       
        for (let eachCls in utilityVariations) {
            if(Number(unitKey)  === 0) {
              if(typeof utilityVariations[eachCls] === "object"){
                result += twoPropForClass(allUnits, unitKey, utilityVariations, eachCls)
              } else {
                result += onePropForClass(allUnits, unitKey, utilityVariations, eachCls)
              }
            } else {
              if (typeof utilityVariations[eachCls] === "object") {
                result += twoPropForClass(allUnits, unitKey, utilityVariations, eachCls)
              } else {
                result += onePropForClass(allUnits, unitKey, utilityVariations, eachCls)
              }
            }
        }
      }
    }
  }
  
  return result
}

NOTE:

/** this function create css class where two or more css property exits */
function twoPropForClass(allUnits, unitKey, utilityVariations, eachCls){
  
  let isPositiveValue = Number(unitKey) >= 0

  /** this block for px auto */
  
  let pairRule = ''
  for (let eachProp of utilityVariations[eachCls]){
    pairRule += `${eachProp}: ${allUnits[unitKey]};`
  }
  // console.log(isPositiveValue)
  if (isPositiveValue) {
    return `.${eachCls}-${unitKey}{${pairRule} }`
  } else {
    return `.-${eachCls}-${unitKey.slice(1)}{${pairRule} }`
  }
}

/** this function create css class where two or more css property exits */
function onePropForClass(allUnits, unitKey, utilityVariations, eachCls){
  
  /** this block for px auto */

  let isPositiveValue = Number(unitKey) >= 0
  if (isPositiveValue) {
    return `.${eachCls}-${unitKey}{ ${utilityVariations[eachCls]}: ${allUnits[unitKey]} }`
  } else {
    return `.-${eachCls}-${unitKey.slice(1)}{ ${utilityVariations[eachCls]}: ${allUnits[unitKey]} }`
  }
}




module.exports =  generateRules