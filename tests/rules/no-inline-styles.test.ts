import { RuleTester } from "@typescript-eslint/rule-tester";

import { noInlineStyles } from "../../src/rules/no-inline-styles";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

ruleTester.run("no-inline-styles", noInlineStyles, {
  invalid: [
    {
      code: '<div style={{ color: "red" }}>Content</div>',
      errors: [
        {
          messageId: "noInlineStyle",
        },
      ],
    },
    {
      code: '<span style={{ fontSize: "14px", margin: "10px" }}>Text</span>',
      errors: [
        {
          messageId: "noInlineStyle",
        },
      ],
    },
    {
      code: "<button style={buttonStyles}>Click me</button>",
      errors: [
        {
          messageId: "noInlineStyle",
        },
      ],
    },
  ],

  valid: [
    {
      code: '<div className="my-class">Content</div>',
    },
    {
      code: "<div>Content</div>",
    },
    {
      code: '<div data-style="something">Content</div>',
    },
  ],
});
