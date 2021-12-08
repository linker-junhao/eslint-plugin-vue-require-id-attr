/**
 * @fileoverview require id attr for button element
 * @author Linker
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/option-require-name"),

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

ruleTester.run('option-require-name', rule, {
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
      code: '<template><option :key="key" :name="key"></option></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Option :key="key" :name="key"></Option></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><option v-for="(key,value) in testList" :key="key" :value="value">a option</option></template>',
      output: '<template><option :name="value" v-for="(key,value) in testList" :key="key" :value="value">a option</option></template>',
      options: [['Option', 'option']],
      errors: ["name attribute should on option"]
    },
    {
      filename: 'test1.vue',
      code: '<template><Option value="value1">a Option</Option><Option value="value2">a Option</Option></template>',
      output: '<template><Option name="value1" value="value1">a Option</Option><Option name="value2" value="value2">a Option</Option></template>',
      options: [['Option', 'option']],
      errors: ["name attribute should on Option", "name attribute should on Option"]
    },
  ]
})
