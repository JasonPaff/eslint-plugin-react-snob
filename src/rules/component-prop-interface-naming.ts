import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/jasonpaff/eslint-plugin-react-snob/blob/main/docs/rules/${name}.md`
);

export const componentPropInterfaceNaming = createRule({
  create(context) {
    function extractComponentName(node: TSESTree.Node): string | null {
      if (node.type === 'FunctionDeclaration' && node.id) {
        return node.id.name;
      }

      if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
        return node.id.name;
      }

      return null;
    }

    function isComponentFunction(node: TSESTree.Node): boolean {
      if (node.type === 'FunctionDeclaration' && node.id) {
        return /^[A-Z]/.test(node.id.name);
      }

      if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && /^[A-Z]/.test(node.id.name)) {
        return true;
      }

      return false;
    }

    function checkComponentPropsInterface(
      componentNode: TSESTree.FunctionDeclaration | TSESTree.VariableDeclarator,
      componentName: string
    ): void {
      // Generate possible valid interface names
      const fullExpectedName = `${componentName}Props`;
      let baseExpectedName = fullExpectedName;
      
      // If component name ends with "Component" or "FunctionComponent", 
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
          if (typeAnnotation.type === 'TSTypeReference' && typeAnnotation.typeName.type === 'Identifier') {
            actualInterfaceName = typeAnnotation.typeName.name;
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
        // Arrow function within forwardRef
        else if (componentNode.init.type === 'CallExpression') {
          // Handle forwardRef, memo, etc.
          if (componentNode.init.arguments.length > 0) {
            const firstArg = componentNode.init.arguments[0];
            if (firstArg.type === 'ArrowFunctionExpression' || firstArg.type === 'FunctionExpression') {
              functionNode = firstArg;
            }
          }
        }

        if (functionNode && functionNode.params.length > 0) {
          const firstParam = functionNode.params[0];
          if (firstParam.type === 'ObjectPattern' && firstParam.typeAnnotation) {
            const typeAnnotation = firstParam.typeAnnotation.typeAnnotation;
            if (typeAnnotation.type === 'TSTypeReference' && typeAnnotation.typeName.type === 'Identifier') {
              actualInterfaceName = typeAnnotation.typeName.name;
            }
          }
        }

        // Handle forwardRef with generics
        if (
          componentNode.init.type === 'CallExpression' &&
          componentNode.init.callee.type === 'Identifier' &&
          componentNode.init.callee.name === 'forwardRef' &&
          componentNode.init.typeArguments &&
          componentNode.init.typeArguments.params.length >= 2
        ) {
          const propsTypeParam = componentNode.init.typeArguments.params[1];
          if (propsTypeParam.type === 'TSTypeReference' && propsTypeParam.typeName.type === 'Identifier') {
            actualInterfaceName = propsTypeParam.typeName.name;
          }
        }
      }

      // Handle variable declarator with type annotation (e.g., FunctionComponent<PropsType>)
      if (componentNode.type === 'VariableDeclarator' && componentNode.id.type === 'Identifier') {
        if (componentNode.id.typeAnnotation && componentNode.id.typeAnnotation.typeAnnotation.type === 'TSTypeReference') {
          const typeRef = componentNode.id.typeAnnotation.typeAnnotation;
          if (typeRef.typeArguments && typeRef.typeArguments.params.length > 0) {
            const firstTypeParam = typeRef.typeArguments.params[0];
            if (firstTypeParam.type === 'TSTypeReference' && firstTypeParam.typeName.type === 'Identifier') {
              actualInterfaceName = firstTypeParam.typeName.name;
            }
          }
        }
      }

      // Report error if interface name doesn't match expected pattern
      if (actualInterfaceName && 
          actualInterfaceName !== fullExpectedName && 
          actualInterfaceName !== baseExpectedName) {
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
