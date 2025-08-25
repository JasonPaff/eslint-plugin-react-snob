import { TSESTree } from '@typescript-eslint/utils';

/**
 * Extracts the full qualified type name from a TSQualifiedName
 * e.g., React.ComponentProps -> "React.ComponentProps"
 */
export function getQualifiedTypeName(node: TSESTree.TSQualifiedName): string {
  if (node.left.type === 'Identifier') {
    return `${node.left.name}.${node.right.name}`;
  } else if (node.left.type === 'TSQualifiedName') {
    // Handle deeply nested qualified names
    return `${getQualifiedTypeName(node.left)}.${node.right.name}`;
  }
  return node.right.name;
}

/**
 * Extracts the full type signature from a type reference including generics
 * e.g., React.ComponentProps<'div'> -> "React.ComponentProps<'div'>"
 */
export function getFullTypeSignature(node: TSESTree.TSTypeReference): string {
  let baseName = '';

  // Get the base type name
  if (node.typeName.type === 'Identifier') {
    baseName = node.typeName.name;
  } else if (node.typeName.type === 'TSQualifiedName') {
    baseName = getQualifiedTypeName(node.typeName);
  }

  // Add generic parameters if they exist
  if (node.typeArguments && node.typeArguments.params.length > 0) {
    const generics = node.typeArguments.params
      .map((param) => {
        if (param.type === 'TSLiteralType' && param.literal.type === 'Literal') {
          return typeof param.literal.value === 'string' ? `'${param.literal.value}'` : String(param.literal.value);
        } else if (param.type === 'TSTypeReference') {
          return getFullTypeSignature(param);
        }
        // For other complex types, use a simple representation
        return 'T';
      })
      .join(', ');

    return `${baseName}<${generics}>`;
  }

  return baseName;
}

/**
 * Recursively finds all interface names referenced in a TypeScript type reference,
 * including nested type arguments
 */
export function findInterfaceNamesInTypeReference(typeRef: TSESTree.TSTypeReference): string[] {
  const interfaceNames: string[] = [];

  // Check if the main type reference is an identifier or qualified name
  if (typeRef.typeName.type === 'Identifier') {
    interfaceNames.push(typeRef.typeName.name);
  } else if (typeRef.typeName.type === 'TSQualifiedName') {
    // Handle qualified names like React.ComponentProps
    interfaceNames.push(getQualifiedTypeName(typeRef.typeName));
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
