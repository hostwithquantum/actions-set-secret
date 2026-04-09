const js = require('@eslint/js')
const jsdoc = require('eslint-plugin-jsdoc')
const stylistic = require('@stylistic/eslint-plugin-js')

module.exports = [
  {
    ignores: ['dist/']
  },
  js.configs.recommended,
  jsdoc.configs['flat/recommended'],
  {
    plugins: {
      '@stylistic/js': stylistic
    },
    languageOptions: {
      ecmaVersion: 2017,
      sourceType: 'commonjs',
      globals: {
        Buffer: 'readonly',
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      '@stylistic/js/max-len': ['error', {code: 150}],
      '@stylistic/js/indent': ['error', 2, {SwitchCase: 1}],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      '@stylistic/js/comma-dangle': ['error', 'never'],
      '@stylistic/js/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }],
      '@stylistic/js/brace-style': ['error', '1tbs', {allowSingleLine: true}],
      '@stylistic/js/comma-spacing': ['error', {before: false, after: true}],
      '@stylistic/js/comma-style': ['error', 'last'],
      '@stylistic/js/key-spacing': ['error', {beforeColon: false, afterColon: true}],
      '@stylistic/js/keyword-spacing': ['error'],
      '@stylistic/js/no-multi-spaces': 'error',
      '@stylistic/js/no-trailing-spaces': 'error',
      '@stylistic/js/space-in-parens': ['error', 'never'],
      '@stylistic/js/space-infix-ops': 'error',
      '@stylistic/js/space-unary-ops': ['error', {words: true, nonwords: false}],
      '@stylistic/js/eol-last': 'error',
      '@stylistic/js/block-spacing': ['error', 'always'],
      '@stylistic/js/semi-spacing': ['error', {before: false, after: true}],
      '@stylistic/js/arrow-spacing': ['error', {before: true, after: true}],
      '@stylistic/js/dot-location': ['error', 'property'],
      '@stylistic/js/no-floating-decimal': 'error',
      '@stylistic/js/no-multiple-empty-lines': ['error', {max: 2}],
      '@stylistic/js/quote-props': ['error', 'as-needed'],
      '@stylistic/js/spaced-comment': ['error', 'always', {
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
      }],
      '@stylistic/js/wrap-iife': ['error', 'any'],
      eqeqeq: ['error', 'allow-null'],
      'no-caller': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'no-unneeded-ternary': ['error', {defaultAssignment: false}],
      'no-useless-call': 'error',
      'no-with': 'error',
      'one-var': ['error', {initialized: 'never'}],
      radix: 'error',
      strict: 'off',
      yoda: ['error', 'never'],
      'jsdoc/no-undefined-types': 0
    }
  }
]
