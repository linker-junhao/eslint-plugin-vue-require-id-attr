/**
 * @fileoverview require id attr for button element
 * @author Linker
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/button-require-id"),

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
  
ruleTester.run('button-require-id', rule, {
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
            code: '<template><Button id="test"></Button></template>'
        },
        {
            filename: 'test.vue',
            code: '<template><Button id="test" other="what"></Button></template>'
        }
    ],
    invalid: [
        {
            filename: 'test.vue',
            code: '<template><Button @click="run">a btn</Button><button @click="go">go btn</button></template>',
            output: '<template><Button id="test-run-btn-0" @click="run">a btn</Button><button id="test-go-btn-0" @click="go">go btn</button></template>',
            options: ['Button', 'button'],
            errors: ["id attribute should on Button", "id attribute should on Button"]
        }
    ]
})
  