import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { createRule, countLogicalOperators, hasTemplateLiteral, hasLogicalAssignment, isComplexOperand } from '../utils';


function hasComplexTernaryCondition(node: TSESTree.ConditionalExpression): boolean {
  // Check if test condition has logical operators
  const testLogicalCount = countLogicalOperators(node.test);

  // Also check if consequent or alternate are complex ternaries
  let consequentComplex = false;
  let alternateComplex = false;

  if (node.consequent.type === AST_NODE_TYPES.ConditionalExpression) {
    consequentComplex = hasComplexTernaryCondition(node.consequent);
  }

  if (node.alternate.type === AST_NODE_TYPES.ConditionalExpression) {
    alternateComplex = hasComplexTernaryCondition(node.alternate);
  }

  return testLogicalCount > 0 || consequentComplex || alternateComplex;
}

function isComplexCondition(node: TSESTree.Expression): boolean {
  // Count logical operators (&&, ||)
  const logicalCount = countLogicalOperators(node);

  // Consider complex if more than 2 logical operators (allows simple a && b && c)
  if (logicalCount > 2) {
    return true;
  }

  // Check for complex ternary conditions
  if (node.type === AST_NODE_TYPES.ConditionalExpression) {
    return hasComplexTernaryCondition(node);
  }

  // For 2 or 3 logical operators, check if operands are complex
  if (node.type === AST_NODE_TYPES.LogicalExpression && logicalCount >= 2) {
    return hasComplexOperandsInChain(node);
  }

  // Check for template literals combined with logical operators (even single logical operator makes it complex)
  if (logicalCount >= 1 && hasTemplateLiteral(node)) {
    return true;
  }

  // Check for logical assignment operators
  if (hasLogicalAssignment(node)) {
    return true;
  }

  return false;
}

function hasComplexOperandsInChain(node: TSESTree.LogicalExpression): boolean {
  // Check if the logical chain contains complex operands
  function checkOperand(operand: TSESTree.Expression): boolean {
    return isComplexOperand(operand);
  }

  function traverseLogical(expr: TSESTree.Expression): boolean {
    if (expr.type === AST_NODE_TYPES.LogicalExpression) {
      return traverseLogical(expr.left) || traverseLogical(expr.right);
    }
    return checkOperand(expr);
  }

  return traverseLogical(node);
}




export const noComplexJsxConditions = createRule({
  create(context) {
    const checkedNodes = new Set<TSESTree.JSXExpressionContainer>();

    function checkExpression(node: TSESTree.JSXExpressionContainer) {
      if (checkedNodes.has(node)) {
        return;
      }
      checkedNodes.add(node);

      if (node.expression.type === AST_NODE_TYPES.JSXEmptyExpression) {
        return;
      }

      if (isComplexCondition(node.expression)) {
        context.report({
          messageId: 'complexCondition',
          node: node,
        });
      }
    }

    return {
      JSXAttribute(node) {
        if (node.value && node.value.type === AST_NODE_TYPES.JSXExpressionContainer) {
          checkExpression(node.value);
        }
      },
      JSXExpressionContainer(node) {
        checkExpression(node);
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow complex boolean conditions in JSX expressions and component props',
    },
    fixable: undefined,
    messages: {
      complexCondition:
        'Complex boolean condition found in JSX. Extract to a descriptive variable (e.g., _isReady, _canEdit) to improve readability.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'no-complex-jsx-conditions',
});
