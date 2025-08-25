import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

/**
 * Checks if a node contains JSX elements
 */
export function containsJSX(node: TSESTree.Node, visited: Set<TSESTree.Node> = new Set()): boolean {
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
        if (
          value.some(
            (item) => item && typeof item === 'object' && 'type' in item && containsJSX(item as TSESTree.Node, visited)
          )
        ) {
          return true;
        }
      } else if ('type' in value && containsJSX(value as TSESTree.Node, visited)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if a property is inside a Zod .omit() or .pick() method call
 */
export function isInZodOmitOrPickMethod(node: TSESTree.Node): boolean {
  let current: TSESTree.Node | null = node;

  // Walk up the AST to find a CallExpression with .omit() or .pick()
  while (current) {
    if (current.type === 'CallExpression') {
      const { callee } = current;
      
      // Check if this is a member expression call like schema.omit() or schema.pick()
      if (callee.type === 'MemberExpression' && 
          callee.property.type === 'Identifier' &&
          (callee.property.name === 'omit' || callee.property.name === 'pick')) {
        return true;
      }
    }
    
    current = current.parent || null;
  }

  return false;
}

/**
 * Checks if a property is inside a constructor call (new Something(...))
 */
export function isInConstructorCall(node: TSESTree.Node): boolean {
  let current: TSESTree.Node | null = node;

  // Walk up the AST to find a NewExpression
  while (current) {
    if (current.type === 'NewExpression') {
      return true;
    }
    
    current = current.parent || null;
  }

  return false;
}