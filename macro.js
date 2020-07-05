/* global expr, stmt */  /* = require('babel-plugin-ast-literal') */
const t = require('babel-types')
const { createMacro, MacroError } = require('babel-plugin-macros')

function funcRetObj(props) {
  return expr`
    function (i) {
      return Object.create( ${t.objectExpression(props)} )
    }
  `
}

function getter(name, retVal) {
  return (expr`
    {
      get ${name}() {
        const o = this;
        const v = ${retVal};
        Object.defineProperty(this, ${name}, { value: v, enumerable: true });
        return v;
      }
    }
  `).properties[0]
}

module.exports = createMacro(function traph({ references, state, babel }) {
  references.default.forEach(ref => {
    // const t = traph({
    //   asd: (i, o) => i.x
    // })
    const obj = ref.container.arguments[0]
    const funcs = obj.properties.map(p => {
      console.assert(p.value.params[0].name === 'i')
      console.assert(p.value.params[1].name === 'o')
      return [p.key.name, p.value.body]
    })
    ref.parentPath.replaceWithMultiple(funcRetObj(funcs.map(([name, body]) =>
      getter(name, body)
    )))
  })
})
