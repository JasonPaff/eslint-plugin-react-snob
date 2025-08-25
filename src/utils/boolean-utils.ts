import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

/**
 * Checks if a type annotation is boolean or includes boolean
 */
export function isBooleanType(typeAnnotation: TSESTree.TSTypeAnnotation | undefined): boolean {
  if (!typeAnnotation) return false;

  const type = typeAnnotation.typeAnnotation;

  if (type.type === 'TSBooleanKeyword') {
    return true;
  }

  if (type.type === 'TSUnionType') {
    return type.types.some((unionType) => unionType.type === 'TSBooleanKeyword');
  }

  return false;
}

/**
 * Checks if a literal value is boolean
 */
export function isBooleanLiteral(node: TSESTree.Expression | null | undefined): boolean {
  return node?.type === 'Literal' && typeof node.value === 'boolean';
}

/**
 * Checks if an expression is likely to return a boolean value
 */
export function isBooleanExpression(node: TSESTree.Expression): boolean {
  switch (node.type) {
    case 'Literal':
      return typeof node.value === 'boolean';

    case 'UnaryExpression':
      return node.operator === '!';

    case 'BinaryExpression':
      return ['==', '===', '!=', '!==', '<', '>', '<=', '>='].includes(node.operator);

    case 'LogicalExpression':
      // Only && and || return boolean-like values, ?? returns the right operand's value
      if (node.operator === '??') {
        return false; // Nullish coalescing doesn't necessarily return boolean
      }
      return true; // && and || result in boolean-like values

    case 'ConditionalExpression':
      return isBooleanExpression(node.consequent) || isBooleanExpression(node.alternate);

    default:
      return false;
  }
}

/**
 * Checks if an expression is likely to produce a boolean value
 */
export function isLikelyBooleanExpression(node: TSESTree.Expression): boolean {
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
export function isDerivedBooleanExpression(node: TSESTree.Expression): boolean {
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
 * Checks if a CallExpression is a useState call with a boolean initial value
 */
export function isUseStateWithBoolean(node: TSESTree.CallExpression): boolean {
  if (node.callee.type !== 'Identifier' || node.callee.name !== 'useState') {
    return false;
  }

  if (node.arguments.length === 0) return false;

  const firstArg = node.arguments[0];
  if (firstArg.type === 'SpreadElement') return false;

  return isBooleanLiteral(firstArg) || isBooleanExpression(firstArg);
}
