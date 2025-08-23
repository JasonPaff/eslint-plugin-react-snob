import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/yourusername/eslint-plugin-react-snob/blob/main/docs/rules/${name}.md`
);

export const requireJsxStringBraces = createRule({
  name: "require-jsx-string-braces",
  meta: {
    type: "suggestion",
    docs: {
      description: "Require curly braces around string literals in JSX attributes",
    },
    fixable: "code",
    schema: [],
    messages: {
      requireBraces: "String literals in JSX attributes should be wrapped in curly braces: {{attribute}}={{'{'}}'{{value}}'{{'}'}}}",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.value &&
          node.value.type === "Literal" &&
          typeof node.value.value === "string"
        ) {
          const attributeName = node.name.type === "JSXIdentifier" 
            ? node.name.name 
            : node.name.type === "JSXNamespacedName"
            ? `${node.name.namespace.name}:${node.name.name.name}`
            : "attribute";

          context.report({
            node: node.value,
            messageId: "requireBraces",
            data: {
              attribute: attributeName,
              value: String(node.value.value),
            },
            fix(fixer) {
              if (node.value && node.value.type === "Literal" && typeof node.value.raw === "string") {
                const quote = node.value.raw.charAt(0);
                const innerValue = node.value.raw.slice(1, -1);
                return fixer.replaceText(node.value, `{${quote}${innerValue}${quote}}`);
              }
              return null;
            },
          });
        }
      },
    };
  },
});