const out = require('babel-core').transform(
  `
    import traph from './dist/macro.js'

    function sum (a, b) { return a + b }
    function square (a) { return a * a }

    let calls = [0, 0, 0, 0]

    const stats = traph({
      count:      (i, o) => (calls[0] += 1, i.values.length),
      variance:   (i, o) => (calls[1] += 1, o.meanSquare - square(o.mean)),
      mean:       (i, o) => (calls[2] += 1, i.values.reduce(sum) / o.count),
      meanSquare: (i, o) => (calls[3] += 1, i.values.map(square).reduce(sum) / o.count),
    })

    const data = { values: [1,2,3,4,5,6,7] }
    const transformed = stats(data)

    // -> Object {count: 7, meanSquare: 20, mean: 4, variance: 4}
    console.assert(transformed.count === 7)
    console.assert(transformed.mean === 4)
    console.assert(transformed.variance === 4)
    console.assert(transformed.meanSquare === 20)

    console.assert(transformed.count === 7)

    console.assert(calls[0] === 1)
    console.assert(calls[1] === 1)
    console.assert(calls[2] === 1)
    console.assert(calls[3] === 1)

    console.log('All tests passed!')
  `,
  { plugins: ['babel-plugin-macros'] },
)

console.log(out.code)
