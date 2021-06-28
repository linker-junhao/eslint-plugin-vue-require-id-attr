/**
 * @fileoverview require id attr for button element
 * @author Linker
 */
"use strict";


const utils = require("../../node_modules/eslint-plugin-vue/lib/utils");
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
      description: 'button auto add id attr'
    },
    fixable: 'code',
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      /** @param {import("vue-eslint-parser/ast").VElement} node */
      "VStartTag[parent.rawName=Button]"(node) {
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

              return fixer.replaceText(node, nodeCodeText.replace(/^<Button/, `<Button id="${filename}-${targetIdVal}-${fileIdMapRecord[filename][targetIdVal]}"`))
            }
          })
        }
      }
    })
  }
}
