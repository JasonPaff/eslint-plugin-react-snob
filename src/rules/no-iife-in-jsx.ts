import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils';

function isIIFE(node: TSESTree.Expression): boolean {
  // Check if it's a call expression
  if (node.type !== AST_NODE_TYPES.CallExpression) {
    return false;
  }

  const { callee } = node;

  // Check for arrow function IIFE: (() => {})()
  if (callee.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    return true;
  }

  // Check for function expression IIFE: (function() {})()
  if (callee.type === AST_NODE_TYPES.FunctionExpression) {
    return true;
  }

  return false;
}

export const noIifeInJsx = createRule({
  create(context) {
    return {
      JSXExpressionContainer(node) {
        // Skip empty expressions
        if (node.expression.type === AST_NODE_TYPES.JSXEmptyExpression) {
          return;
        }

        // Check if the expression is an IIFE
        if (isIIFE(node.expression)) {
          context.report({
            messageId: 'noIifeInJsx',
            node: node.expression,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow immediately invoked function expressions (IIFE) in JSX',
    },
    fixable: undefined,
    messages: {
      noIifeInJsx:
        'Avoid using IIFE in JSX. Extract the logic to a separate component or use useMemo/useCallback for complex computations.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-iife-in-jsx',
});
