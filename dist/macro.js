var __liftToAST = require('babel-plugin-ast-literal/lib/liftToAST').default;

/* global expr, stmt */ /* = require('babel-plugin-ast-literal') */
const t = require('babel-types');
const { createMacro, MacroError } = require('babel-plugin-macros');

function funcRetObj(props) {
  return function (_param) {
    _param = __liftToAST(_param);
    return {
      "type": "FunctionExpression",
      "id": null,
      "generator": false,
      "expression": false,
      "async": false,
      "params": [{
        "type": "Identifier",
        "name": "i"
      }],
      "body": {
        "type": "BlockStatement",
        "body": [{
          "type": "ReturnStatement",
          "argument": {
            "type": "CallExpression",
            "callee": {
              "type": "MemberExpression",
              "object": {
                "type": "Identifier",
                "name": "Object"
              },
              "property": {
                "type": "Identifier",
                "name": "create"
              },
              "computed": false
            },
            "arguments": [_param]
          }
        }],
        "directives": []
      },
      "extra": {
        "parenthesized": true,
        "parenStart": 0
      }
    };
  }(t.objectExpression(props));
}

function getter(name, retVal) {
  return function (_param2, _param3, _param4) {
    _param2 = __liftToAST(_param2);
    _param3 = __liftToAST(_param3);
    _param4 = __liftToAST(_param4);
    return {
      "type": "ObjectExpression",
      "properties": [{
        "type": "ObjectMethod",
        "method": false,
        "shorthand": false,
        "computed": false,
        "key": _param2,
        "kind": "get",
        "variance": null,
        "variancePos": 18,
        "id": null,
        "generator": false,
        "expression": false,
        "async": false,
        "params": [],
        "body": {
          "type": "BlockStatement",
          "body": [{
            "type": "VariableDeclaration",
            "declarations": [{
              "type": "VariableDeclarator",
              "id": {
                "type": "Identifier",
                "name": "o"
              },
              "init": {
                "type": "ThisExpression"
              }
            }],
            "kind": "const"
          }, {
            "type": "VariableDeclaration",
            "declarations": [{
              "type": "VariableDeclarator",
              "id": {
                "type": "Identifier",
                "name": "v"
              },
              "init": _param3
            }],
            "kind": "const"
          }, {
            "type": "ExpressionStatement",
            "expression": {
              "type": "CallExpression",
              "callee": {
                "type": "MemberExpression",
                "object": {
                  "type": "Identifier",
                  "name": "Object"
                },
                "property": {
                  "type": "Identifier",
                  "name": "defineProperty"
                },
                "computed": false
              },
              "arguments": [{
                "type": "ThisExpression"
              }, _param4, {
                "type": "ObjectExpression",
                "properties": [{
                  "type": "ObjectProperty",
                  "method": false,
                  "shorthand": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "name": "value"
                  },
                  "value": {
                    "type": "Identifier",
                    "name": "v"
                  }
                }, {
                  "type": "ObjectProperty",
                  "method": false,
                  "shorthand": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "name": "enumerable"
                  },
                  "value": {
                    "type": "BooleanLiteral",
                    "value": true
                  }
                }]
              }]
            }
          }, {
            "type": "ReturnStatement",
            "argument": {
              "type": "Identifier",
              "name": "v"
            }
          }],
          "directives": []
        }
      }],
      "extra": {
        "parenthesized": true,
        "parenStart": 0
      }
    };
  }(name, retVal, name).properties[0];
}

module.exports = createMacro(function traph({ references, state, babel }) {
  references.default.forEach(ref => {
    // const t = traph({
    //   asd: (i, o) => i.x
    // })
    const obj = ref.container.arguments[0];
    const funcs = obj.properties.map(p => {
      console.assert(p.value.params[0].name === 'i');
      console.assert(p.value.params[1].name === 'o');
      return [p.key.name, p.value.body];
    });
    ref.parentPath.replaceWithMultiple(funcRetObj(funcs.map(([name, body]) => getter(name, body))));
  });
});

