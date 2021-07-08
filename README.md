# eslint-plugin-vue-require-id-attr

this plugin can auto complete the id attr for some element.
basically, this plugin is a set of rule to decide the id attr value. you can set the rule option with the element rawName you want to apply this rule.
```
// example:
// the node with rawName 'button', 'Button' and 'whatever' will apply this rule.
"@int-component/vue-require-id-attr/button-require-id": [2, ["button", "Button", "whatever"]]
```

## Update
* support define the the element to apply rule by rule option.
* fix eslint-plugin-vue/lib/utils require path error

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `@int-component/eslint-plugin-vue-require-id-attr`:

```
$ npm install @int-component/eslint-plugin-vue-require-id-attr --save-dev
```


## Usage

Add `@int-component/eslint-plugin-vue-require-id-attr` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@int-component/eslint-plugin-vue-require-id-attr"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@int-component/vue-require-id-attr/button-require-id": 2,
        "@int-component/vue-require-id-attr/select-require-id": 2
    }
}
```

## Supported Rules

* @int-component/vue-require-id-attr/button-require-id
* @int-component/vue-require-id-attr/select-require-id

## todo
[ ] the description for the logic of rule that how to decide id value.(now you can only get it from reading source code)

[ ] more rule






