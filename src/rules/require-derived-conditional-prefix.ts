import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule, countLogicalOperators } from '../utils';

/**
 * Converts a variable name to its suggested underscore prefixed version
 */
function suggestUnderscorePrefix(name: string): string {
  if (name.startsWith('_')) return name;
  return `_${name}`;
}

/**
 * Checks if a name already starts with underscore
 */
function hasUnderscorePrefix(name: string): boolean {
  return name.startsWith('_');
}

/**
 * Checks if an expression is likely to produce a boolean value
 */
function isLikelyBooleanExpression(node: TSESTree.Expression): boolean {
  switch (node.type) {
    case AST_NODE_TYPES.UnaryExpression:
      // Negation operators like !, especially double negation !!
      return node.operator === '!';

    case AST_NODE_TYPES.BinaryExpression:
      // Comparison operators return boolean values
      return ['==', '===', '!=', '!==', '<', '>', '<=', '>='].includes(node.operator);

    case AST_NODE_TYPES.ConditionalExpression:
      // Ternary expressions that return boolean values
      return isLikelyBooleanExpression(node.consequent) || isLikelyBooleanExpression(node.alternate);

    case AST_NODE_TYPES.LogicalExpression:
      // For logical expressions, check if both operands are likely boolean
      return isLikelyBooleanExpression(node.left) && isLikelyBooleanExpression(node.right);

    case AST_NODE_TYPES.Literal:
      return typeof node.value === 'boolean';

    case AST_NODE_TYPES.Identifier:
      // Identifiers that start with common boolean prefixes are likely boolean
      return /^(is|has|can|should|will|does|did|was|were|am|are|be)[A-Z]/.test(node.name);

    default:
      return false;
  }
}

/**
 * Checks if an expression is a derived boolean expression that should require underscore prefix
 */
function isDerivedBooleanExpression(node: TSESTree.Expression): boolean {
  switch (node.type) {
    case AST_NODE_TYPES.LogicalExpression:
      // Only consider logical expressions as derived boolean if BOTH sides are likely producing boolean values
      // This filters out string fallback patterns like `error || 'default'`
      return isLikelyBooleanExpression(node.left) && isLikelyBooleanExpression(node.right);

    case AST_NODE_TYPES.UnaryExpression:
      // Negation operators like !, especially double negation !!
      return node.operator === '!';

    case AST_NODE_TYPES.BinaryExpression:
      // Comparison operators return boolean values
      return ['==', '===', '!=', '!==', '<', '>', '<=', '>='].includes(node.operator);

    case AST_NODE_TYPES.ConditionalExpression:
      // Ternary expressions that return boolean values
      return isLikelyBooleanExpression(node.consequent) && isLikelyBooleanExpression(node.alternate);

    default:
      return false;
  }
}

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

/**
 * Checks if a node contains JSX elements
 */
function containsJSX(node: TSESTree.Node, visited: Set<TSESTree.Node> = new Set()): boolean {
  if (visited.has(node)) {
    return false; // Prevent infinite recursion
  }
  visited.add(node);

  if (node.type === AST_NODE_TYPES.JSXElement || node.type === AST_NODE_TYPES.JSXFragment) {
    return true;
  }

  // Check children nodes, but avoid parent references
  for (const key in node) {
    if (key === 'parent') continue; // Skip parent references to avoid cycles

    const value = (node as unknown as Record<string, unknown>)[key];
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.some((item) => item && typeof item === 'object' && 'type' in item && containsJSX(item as TSESTree.Node, visited))) {
          return true;
        }
      } else if ('type' in value && containsJSX(value as TSESTree.Node, visited)) {
        return true;
      }
    }
  }
  return false;
}

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
