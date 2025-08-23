import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/jasonpaff/eslint-plugin-react-snob/blob/main/docs/rules/${name}.md`
);

export const noInlineStyles = createRule({
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.name.type === 'JSXIdentifier' &&
          node.name.name === 'style' &&
          node.value &&
          node.value.type === 'JSXExpressionContainer'
        ) {
          context.report({
            messageId: 'noInlineStyle',
            node: node,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow inline styles in JSX elements',
    },
    fixable: undefined,
    messages: {
      noInlineStyle: 'Avoid using inline styles. Use CSS classes or styled-components instead.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'no-inline-styles',
});
