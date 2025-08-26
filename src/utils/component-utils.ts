import { TSESTree } from '@typescript-eslint/utils';

/**
 * Extracts the component name from a function declaration or variable declarator node
 */
export function extractComponentName(node: TSESTree.Node): string | null {
  if (node.type === 'FunctionDeclaration' && node.id) {
    return node.id.name;
  }

  if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
    return node.id.name;
  }

  return null;
}

/**
 * Determines if a function node represents a React component based on naming convention
 */
export function isComponentFunction(node: TSESTree.Node): boolean {
  if (node.type === 'FunctionDeclaration' && node.id) {
    return /^[A-Z]/.test(node.id.name);
  }

  if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && /^[A-Z]/.test(node.id.name)) {
    return true;
  }

  return false;
}

/**
 * Determines if a function node represents a React hook based on naming convention
 */
export function isHookFunction(node: TSESTree.Node): boolean {
  if (node.type === 'FunctionDeclaration' && node.id) {
    return /^use[A-Z]/.test(node.id.name);
  }

  if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && /^use[A-Z]/.test(node.id.name)) {
    return true;
  }

  return false;
}

/**
 * Checks if a node is within a React component or custom hook function scope
 */
export function isInComponentOrHookScope(node: TSESTree.Node): boolean {
  let current: TSESTree.Node | undefined = node.parent;

  while (current) {
    // Check for function declarations
    if (current.type === 'FunctionDeclaration' && current.id) {
      const name = current.id.name;
      return /^[A-Z]/.test(name) || /^use[A-Z]/.test(name);
    }

    // Check for arrow functions assigned to variables
    if (
      current.type === 'VariableDeclarator' &&
      current.id.type === 'Identifier' &&
      current.init?.type === 'ArrowFunctionExpression'
    ) {
      const name = current.id.name;
      return /^[A-Z]/.test(name) || /^use[A-Z]/.test(name);
    }

    // Check for forwardRef calls
    if (
      current.type === 'CallExpression' &&
      current.callee.type === 'Identifier' &&
      current.callee.name === 'forwardRef'
    ) {
      return true;
    }

    current = current.parent || undefined;
  }

  return false;
}

/**
 * Checks if a function parameter belongs to a React component or hook
 */
export function isComponentOrHookParameter(node: TSESTree.Node): boolean {
  let current: TSESTree.Node | undefined = node.parent;

  while (current) {
    // Check if we're in the parameters of a function
    if (current.type === 'FunctionDeclaration' && current.id) {
      const name = current.id.name;
      return /^[A-Z]/.test(name) || /^use[A-Z]/.test(name);
    }

    // Check for arrow functions assigned to variables
    if (current.type === 'ArrowFunctionExpression') {
      const parent = current.parent;
      if (parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
        const name = parent.id.name;
        return /^[A-Z]/.test(name) || /^use[A-Z]/.test(name);
      }
    }

    // Check for forwardRef callback parameters
    if (
      current.type === 'ArrowFunctionExpression' &&
      current.parent?.type === 'CallExpression' &&
      current.parent.callee.type === 'Identifier' &&
      current.parent.callee.name === 'forwardRef'
    ) {
      return true;
    }

    current = current.parent || undefined;
  }

  return false;
}
