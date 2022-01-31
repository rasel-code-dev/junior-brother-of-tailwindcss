
/*
 * Takes a 3 or 6-digit hex color code, and an optional 0-255 numeric alpha value
 */
function hexToRGB(hex, alpha) {
  if (typeof hex !== 'string' || hex[0] !== '#') return null; // or return 'transparent'
  
  const stringValues = (hex.length === 4)
    ? [hex.slice(1, 2), hex.slice(2, 3), hex.slice(3, 4)].map(n => `${n}${n}`)
    : [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
  const intValues = stringValues.map(n => parseInt(n, 16));
  
  // return (typeof alpha === 'number')
  //   ? `rgba(${intValues.join(', ')}, ${alpha})`
  //   : `rgb(${intValues.join(', ')})`;
  
  return (alpha)
    ? `rgba(${intValues.join(', ')}, ${alpha})`
    : `rgb(${intValues.join(', ')})`;
}

module.exports = hexToRGB



//
// function hexToRGBA(hex) {
//   // remove invalid characters
//   hex = hex.replace(/[^0-9a-fA-F]/g, '');
//
//   if (hex.length < 5) {
//     // 3, 4 characters double-up
//     hex = hex.split('').map(s => s + s).join('');
//   }
//
//   // parse pairs of two
//   let rgba = hex.match(/.{1,2}/g).map(s => parseInt(s, 16));
//
//   // alpha code between 0 & 1 / default 1
//   rgba[3] = rgba.length > 3 ? parseFloat(rgba[3] / 255).toFixed(2): 1;
//
//   return 'rgba(' + rgba.join(', ') + ')';
// }
