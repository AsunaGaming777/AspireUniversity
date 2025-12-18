module.exports = {
  extends: [
    "./typescript.js",
    "./react.js",
    "prettier"
  ],
  rules: {
    // General
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "off", // Handled by TypeScript
    
    // Import ordering
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external", 
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ]
  }
};
  extends: [
    "./typescript.js",
    "./react.js",
    "prettier"
  ],
  rules: {
    // General
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "off", // Handled by TypeScript
    
    // Import ordering
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external", 
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ]
  }
};


