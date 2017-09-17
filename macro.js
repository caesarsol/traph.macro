const t = require('babel-types')
const { createMacro, MacroError } = require('babel-macros')

function funcRetObj(props) {
  // const t = function (i) {
  //   return Object.create({
  //     <<props>>
  //   })
  // }
  return t.functionExpression(null, [t.identifier('i')], t.blockStatement([
    t.returnStatement(t.callExpression(
      t.memberExpression(t.identifier('Object'), t.identifier('create')),
      [t.objectExpression(props)],
    ))
  ]))
}

function getter(name, retVal) {
  // get <<name>>() {
  //   const o = this
  //   const v = <<retVal>>
  //   Object.defineProperty(this, `${name}`, { value: v, enumerable: true })
  //   return v
  // }
  return t.objectMethod('get', t.identifier(name), [], t.blockStatement([
    // const o = this
    t.variableDeclaration('const', [
      t.variableDeclarator(t.identifier('o'), t.thisExpression())
    ]),

    // const v = <<retVal>>
    t.variableDeclaration('const', [
      t.variableDeclarator(t.identifier('v'), retVal)
    ]),

    // Object.defineProperty(this, `${name}`, { value: v, enumerable: true })
    t.expressionStatement(t.callExpression(
      t.memberExpression(t.identifier('Object'), t.identifier('defineProperty')),
      [
        t.thisExpression(),
        t.stringLiteral(name),
        t.objectExpression([
          t.objectProperty(t.identifier('value'), t.identifier('v')),
          t.objectProperty(t.identifier('enumerable'), t.booleanLiteral(true)),
        ])
      ],
    )),

    // return v
    t.returnStatement(t.identifier('v')),
  ]))
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
    ref.parentPath.replaceWith(funcRetObj(funcs.map(([name, body]) =>
      getter(name, body)
    )))
  })
})
