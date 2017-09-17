const out = require('babel-core').transform(
  `
    import traph from './macro.js'

    function sum (a, b) { return a + b }
    function square (a) { return a * a }

    const stats = traph({
      count:      (i, o) => (console.log('cnt'), i.values.length),
      variance:   (i, o) => o.meanSquare - square(o.mean),
      mean:       (i, o) => i.values.reduce(sum) / o.count,
      meanSquare: (i, o) => i.values.map(square).reduce(sum) / o.count,
    })

    const data = { values: [1,2,3,4,5,6,7] }
    const transformed = stats(data)
    // -> Object {count: 7, meanSquare: 20, mean: 4, variance: 4}
    console.assert(transformed.count === 7)
    console.assert(transformed.meanSquare === 20)
  `,
  { plugins: ['babel-macros'] },
)

console.log(out.code)
