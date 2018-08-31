module.exports = {
    "extends": "airbnb",
    "env": {
        "browser": true
    },
    "parser": "babel-eslint",
    "rules": {
        "linebreak-style": 0,
        "no-unused-expressions": 0,
        "no-param-reassign": 1,
        "guard-for-in": 1,
        "no-restricted-syntax": 1,
        "no-nested-ternary": 1,
        "camelcase": 1,
        "consistent-return": [1, { "treatUndefinedAsUnspecified": true }],
        "eqeqeq": 0,
        "max-len": 0,
        "no-underscore-dangle": 0,
        "no-multiple-empty-lines": 0,
        "one-var": 0,
        "no-return-assign": 1,
        "no-multi-spaces": [2, { "ignoreEOLComments": true }], //--fix
        "jsx-quotes": [2, "prefer-single"], //--fix
        "quotes": [2, "single", { "allowTemplateLiterals": true }], // --fix
        "no-trailing-spaces": [2, { "skipBlankLines": true }], // --fix,
        "object-curly-newline": [2, { "multiline": true }], //--fix
        "operator-linebreak": [2, "after",
            {
                "overrides": {
                    "?": "before",
                    ":": "before"
                }
            }
        ], //--fix
        "react/prefer-stateless-function": 1,
        "react/jsx-one-expression-per-line": [0, { "allow": "single-child" }],
        "react/button-has-type": 1,
        "react/destructuring-assignment": 0,
        "react/prop-types": 1,
        "react/no-children-prop": 1,
        "react/require-default-props": 1,
        "react/no-access-state-in-setstate": 1,
        "react/jsx-filename-extension": 0,
        "react/forbid-prop-types": 1,
        "react/no-array-index-key": 1,
        "react/jsx-no-target-blank": [2, {"enforceDynamicLinks": "never" }],
        "import/no-extraneous-dependencies": 0,
        "jsx-a11y/click-events-have-key-events": 1,
        "jsx-a11y/no-noninteractive-element-interactions": 1,

        "prefer-template": 2, // --fix
        "semi": 2,  // --fix
        "no-extra-semi": 2, // --fix
        "prefer-const": 2, //--fix
        "indent": 2, //--fix
        "comma-dangle": 2, //--fix
        "arrow-parens": 2, //--fix
        "eol-last": 2, //--fix
        "space-in-parens": 2, //--fix
        "react/jsx-tag-spacing": 2, //--fix
        "react/jsx-indent": 2, //--fix
        "react/jsx-boolean-value": 2, //--fix
        "import/order": 2, //--fix
    }
};