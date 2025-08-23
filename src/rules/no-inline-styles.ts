import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/yourusername/eslint-plugin-react-snob/blob/main/docs/rules/${name}.md`
);

export const noInlineStyles = createRule({
  name: "no-inline-styles",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow inline styles in JSX elements",
    },
    fixable: undefined,
    schema: [],
    messages: {
      noInlineStyle: "Avoid using inline styles. Use CSS classes or styled-components instead.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name === "style" &&
          node.value &&
          node.value.type === "JSXExpressionContainer"
        ) {
          context.report({
            node: node,
            messageId: "noInlineStyle",
          });
        }
      },
    };
  },
});