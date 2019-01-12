module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2015,
    "sourceType": "module"
  },
  "rules": {
    "quotes": [2, "single"],
    "no-alert": "error",
    "no-irregular-whitespace": "error",
    "eqeqeq": "warn",
    "key-spacing": "error",
    "no-dupe-keys": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "no-multi-spaces": ["error", { "ignoreEOLComments": true }],
    "no-underscore-dangle": "warn",
    "no-control-regex": "warn",
    "no-use-before-define": "error",
    "no-restricted-globals": "warn",
    "indent": [2, 2, {"SwitchCase": 1}],
    "max-nested-callbacks": ["error", { "max": 4 }],
    "switch-colon-spacing": ["error", {"after": true, "before": false}],
    "no-underscore-dangle": ["warn", { "allow": ["_on", "_off", "_teardown", "_isDestroyed"] }]
  }
};