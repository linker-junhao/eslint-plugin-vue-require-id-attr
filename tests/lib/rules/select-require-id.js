/**
 * @fileoverview select element require id attr
 * @author Linker
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/select-require-id"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({
    parser: require.resolve('vue-eslint-parser'),
    parserOptions: { ecmaVersion: 2015 }
});
ruleTester.run("select-require-id", rule, {

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
            code: '<template><Select id="test"></Select></template>'
        },
        {
            filename: 'test.vue',
            code: '<template><Select id="test" v-model="test" other="what"></Select></template>'
        },
        {
            filename: 'test.vue',
            code: '<template><Select id="test" :value="test" other="what"></Select></template>'
        }
    ],

    invalid: [
        {
            filename: 'test.vue',
            code: '<template><Select :value="test" other="what"></Select></template>',
            output: '<template><Select id="test-test-select-0" :value="test" other="what"></Select></template>',
            errors: ['select with value prop or v-model directive require id attr']
        },
        {
            filename: 'test.vue',
            code: '<template><Select v-model="test" other="what"></Select></template>',
            output: '<template><Select id="test-test-select-0" v-model="test" other="what"></Select></template>',
            errors: ['select with value prop or v-model directive require id attr']
        }
    ]
});
