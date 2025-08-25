import { TSESTree } from '@typescript-eslint/utils';

import {
  createRule,
  extractComponentName,
  isComponentFunction,
  findInterfaceNamesInTypeReference,
  getFullTypeSignature,
} from '../utils';

export const componentPropInterfaceNaming = createRule({
  create(context) {
    function checkComponentPropsInterface(
      componentNode: TSESTree.FunctionDeclaration | TSESTree.VariableDeclarator,
      componentName: string
    ): void {
      // Generate possible valid interface names
      const fullExpectedName = `${componentName}Props`;
      let baseExpectedName = fullExpectedName;

      // If the component name ends with "Component" or "FunctionComponent",
      // also accept interface without those suffixes
      if (componentName.endsWith('Component')) {
        const baseName = componentName.replace(/(?:Function)?Component$/, '');
        baseExpectedName = `${baseName}Props`;
      }

      let actualInterfaceName: string | null = null;

      // Handle function declarations
      if (componentNode.type === 'FunctionDeclaration') {
        const firstParam = componentNode.params[0];
        if (firstParam && firstParam.type === 'ObjectPattern' && firstParam.typeAnnotation) {
          const typeAnnotation = firstParam.typeAnnotation.typeAnnotation;
          if (typeAnnotation.type === 'TSTypeReference') {
            if (typeAnnotation.typeName.type === 'Identifier') {
              actualInterfaceName = typeAnnotation.typeName.name;
            } else if (typeAnnotation.typeName.type === 'TSQualifiedName') {
              // Handle React.ComponentProps<'div'>, etc. - use full signature
              actualInterfaceName = getFullTypeSignature(typeAnnotation);
            }
          }
        }
      }

      // Handle arrow function components
      if (componentNode.type === 'VariableDeclarator' && componentNode.init) {
        let functionNode: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression | null = null;

        // Direct arrow function or function expression
        if (componentNode.init.type === 'ArrowFunctionExpression' || componentNode.init.type === 'FunctionExpression') {
          functionNode = componentNode.init;
        }
        // Arrow function within forwardRef, memo, etc.
        else if (componentNode.init.type === 'CallExpression') {
          // Handle forwardRef, memo, etc.
          if (componentNode.init.arguments.length > 0) {
            let callExpression = componentNode.init;

            // Handle nested calls like memo(forwardRef(...))
            while (callExpression && callExpression.type === 'CallExpression') {
              const firstArg = callExpression.arguments[0];

              if (firstArg.type === 'ArrowFunctionExpression' || firstArg.type === 'FunctionExpression') {
                functionNode = firstArg;
                break;
              } else if (firstArg.type === 'CallExpression') {
                // Continue unwrapping nested calls
                callExpression = firstArg;
              } else {
                break;
              }
            }
          }
        }

        if (functionNode && functionNode.params.length > 0) {
          const firstParam = functionNode.params[0];
          if (firstParam.type === 'ObjectPattern' && firstParam.typeAnnotation) {
            const typeAnnotation = firstParam.typeAnnotation.typeAnnotation;
            if (typeAnnotation.type === 'TSTypeReference') {
              if (typeAnnotation.typeName.type === 'Identifier') {
                actualInterfaceName = typeAnnotation.typeName.name;
              } else if (typeAnnotation.typeName.type === 'TSQualifiedName') {
                // Handle React.ComponentProps<'div'>, etc. - use full signature
                actualInterfaceName = getFullTypeSignature(typeAnnotation);
              }
            }
          }
        }

        // Handle forwardRef with generics (including nested in memo, etc.)
        if (componentNode.init.type === 'CallExpression') {
          let callExpression = componentNode.init;

          // Search for forwardRef in nested calls
          while (callExpression && callExpression.type === 'CallExpression') {
            if (
              callExpression.callee.type === 'Identifier' &&
              callExpression.callee.name === 'forwardRef' &&
              callExpression.typeArguments &&
              callExpression.typeArguments.params.length >= 2
            ) {
              const propsTypeParam = callExpression.typeArguments.params[1];
              if (propsTypeParam.type === 'TSTypeReference') {
                if (propsTypeParam.typeName.type === 'Identifier') {
                  actualInterfaceName = propsTypeParam.typeName.name;
                } else if (propsTypeParam.typeName.type === 'TSQualifiedName') {
                  // Handle React.ComponentProps<'div'>, etc. - use full signature
                  actualInterfaceName = getFullTypeSignature(propsTypeParam);
                }
              }
              break;
            }

            // Continue searching in nested calls
            const firstArg = callExpression.arguments[0];
            if (firstArg && firstArg.type === 'CallExpression') {
              callExpression = firstArg;
            } else {
              break;
            }
          }
        }
      }

      // Handle variable declarator with type annotation (e.g., FunctionComponent<PropsType>)
      if (componentNode.type === 'VariableDeclarator' && componentNode.id.type === 'Identifier') {
        if (
          componentNode.id.typeAnnotation &&
          componentNode.id.typeAnnotation.typeAnnotation.type === 'TSTypeReference'
        ) {
          const typeRef = componentNode.id.typeAnnotation.typeAnnotation;
          if (typeRef.typeArguments && typeRef.typeArguments.params.length > 0) {
            const firstTypeParam = typeRef.typeArguments.params[0];
            if (firstTypeParam.type === 'TSTypeReference') {
              // Find all interface names in the type reference (including nested ones)
              const interfaceNames = findInterfaceNamesInTypeReference(firstTypeParam);

              // Look for an interface name that matches the expected patterns
              for (const name of interfaceNames) {
                if (
                  name.endsWith('Props') ||
                  name.endsWith('Options') ||
                  name.endsWith('Config') ||
                  name.endsWith('Settings')
                ) {
                  actualInterfaceName = name;
                  break;
                }
              }

              // If no props-like interface found, use the first one (for direct references)
              if (!actualInterfaceName) {
                if (firstTypeParam.typeName.type === 'Identifier') {
                  actualInterfaceName = firstTypeParam.typeName.name;
                } else if (firstTypeParam.typeName.type === 'TSQualifiedName') {
                  // Handle React.ComponentProps<'div'>, etc. - use full signature
                  actualInterfaceName = getFullTypeSignature(firstTypeParam);
                }
              }
            }
          }
        }
      }

      // Report error if interface name doesn't match expected pattern
      if (actualInterfaceName && actualInterfaceName !== fullExpectedName && actualInterfaceName !== baseExpectedName) {
        // Always suggest the full component name for consistency in error messages
        const expectedInterfaceName = fullExpectedName;

        context.report({
          data: {
            actual: actualInterfaceName,
            component: componentName,
            expected: expectedInterfaceName,
          },
          messageId: 'incorrectPropsInterfaceName',
          node: componentNode,
        });
      }
    }

    return {
      FunctionDeclaration(node) {
        if (!isComponentFunction(node)) return;

        const componentName = extractComponentName(node);
        if (componentName) {
          checkComponentPropsInterface(node, componentName);
        }
      },

      VariableDeclarator(node) {
        if (!isComponentFunction(node)) return;

        const componentName = extractComponentName(node);
        if (componentName) {
          checkComponentPropsInterface(node, componentName);
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Enforce component prop interfaces follow ComponentNameProps naming convention',
    },
    fixable: undefined,
    messages: {
      incorrectPropsInterfaceName:
        'Component "{{component}}" prop interface should be named "{{expected}}" instead of "{{actual}}"',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'component-prop-interface-naming',
});
