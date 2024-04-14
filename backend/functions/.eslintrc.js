/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],
    "linebreak-style": "off",
    "block-spacing": "off",
    "brace-style": "off",
    "object-curly-spacing": "off",
    "max-len": "off",
    "prefer-const": "off",
    "indent": ["error", 2, {
      "SwitchCase": 1,
    }],
    "new-cap": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
