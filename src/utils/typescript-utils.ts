import { TSESTree } from '@typescript-eslint/utils';

/**
 * Recursively finds all interface names referenced in a TypeScript type reference,
 * including nested type arguments
 */
export function findInterfaceNamesInTypeReference(typeRef: TSESTree.TSTypeReference): string[] {
  const interfaceNames: string[] = [];

  // Check if the main type reference is an identifier
  if (typeRef.typeName.type === 'Identifier') {
    interfaceNames.push(typeRef.typeName.name);
  }

  // Recursively check type arguments
  if (typeRef.typeArguments && typeRef.typeArguments.params.length > 0) {
    for (const param of typeRef.typeArguments.params) {
      if (param.type === 'TSTypeReference') {
        interfaceNames.push(...findInterfaceNamesInTypeReference(param));
      }
    }
  }

  return interfaceNames;
}
