module.exports = {
  extends: 'eslint:all',
  plugins: ['html'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  rules: {
    'array-element-newline': 0,
    'arrow-body-style': 0,
    'arrow-parens': [2, 'as-needed'],
    'capitalized-comments': 0,
    'comma-dangle': [2, 'only-multiline'],
    'curly': [2, 'multi-line', 'consistent'],
    'dot-location': [2, 'property'],
    'func-names': 0,
    'func-style': [2, 'declaration', { allowArrowFunctions: true }],
    'id-length': 0,
    'indent': [2, 2, { SwitchCase: 1 }],
    'max-len': [2, { ignoreUrls: true }],
    'max-statements': 0,
    'multiline-comment-style': 0,
    'multiline-ternary': 0,
    'newline-per-chained-call': 0,
    'no-console': 0,
    'no-empty': [2, { allowEmptyCatch: true }],
    'no-empty-function': [2, { allow: ['arrowFunctions'] }],
    'no-extra-parens': [2, 'all', { nestedBinaryExpressions: false }],
    'no-magic-numbers': 0,
    'no-negated-condition': 0,
    'no-new': 0,
    'no-param-reassign': 0,
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'no-process-env': 0,
    'no-sync': 0,
    'no-ternary': 0,
    'no-unused-vars': [2, { args: 'none' }],
    'no-unused-expressions': [2, { allowShortCircuit: true }],
    'no-use-before-define': [2, 'nofunc'],
    'no-warning-comments': 0,
    'object-curly-newline': [2, { consistent: true }],
    'object-property-newline': 0,
    'one-var': [2, 'never'],
    'operator-linebreak': [2, 'after'],
    'padded-blocks': 0,
    'prefer-destructuring': 0,
    'quote-props': 0,
    'quotes': [2, 'single'],
    'require-jsdoc': 0,
    'semi': [2, 'never'],
    'sort-imports': 0,
    'sort-keys': 0,
    'space-before-function-paren': [2, { named: 'never' }],
    'strict': 0,
  }
}
