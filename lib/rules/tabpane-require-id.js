/**
 * @fileoverview select element require id attr
 * @author Linker
 */
"use strict";

const utils = require("eslint-plugin-vue/lib/utils");
const pinyin = require("js-pinyin")
const path = require("path");

pinyin.setOptions({checkPolyphone:false,charCase:0});
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// avoid id redumplicate
const fileIdMapRecord = {};

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Tabpane auto add id attr",
            suggestion: true,
        },
        fixable: "code",
        schema: [
            {
                type: 'array'
            }
        ]
    },
    /** @param {RuleContext} context */
    create(context) {
        // 获取context配置，如果没有，使用默认值
        const availableRawName = context.options.length ? (Array.isArray(context.options[0]) ? context.options[0] : context.options) : ['Tabpane']
        /** @param {import("vue-eslint-parser/ast").VElement} node */
        // 节点筛选并修复
        const visitHandlerFunc = function (node) {
             // 是否含有label属性
            const includeLabel = node.attributes.find(attr => {
                return attr.type === 'VAttribute'
                    && attr.key.type === 'VIdentifier'
                    && attr.key.name === 'label'
                    && attr.value?.type === 'VLiteral'
            })
            // 是否含有:label属性
            const includeBindLabel = node.attributes.find(attr => {
                return attr.type === 'VAttribute'
                    && attr.directive
                    && attr.key.type === 'VDirectiveKey'
                    && attr.key?.name.name === 'bind'
                    && attr.key?.name.parent.argument.name === 'label'
                    && attr.value?.type === 'VExpressionContainer'
            })
            // 必须含有name或者label中的一个
            const tabHandleAttr = includeLabel || includeBindLabel
            // 判断节点没有id且含有属性
            if (node.attributes.find(attr => {
                return attr.type === 'VAttribute' && attr.key.name === 'id'
            }) === undefined && tabHandleAttr !== undefined) {
                context.report({
                    node,
                    loc: node.loc,
                    message: 'id attribute should on tabpane',
                    fix(fixer) {
                        let handlerExpression = ''
                        if (tabHandleAttr.directive 
                            && tabHandleAttr.key.type === 'VDirectiveKey' 
                            && tabHandleAttr.value?.type === 'VExpressionContainer') {
                            handlerExpression = context.getSourceCode().getText(tabHandleAttr.value.expression).split('.').pop()
                        } else if (tabHandleAttr.type === 'VAttribute'
                            && tabHandleAttr.key.type === 'VIdentifier'
                            && tabHandleAttr.value?.type === 'VLiteral') {
                            handlerExpression = context.getSourceCode().getText(tabHandleAttr.value).split('.').pop()
                        }
                        handlerExpression = pinyin.getFullChars(handlerExpression)
                        const targetIdVal = `${handlerExpression}-tabpane`.replace(/[^a-zA-Z\d-]{1,}/g, '-').replace(/-{2,}/g, '-').replace(/(-$|^-)/g, '')
                        const nodeCodeText = context.getSourceCode().getText(node)
                        const filename = path.basename(context.getFilename()).replace(/\.vue$/, '')
                        if (!fileIdMapRecord[filename]) {
                            fileIdMapRecord[filename] = {}
                        }
                        if (!fileIdMapRecord[filename][targetIdVal]) {
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
};
