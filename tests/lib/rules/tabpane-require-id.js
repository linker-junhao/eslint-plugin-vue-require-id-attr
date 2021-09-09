/**
 * @fileoverview Tabpane element require id attr
 * @author Linker
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/tabpane-require-id"),

    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
var ruleTester = new RuleTester({
    parser: require.resolve('vue-eslint-parser'),
    parserOptions: { ecmaVersion: 2015 }
});
ruleTester.run("tabpane-require-id", rule, {

    valid: [
        {
            filename: 'test.vue',
            code: ''
        },
        {
            filename: 'test.vue',
            code: '<template></template>'
        },
        {
            filename: 'test.vue',
            code: '<template><Tabs><Tabpane id="test" label="test"></Tabpane><Tabs></template>'
        },
        {
            filename: 'test.vue',
            code: '<template><Tabs><Tabpane id="test" :label="test"></Tabpane><Tabs></template>'
        },
        {
            filename: 'test.vue',
            code: '<template><Tabs><Tabpane id="test" :label="test"></Tabpane><Tabpane id="test-1" :label="test"></Tabpane><Tabs></template>'
        }
    ],

    invalid: [
        {
            filename: 'test.vue',
            code: '<template><Tabs><Tabpane :label="test" :name="test"></Tabpane></Tabs></template>',
            output: '<template><Tabs><Tabpane id="test-test-tabpane-0" :label="test" :name="test"></Tabpane></Tabs></template>',
            errors: ['id attribute should on tabpane']
        },
        {
            filename: 'test.vue',
            code: '<template><Tabs><Tabpane :label="test" name="test"></Tabpane></Tabs></template>',
            output: '<template><Tabs><Tabpane id="test-test-tabpane-0" :label="test" name="test"></Tabpane></Tabs></template>',
            errors: ['id attribute should on tabpane']
        },
        {
            filename: 'test.vue',
            code: '<template><Tabs><Tabpane label="test" name="test"></Tabpane><Tabs></template>',
            output: '<template><Tabs><Tabpane id="test-test-tabpane-0" label="test" name="test"></Tabpane><Tabs></template>',
            errors: ['id attribute should on tabpane']
        },
        {
            filename: 'file.vue',
            code: '<template><Tabs><Tabpane label="中文" :name="name"></Tabpane><Tabpane label="宇博" :name="name"></Tabpane><Tabpane label="凯晶" :name="name"></Tabpane><Tabpane label="俊豪" :name="name"></Tabpane></Tabs></template>',
            output: '<template><Tabs><Tabpane id="file-ZhongWen-tabpane-0" label="中文" :name="name"></Tabpane><Tabpane id="file-YuBo-tabpane-0" label="宇博" :name="name"></Tabpane><Tabpane id="file-KaiJing-tabpane-0" label="凯晶" :name="name"></Tabpane><Tabpane id="file-JunHao-tabpane-0" label="俊豪" :name="name"></Tabpane></Tabs></template>',
            errors: ['id attribute should on tabpane', 'id attribute should on tabpane','id attribute should on tabpane','id attribute should on tabpane']
        },
        {
            filename: 'test.vue',
            code: '<template><Tabs><Tabpane label="test"></Tabpane></Tabs></template>',
            output: '<template><Tabs><Tabpane id="test-test-tabpane-0" label="test"></Tabpane></Tabs></template>',
            errors: ['id attribute should on tabpane']
        },
        {
            filename: 'file.vue',
            code: '<template><Tabs><Tabpane :label="label"></Tabpane></Tabs></template>',
            output: '<template><Tabs><Tabpane id="file-label-tabpane-0" :label="label"></Tabpane></Tabs></template>',
            errors: ['id attribute should on tabpane']
        },
    ]
});