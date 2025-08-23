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