/**
 * @fileoverview require id attr for button element
 * @author Linker
 */
"use strict";


const utils = require("eslint-plugin-vue/lib/utils");
const path = require("path")

// avoid id redumplicate
const fileIdMapRecord = {}
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'auto add id attr for button, the value of id will be generated according to @click value and filename, etc.',
      suggestion: true
    },
    fixable: 'code',
    schema: [
      {
        type: 'array'
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const availableRawName = context.options.length ? 
      (Array.isArray(context.options[0]) ? context.options[0] : context.options) : ['Button']

    /** @param {import("vue-eslint-parser/ast").VElement} node */
    const visitHandlerFunc = function(node) {
      const clickHandleAttr = node.attributes.find(attr => {
        return attr.type === 'VAttribute'
        && attr.key.type === 'VDirectiveKey'
        && attr.key.name.name === 'on'
        && attr.key.argument.name === 'click'
        && attr.value.type === 'VExpressionContainer'
        && attr.value.expression
      })
      if(node.attributes.find(attr => {
        return attr.type === 'VAttribute' && attr.key.name === 'id'
      }) === undefined && clickHandleAttr !== undefined) {
        context.report({
          node,
          loc: node.loc,
          message: "id attribute should on Button",
          fix(fixer) {
            const handlerExpression = context.getSourceCode().getText(clickHandleAttr.value.expression).split('.').pop()
            const targetIdVal = `${handlerExpression}-btn`.replace(/[^a-zA-Z\d-]{1,}/g, '-').replace(/-{2,}/g, '-').replace(/(-$|^-)/g, '')
            const nodeCodeText = context.getSourceCode().getText(node)

            const filename = path.basename(context.getFilename()).replace(/\.vue$/, '')
            if(!fileIdMapRecord[filename]) {
              fileIdMapRecord[filename] = {}
            }
            if(!fileIdMapRecord[filename][targetIdVal]) {
              fileIdMapRecord[filename][targetIdVal] = 0
            } else {
              fileIdMapRecord[filename][targetIdVal] += 1
            }

            const replaceReg = new RegExp(`^<${node.parent.rawName}`)
            return fixer.replaceText(node, nodeCodeText.replace(replaceReg, `<${node.parent.rawName} id="${filename}-${targetIdVal}-${fileIdMapRecord[filename][targetIdVal]}"`))
          }
        })
      }
    }
    const visitors = availableRawName.reduce((pre, cur) => {
      return {
        ...pre,
        [`VStartTag[parent.rawName=${cur}]`]: visitHandlerFunc
      }
    }, {})
    return utils.defineTemplateBodyVisitor(context, visitors)
  }
}
