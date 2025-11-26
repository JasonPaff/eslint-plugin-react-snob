import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils';

type MessageIds = 'noReactNamespace' | 'noReactNamespaceType';

export const noReactNamespace = createRule<[], MessageIds>({
  create(context) {
    // Track existing named imports from 'react'
    const existingImports = new Set<string>();
    const existingTypeImports = new Set<string>();
    let reactImportNode: TSESTree.ImportDeclaration | null = null;

    return {
      // Check for existing react imports
      ImportDeclaration(node) {
        if (node.source.value === 'react') {
          reactImportNode = node;
          for (const specifier of node.specifiers) {
            if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
              const importedName =
                specifier.imported.type === AST_NODE_TYPES.Identifier
                  ? specifier.imported.name
                  : specifier.imported.value;
              if (node.importKind === 'type' || specifier.importKind === 'type') {
                existingTypeImports.add(importedName);
              } else {
                existingImports.add(importedName);
              }
            }
          }
        }
      },

      // Detect React.* member access for runtime values (e.g., React.useState, React.useEffect)
      MemberExpression(node) {
        // Check if this is React.something
        if (
          node.object.type === AST_NODE_TYPES.Identifier &&
          node.object.name === 'React' &&
          node.property.type === AST_NODE_TYPES.Identifier
        ) {
          const memberName = node.property.name;

          context.report({
            data: {
              member: memberName,
            },
            fix(fixer) {
              const fixes: ReturnType<typeof fixer.replaceText>[] = [];

              // Replace React.X with just X
              fixes.push(fixer.replaceText(node, memberName));

              // Add import if not already imported
              if (!existingImports.has(memberName)) {
                if (reactImportNode) {
                  // Add to existing import
                  const lastSpecifier = reactImportNode.specifiers[reactImportNode.specifiers.length - 1];
                  if (lastSpecifier) {
                    fixes.push(fixer.insertTextAfter(lastSpecifier, `, ${memberName}`));
                  }
                } else {
                  // Create new import at the top of the file
                  const sourceCode = context.sourceCode;
                  const firstToken = sourceCode.getFirstToken(sourceCode.ast);
                  if (firstToken) {
                    fixes.push(fixer.insertTextBefore(firstToken, `import { ${memberName} } from 'react';\n`));
                  }
                }
                existingImports.add(memberName);
              }

              return fixes;
            },
            messageId: 'noReactNamespace',
            node,
          });
        }
      },

      // Detect React.* type references (e.g., React.FormEvent, React.FC)
      TSQualifiedName(node) {
        // Check if this is React.SomeType
        if (node.left.type === AST_NODE_TYPES.Identifier && node.left.name === 'React') {
          const typeName = node.right.name;

          context.report({
            data: {
              member: typeName,
            },
            fix(fixer) {
              const fixes: ReturnType<typeof fixer.replaceText>[] = [];

              // Replace React.X with just X
              fixes.push(fixer.replaceText(node, typeName));

              // Add type import if not already imported
              if (!existingTypeImports.has(typeName) && !existingImports.has(typeName)) {
                if (reactImportNode) {
                  // Check if there's already a type import we can add to
                  const lastSpecifier = reactImportNode.specifiers[reactImportNode.specifiers.length - 1];
                  if (lastSpecifier) {
                    // Add as type import
                    fixes.push(fixer.insertTextAfter(lastSpecifier, `, type ${typeName}`));
                  }
                } else {
                  // Create new type import at the top of the file
                  const sourceCode = context.sourceCode;
                  const firstToken = sourceCode.getFirstToken(sourceCode.ast);
                  if (firstToken) {
                    fixes.push(fixer.insertTextBefore(firstToken, `import type { ${typeName} } from 'react';\n`));
                  }
                }
                existingTypeImports.add(typeName);
              }

              return fixes;
            },
            messageId: 'noReactNamespaceType',
            node,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow using React.* namespace access and enforce direct named imports from react',
    },
    fixable: 'code',
    messages: {
      noReactNamespace: "Avoid using 'React.{{member}}'. Import '{{member}}' directly from 'react' instead.",
      noReactNamespaceType:
        "Avoid using 'React.{{member}}' type. Import type '{{member}}' directly from 'react' instead.",
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'no-react-namespace',
});
