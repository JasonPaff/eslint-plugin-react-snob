import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/jasonpaff/eslint-plugin-react-snob/blob/main/docs/rules/${name}.md`
);

function countLogicalOperators(node: TSESTree.Expression): number {
  let count = 0;

  function traverse(expr: TSESTree.Expression) {
    if (expr.type === AST_NODE_TYPES.LogicalExpression) {
      count++;
      traverse(expr.left);
      traverse(expr.right);
    } else if (
      expr.type === AST_NODE_TYPES.AssignmentExpression &&
      expr.operator.endsWith('=') &&
      expr.operator !== '='
    ) {
      // Count logical assignment operators (||=, &&=)
      count++;
      traverse(expr.left);
      traverse(expr.right);
    } else if (expr.type === AST_NODE_TYPES.ConditionalExpression) {
      // Count ternary as complex if test has logical operators
      traverse(expr.test);
      traverse(expr.consequent);
      traverse(expr.alternate);
    } else if (expr.type === AST_NODE_TYPES.BinaryExpression) {
      traverse(expr.left as TSESTree.Expression);
      traverse(expr.right as TSESTree.Expression);
    } else if (expr.type === AST_NODE_TYPES.UnaryExpression) {
      traverse(expr.argument);
    } else if (expr.type === AST_NODE_TYPES.MemberExpression) {
      if (expr.object) traverse(expr.object as TSESTree.Expression);
      if (expr.property && expr.computed) {
        traverse(expr.property as TSESTree.Expression);
      }
    } else if (expr.type === AST_NODE_TYPES.CallExpression) {
      expr.arguments.forEach((arg) => {
        if (arg.type !== AST_NODE_TYPES.SpreadElement) {
          traverse(arg as TSESTree.Expression);
        }
      });
    }
  }

  traverse(node);
  return count;
}

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

function hasTemplateLiteral(node: TSESTree.Expression): boolean {
  function traverse(expr: TSESTree.Expression): boolean {
    if (expr.type === AST_NODE_TYPES.TemplateLiteral) {
      return true;
    }
    if (expr.type === AST_NODE_TYPES.LogicalExpression) {
      return traverse(expr.left) || traverse(expr.right);
    }
    if (expr.type === AST_NODE_TYPES.UnaryExpression) {
      return traverse(expr.argument);
    }
    if (expr.type === AST_NODE_TYPES.BinaryExpression) {
      return traverse(expr.left as TSESTree.Expression) || traverse(expr.right as TSESTree.Expression);
    }
    if (expr.type === AST_NODE_TYPES.ConditionalExpression) {
      return traverse(expr.test) || traverse(expr.consequent) || traverse(expr.alternate);
    }
    if (expr.type === AST_NODE_TYPES.MemberExpression) {
      return (
        traverse(expr.object as TSESTree.Expression) ||
        (expr.computed && expr.property ? traverse(expr.property as TSESTree.Expression) : false)
      );
    }
    if (expr.type === AST_NODE_TYPES.CallExpression) {
      return expr.arguments.some(
        (arg) => arg.type !== AST_NODE_TYPES.SpreadElement && traverse(arg as TSESTree.Expression)
      );
    }
    return false;
  }
  return traverse(node);
}

function hasLogicalAssignment(node: TSESTree.Expression): boolean {
  function traverse(expr: TSESTree.Expression): boolean {
    if (
      expr.type === AST_NODE_TYPES.AssignmentExpression &&
      (expr.operator === '||=' || expr.operator === '&&=' || expr.operator === '??=')
    ) {
      return true;
    }
    if (expr.type === AST_NODE_TYPES.LogicalExpression) {
      return traverse(expr.left) || traverse(expr.right);
    }
    return false;
  }
  return traverse(node);
}

function isComplexOperand(node: TSESTree.Expression): boolean {
  // Complex operands include:
  // - Chained property access (a.b.c)
  // - Function calls with arguments
  // - Binary expressions with multiple operations
  // - Nested logical expressions

  if (node.type === AST_NODE_TYPES.MemberExpression) {
    // Count chained property access depth
    let depth = 0;
    let current = node;
    while (current.type === AST_NODE_TYPES.MemberExpression) {
      depth++;
      current = current.object as TSESTree.MemberExpression;
    }
    return depth > 1; // a.b.c is complex (depth = 3)
  }

  if (node.type === AST_NODE_TYPES.CallExpression) {
    return node.arguments.length > 0; // Function calls with args are more complex
  }

  if (node.type === AST_NODE_TYPES.BinaryExpression) {
    return true; // Any binary comparison adds complexity
  }

  if (node.type === AST_NODE_TYPES.LogicalExpression) {
    return true; // Nested logical expressions are complex
  }

  return false;
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
