import { createRule } from '../utils';

export const noShorthandFragment = createRule({
  create(context) {
    return {
      JSXFragment(node) {
        context.report({
          messageId: 'noShorthandFragment',
          node: node,
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow shorthand fragment syntax in favor of explicit Fragment',
    },
    fixable: undefined,
    messages: {
      noShorthandFragment: 'Avoid using shorthand fragment syntax <></>. Use explicit <Fragment></Fragment> instead.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'no-shorthand-fragment',
});
