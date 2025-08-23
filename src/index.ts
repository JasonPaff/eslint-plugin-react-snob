import { noInlineStyles } from "./rules/no-inline-styles";

const plugin = {
  meta: {
    name: "eslint-plugin-react-snob",
    version: "1.0.0",
  },
  rules: {
    "no-inline-styles": noInlineStyles,
  },
  configs: {
    recommended: {
      plugins: ["react-snob"],
      rules: {
        "react-snob/no-inline-styles": "warn",
      },
    },
    strict: {
      plugins: ["react-snob"],
      rules: {
        "react-snob/no-inline-styles": "error",
      },
    },
  },
};

export = plugin;