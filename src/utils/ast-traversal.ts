import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

/**
 * Recursively counts logical operators (&&, ||, ??=, ||=, &&=) in an expression
 */
export function countLogicalOperators(node: TSESTree.Expression): number {
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

/**
 * Checks if an expression contains template literals
 */
export function hasTemplateLiteral(node: TSESTree.Expression): boolean {
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

/**
 * Checks if an expression contains logical assignment operators (||=, &&=, ??=)
 */
export function hasLogicalAssignment(node: TSESTree.Expression): boolean {
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

/**
 * Checks if an operand in a logical chain is complex
 */
export function isComplexOperand(node: TSESTree.Expression): boolean {
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
