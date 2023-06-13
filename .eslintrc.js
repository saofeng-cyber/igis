module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended', '@vue/typescript'],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-prototype-builtins': 'off',
    'no-new-wrappers': 'off',
    'no-unused-vars': 'off',
    'vue/require-default-prop': 'off',
    'no-array-constructor': 'off',
    'dot-notation': 'off',
    'semi': 'off',
    'space-before-function-paren': "off",
    'vue/html-indent': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': 'error',
    'vue/camelcase': 'error',
    'vue/comma-dangle': 'error',
    'vue/component-name-in-template-casing': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/eqeqeq': 'error',
    'vue/key-spacing': 'error',
    'vue/match-component-file-name': 'error',
    'vue/object-curly-spacing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/require-prop-types': 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }]
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ],
  ignorePatterns: ['src/assets/font/iconfont.js']
};
