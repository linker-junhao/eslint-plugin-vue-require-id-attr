/**
 * @fileoverview require id attr for button element
 * @author Linker
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/input-require-id"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------
const ruleTester = new RuleTester({
    parser: require.resolve('vue-eslint-parser'),
    parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('input-require-id', rule, {
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
            code: '<template><Input></Input></template>'
        },
        {
            filename: 'test.vue',
            code: '<template><input id="test" v-model="what"></input></template>'
        }
    ],
    invalid: [
        {
            filename: 'test.vue',
            code: '<template><Input v-model="value">a Input</Input><input v-model="value.value1">a input</input></template>',
            output: '<template><Input id="test-Input-value-0" v-model="value">a Input</Input><input id="test-input-value1-0" v-model="value.value1">a input</input></template>',
            options: [['Input', 'input']],
            errors: ["id attribute should on Input", "id attribute should on input"]
        },
        {
            filename: 'test1.vue',
            code: '<template><Input v-model="value">a Input</Input><input v-model="value.value1">a input</input></template>',
            output: '<template><Input id="test1-Input-value-0" v-model="value">a Input</Input><input id="test1-input-value1-0" v-model="value.value1">a input</input></template>',
            options: [['Input', 'input']],
            errors: ["id attribute should on Input", "id attribute should on input"]
        }
    ],
})
