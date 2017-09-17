# traph.macro

> JS Babel macro for Object transformation graph

A [`babel-macros`](https://github.com/kentcdodds/babel-macros) version of
[`traph`](https://github.com/caesarsol/traph/),
a functional utility to transform Objects easily,
leveraging object getters and graphs.

## Install

```
$ npm install traph.macro
```

## Usage

Assuming [`babel-macros`](https://github.com/kentcdodds/babel-macros)
is installed and configured,
the `traph` macro is identical to the [`traph`](https://github.com/caesarsol/traph/) function.

Input:

```js
import traph from 'traph.macro'

const stats = traph({
  mean: (i, o) => i.values.reduce((a, b) => a + b) / o.count,
  count: (i, o) => i.values.length,
})

const transformed = stats({ values: [1,2,3,4,5,6,7] })
```

Output:

```js
const stats = function (i) {
  return Object.create({
    get count() {
      const o = this
      const v = i.values.length
      Object.defineProperty(this, 'count', { value: v, enumerable: true })
      return v
    },

    get mean() {
      const o = this
      const v = i.values.reduce(sum) / o.count
      Object.defineProperty(this, 'mean', { value: v, enumerable: true })
      return v
    }
  })
}

const transformed = stats({ values: [1,2,3,4,5,6,7] })
```

## API

The API is identical to the [`traph`](https://github.com/caesarsol/traph/) utility.

## License

MIT © [caesarsol](http://caesarsol.xyz)
