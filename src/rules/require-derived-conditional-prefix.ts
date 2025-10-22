import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

import {
  createRule,
  countLogicalOperators,
  containsJSX,
  suggestUnderscorePrefix,
  hasUnderscorePrefix,
  isDerivedBooleanExpression,
} from '../utils';

// Use shared naming utilities from utils

// Use shared boolean expression utilities from utils

/**
 * Checks if a logical expression is likely a string fallback pattern (e.g., error || 'default')
 */
function isStringFallbackPattern(node: TSESTree.LogicalExpression): boolean {
  // Check if one side is a string literal
  if (node.right.type === AST_NODE_TYPES.Literal && typeof node.right.value === 'string') {
    return true;
  }
  if (node.left.type === AST_NODE_TYPES.Literal && typeof node.left.value === 'string') {
    return true;
  }
  return false;
}

/**
 * Checks if an expression is complex enough to warrant underscore prefix
 * (has logical operators or is a derived boolean expression)
 */
function isComplexDerivedExpression(node: TSESTree.Expression): boolean {
  // Check if it's a derived boolean expression first
  if (isDerivedBooleanExpression(node)) {
    return true;
  }

  // Check if it has logical operators (&&, ||) - these are likely used for conditional logic
  if (countLogicalOperators(node) > 0) {
    // But exclude string fallback patterns like error || 'default'
    if (node.type === AST_NODE_TYPES.LogicalExpression && node.operator === '||') {
      if (isStringFallbackPattern(node)) {
        return false;
      }
    }
    return true;
  }

  return false;
}

// Use shared JSX detection utility from utils

export const requireDerivedConditionalPrefix = createRule({
  create(context) {
    // Keep track of derived conditional variables
    const derivedConditionals = new Set<string>();
    const variableNodes = new Map<string, TSESTree.Node>();

    /**
     * Reports an error for a derived conditional variable that doesn't start with underscore
     */
    function reportDerivedConditional(node: TSESTree.Node, name: string): void {
      if (hasUnderscorePrefix(name)) return;

      context.report({
        data: {
          name,
          suggested: suggestUnderscorePrefix(name),
        },
        messageId: 'derivedConditionalShouldStartWithUnderscore',
        node,
      });
    }

    /**
     * Checks if an identifier is being used in a JSX conditional rendering context
     */
    function checkIdentifierInJSXContext(node: TSESTree.Identifier): void {
      const variableName = node.name;

      if (!derivedConditionals.has(variableName)) return;

      let parent: TSESTree.Node | null = node.parent;

      // Walk up the AST to check for JSX conditional contexts
      while (parent) {
        // JSX expression container: {variable && <Component />}
        if (parent.type === AST_NODE_TYPES.JSXExpressionContainer) {
          const expression = parent.expression;

          // Logical AND for conditional rendering: variable && <JSX>
          if (expression.type === AST_NODE_TYPES.LogicalExpression && expression.operator === '&&') {
            if (expression.left === node && containsJSX(expression.right)) {
              const originalNode = variableNodes.get(variableName);
              if (originalNode) {
                reportDerivedConditional(originalNode, variableName);
                return;
              }
            }
          }

          // Ternary operator: variable ? <JSX> : <JSX>
          if (expression.type === AST_NODE_TYPES.ConditionalExpression && expression.test === node) {
            if (containsJSX(expression.consequent) || containsJSX(expression.alternate)) {
              const originalNode = variableNodes.get(variableName);
              if (originalNode) {
                reportDerivedConditional(originalNode, variableName);
                return;
              }
            }
          }
        }

        // JSX attribute with condition prop: <Conditional condition={variable}>
        if (parent.type === AST_NODE_TYPES.JSXAttribute) {
          const attrName = parent.name;
          if (
            attrName.type === AST_NODE_TYPES.JSXIdentifier &&
            (attrName.name === 'condition' || attrName.name === 'when' || attrName.name === 'if')
          ) {
            const originalNode = variableNodes.get(variableName);
            if (originalNode) {
              reportDerivedConditional(originalNode, variableName);
              return;
            }
          }
        }

        // Ternary operator at top level: variable ? <Component /> : null
        if (parent.type === AST_NODE_TYPES.ConditionalExpression && parent.test === node) {
          if (containsJSX(parent.consequent) || containsJSX(parent.alternate)) {
            const originalNode = variableNodes.get(variableName);
            if (originalNode) {
              reportDerivedConditional(originalNode, variableName);
              return;
            }
          }
        }

        // Logical expression at top level: variable && <Component />
        if (parent.type === AST_NODE_TYPES.LogicalExpression && parent.operator === '&&' && parent.left === node) {
          if (containsJSX(parent.right)) {
            const originalNode = variableNodes.get(variableName);
            if (originalNode) {
              reportDerivedConditional(originalNode, variableName);
              return;
            }
          }
        }

        parent = parent.parent || null;
      }
    }

    return {
      // Check every identifier to see if it references a tracked variable in JSX context
      Identifier(node) {
        checkIdentifierInJSXContext(node);
      },

      // Variable declarations (const, let, var)
      VariableDeclarator(node) {
        if (node.id.type !== AST_NODE_TYPES.Identifier) return;
        if (!node.init) return;

        const name = node.id.name;

        // Check if this is a derived boolean expression
        if (isComplexDerivedExpression(node.init)) {
          derivedConditionals.add(name);
          variableNodes.set(name, node.id);
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Enforce derived conditional variables used in JSX to start with underscore prefix',
    },
    fixable: undefined,
    messages: {
      derivedConditionalShouldStartWithUnderscore:
        'Derived conditional variable "{{name}}" used in JSX rendering should start with underscore prefix. Consider using "{{suggested}}" instead.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'require-derived-conditional-prefix',
});
