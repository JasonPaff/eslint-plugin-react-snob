import type { TSESLint } from '@typescript-eslint/utils';

import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils';

type SourceCode = TSESLint.SourceCode;

/**
 * Converts a TypeScript type node to its string representation,
 * recursively converting nested array types to Array<T> syntax
 */
function typeToString(node: TSESTree.TypeNode, sourceCode: SourceCode): string {
  // If this is an array type, recursively convert it
  if (node.type === AST_NODE_TYPES.TSArrayType) {
    return convertToArrayGeneric(node.elementType, sourceCode);
  }
  // For all other types, get the original source text
  return sourceCode.getText(node);
}

/**
 * Converts bracket array syntax to generic Array syntax
 */
function convertToArrayGeneric(elementType: TSESTree.TypeNode, sourceCode: SourceCode): string {
  const elementTypeStr = typeToString(elementType, sourceCode);
  return `Array<${elementTypeStr}>`;
}

export const noBracketArrayType = createRule({
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      TSArrayType(node) {
        // Only report the outermost array type to avoid conflicts
        // If the parent is also a TSArrayType, let the parent handle the fix
        if (node.parent && node.parent.type === AST_NODE_TYPES.TSArrayType) {
          return;
        }

        context.report({
          fix(fixer) {
            const replacement = convertToArrayGeneric(node.elementType, sourceCode);
            return fixer.replaceText(node, replacement);
          },
          messageId: 'useBracketArrayType',
          node,
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Enforce Array<T> syntax over T[] for array types',
    },
    fixable: 'code',
    messages: {
      useBracketArrayType: 'Use Array<T> syntax instead of T[] for array types',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'no-bracket-array-type',
});
