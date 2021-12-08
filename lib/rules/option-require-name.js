/**
 * @fileoverview require id attr for button element
 * @author Linker
 */
"use strict";

const utils = require("eslint-plugin-vue/lib/utils");
const path = require("path")

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'auto add name attr for option, the value of id will be generated according to key value.',
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
            (Array.isArray(context.options[0]) ? context.options[0] : context.options) : ['Option', 'option']

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
        function isIncludeVBindProperty(node, property) {
            return node.attributes.find(attr => {
                return attr.type === 'VAttribute'
                    && attr.directive
                    && attr.key.type === 'VDirectiveKey'
                    && attr.key?.name.rawName === property
                    && attr.value?.type === 'VExpressionContainer'
            })
        }

        function setContext(context, node, value, type = null) {
            return context.report({
                node,
                loc: node.loc,
                message: `name attribute should on ${node.parent.rawName}`,
                fix(fixer) {
                    const handlerExpression = type ? `"` + context.getSourceCode().getText(value.value.expression) + `"` : context.getSourceCode().getText(value.value)
                    const nodeCodeText = context.getSourceCode().getText(node)
                    const replaceReg = new RegExp(`^<${node.parent.rawName}`)
                    const label = type ? (type === 'bind' ? ':name' : '') : 'name'
                    return fixer.replaceText(node, nodeCodeText.replace(replaceReg, `<${node.parent.rawName} ${label}=${handlerExpression}`))
                }
            })
        }

        /** @param {import("vue-eslint-parser/ast").VElement} node */
        const visitHandlerFunc = function (node) {
            // 是否含有:name属性
            const includeBindName = isIncludeBindProperty(node, 'name')
            // 是否含有name属性
            const includeName = isIncludeProperty(node, 'name')
            if (!includeBindName && !includeName) {
                // 是否含有v-for属性
                const includeBindFor = isIncludeVBindProperty(node, 'for')
                if (includeBindFor === undefined) {
                    // 是否含有value属性
                    const includeValue = isIncludeProperty(node, 'value')
                    // 是否含有:value属性
                    const includeBindValue = isIncludeBindProperty(node, 'value')
                    if (includeValue !== undefined) {
                        return setContext(context, node, includeValue)
                    } else if (includeBindValue !== undefined) {
                        return setContext(context, node, includeBindValue, 'bind')
                    }
                } else {
                    // 是否含有:value属性
                    const includeBindValue = isIncludeBindProperty(node, 'value')
                    if (includeBindValue !== undefined) {
                        return setContext(context, node, includeBindValue, 'bind')
                    }
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
