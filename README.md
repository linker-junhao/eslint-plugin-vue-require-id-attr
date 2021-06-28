# eslint-plugin-vue-require-id-attr

require id attr for specific element

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
        "@int-component/eslint-plugin-vue-require-id-attrr"
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

* Fill in provided rules here





