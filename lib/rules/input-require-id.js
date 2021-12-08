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
            description: 'auto add id attr for input, the value of id will be generated according to input and filename, etc.',
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
            (Array.isArray(context.options[0]) ? context.options[0] : context.options) : ['input', 'Input']

        /** @param {import("vue-eslint-parser/ast").VElement} node */
        const visitHandlerFunc = function (node) {
            function isIncludeVBindProperty(node, property) {
                return node.attributes.find(attr => {
                    return attr.type === 'VAttribute'
                        && attr.directive
                        && attr.key.type === 'VDirectiveKey'
                        && attr.key?.name.rawName === property
                        && attr.value?.type === 'VExpressionContainer'
                })
            }
            function isIncludeBindProperty(node, property) {
                return node.attributes.find(attr => {
                    return attr.type === 'VAttribute'
                        && attr.directive
                        && attr.key.type === 'VDirectiveKey'
                        && attr.key?.name.name === 'bind'
                        && attr.key?.name.parent.argument.name === property
                        && attr.value?.type === 'VExpressionContainer'
                })
            }

            function isIncludeProperty(node, property) {
                return node.attributes.find(attr => {
                    return attr.type === 'VAttribute'
                        && attr.key.type === 'VIdentifier'
                        && attr.key.name === property
                        && attr.value?.type === 'VLiteral'
                })
            }
            // 是否含有id
            const includeID = isIncludeProperty(node, 'id')
            if (!includeID) {
                // 是否含有v-model
                const includeVbindModel = isIncludeVBindProperty(node, 'model')
                if (includeVbindModel) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `id attribute should on ${node.parent.rawName}`,
                        fix(fixer) {
                            const regex = /\"/g
                            const targetExpressiong = context.getSourceCode().getText(includeVbindModel.value).split('.').pop().replace(regex, "")
                            const targetIdVal = `-${node.parent.rawName}`.replace(/[^a-zA-Z\d-]{1,}/g, '-').replace(/-{2,}/g, '-').replace(/(-$|^-)/g, '')
                            const nodeCodeText = context.getSourceCode().getText(node)

                            const filename = path.basename(context.getFilename()).replace(/\.vue$/, '')
                            if (!fileIdMapRecord[filename]) {
                                fileIdMapRecord[filename] = {}
                            }
                            if (!fileIdMapRecord[filename][targetIdVal] && fileIdMapRecord[filename][targetIdVal] !== 0) {
                                fileIdMapRecord[filename][targetIdVal] = 0
                            } else {
                                fileIdMapRecord[filename][targetIdVal] += 1
                            }

                            const replaceReg = new RegExp(`^<${node.parent.rawName}`)
                            return fixer.replaceText(node, nodeCodeText.replace(replaceReg, `<${node.parent.rawName} id="${filename}-${node.parent.rawName}-${targetExpressiong}-${fileIdMapRecord[filename][targetIdVal]}"`))
                        }
                    })
                }
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
