/**
 * @fileoverview select element require id attr
 * @author Linker
 */
"use strict";

const utils = require("eslint-plugin-vue/lib/utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// avoid id redumplicate
const fileIdMapRecord = {}

module.exports = {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Select auto add id attr'
      },
      fixable: 'code',
      schema: []
    },
    /** @param {RuleContext} context */
    create(context) {
      return utils.defineTemplateBodyVisitor(context, {
        /** @param {import("vue-eslint-parser/ast").VStartTag} node */
        "VStartTag[parent.rawName=Select]"(node) {
          const idValueTargetAttr = node.attributes.find(attr => {
            return attr.type === 'VAttribute'
            && attr.key.type === 'VDirectiveKey'
            && attr.key.name.name === 'model'
            && attr.value?.type === 'VExpressionContainer'
            && attr.value.expression
          }) || node.attributes.find(attr => {
              return attr.type === 'VAttribute'
              && attr.key.type === 'VDirectiveKey'
              && attr.key.name.name === 'bind'
              && attr.key.argument.name === 'value'
              && attr.value?.type === 'VExpressionContainer'
              && attr.value.expression
          })
          if(node.attributes.find(attr => {
            return attr.type === 'VAttribute' && attr.key.name === 'id'
          }) === undefined && idValueTargetAttr !== undefined) {
            context.report({
              node,
              loc: node.loc,
              message: "select with value prop or v-model directive require id attr",
              fix(fixer) {
                const targetExpressiong = context.getSourceCode().getText(idValueTargetAttr.value.expression).split('.').pop()
                const targetIdVal = `${targetExpressiong}-select`.replace(/[^a-zA-Z\d-]{1,}/g, '-').replace(/-{2,}/g, '-').replace(/(-$|^-)/g, '')
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

                return fixer.replaceText(node, nodeCodeText.replace(/^<Select/, `<Select id="${filename}-${targetIdVal}-${fileIdMapRecord[filename][targetIdVal]}"`))
              }
            })
          }
        }
      })
    }
  }
