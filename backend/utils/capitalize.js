//function capitalize capitalizes the first letter of each word in a given string. 
const capitalize = (givenstring) => {
  const a = givenstring
  var k
  var o = []
  var j
  const b = a.split(' ') //The input string a is split into an array of words using the split(' ') method
  for (k = 0; k < b.length; k++) {
    var p = b[k]

    for (j = 0; j < 1; j++) {
      const n = p[0].toUpperCase() + p.slice(1).toLowerCase()

      o.push(n)
    }
  }
  const sentence = o.join(' ') /*the capitalized words in the o array are joined back into a single 
  string using the join(' ') method, with each word separated by a space.*/
  return sentence
}
module.exports = capitalize
