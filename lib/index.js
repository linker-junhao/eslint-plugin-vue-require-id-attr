/**
 * @fileoverview require id attr for specific element
 * @author Linker
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
module.exports = {
  configs: {
    recommended: {
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      env: {
        browser: true,
        es6: true
      },
      plugins: ['@int-component/vue-require-id-attr'],
      rules: {
        "@int-component/vue-require-id-attr/button-require-id": [2, 'Button', 'button'],
        "@int-component/vue-require-id-attr/select-require-id": [2, 'Select', 'select']
      }
    }
  },
  rules: requireIndex(__dirname + "/rules"),
}
