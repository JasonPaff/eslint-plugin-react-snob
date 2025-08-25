import { TSESTree } from '@typescript-eslint/utils';

import {
  createRule,
  suggestPrefixedName,
  hasAnyValidPrefix,
  isBooleanType,
  isBooleanLiteral,
  isBooleanExpression,
  isUseStateWithBoolean,
  isInZodOmitOrPickMethod,
  isInConstructorCall,
} from '../utils';

// Use shared naming utilities from utils

// Use shared boolean type utilities from utils

// Use shared context detection utilities from utils

// Use shared useState detection utility from utils

type Options = [
  {
    allowedPrefixes?: string[];
  },
];

export const requireBooleanPrefixIs = createRule<Options, 'booleanShouldStartWithPrefix'>({
  create(context, [options = {}]) {
    const { allowedPrefixes = ['is'] } = options;

    /**
     * Reports an error for a boolean identifier that doesn't start with an allowed prefix
     */
    function reportBooleanNaming(node: TSESTree.Node, name: string): void {
      if (hasAnyValidPrefix(name, allowedPrefixes)) return;

      const suggested = suggestPrefixedName(name, allowedPrefixes);
      const prefixList =
        allowedPrefixes.length === 1
          ? `"${allowedPrefixes[0]}"`
          : allowedPrefixes
              .slice(0, -1)
              .map((p) => `"${p}"`)
              .join(', ') + `, or "${allowedPrefixes[allowedPrefixes.length - 1]}"`;

      context.report({
        data: {
          name,
          prefixes: prefixList,
          suggested,
        },
        messageId: 'booleanShouldStartWithPrefix',
        node,
      });
    }

    return {
      // Regular arrow function parameters (non-component context)
      'ArrowFunctionExpression > :matches(Identifier[typeAnnotation], ObjectPattern)'(
        node: TSESTree.Identifier | TSESTree.ObjectPattern
      ) {
        // Skip if this is already handled by the component-specific rule above
        let parent: TSESTree.Node | null = node.parent;
        while (parent) {
          if (
            parent.type === 'VariableDeclarator' &&
            parent.id.type === 'Identifier' &&
            /^[A-Z]/.test(parent.id.name)
          ) {
            return; // This is handled by the component-specific rule
          }
          parent = parent.parent || null;
        }

        if (node.type === 'ObjectPattern') {
          // Handle object pattern destructuring in arrow function parameters
          if (node.typeAnnotation && node.typeAnnotation.typeAnnotation.type === 'TSTypeLiteral') {
            const typeMembers = node.typeAnnotation.typeAnnotation.members;

            node.properties.forEach((prop) => {
              if (prop.type === 'Property' && prop.key.type === 'Identifier' && prop.value.type === 'Identifier') {
                const propName = prop.key.name;

                // Find the corresponding type member
                const typeMember = typeMembers.find(
                  (member) =>
                    member.type === 'TSPropertySignature' &&
                    member.key.type === 'Identifier' &&
                    member.key.name === propName
                );

                if (
                  typeMember &&
                  'typeAnnotation' in typeMember &&
                  typeMember.typeAnnotation &&
                  isBooleanType(typeMember.typeAnnotation)
                ) {
                  reportBooleanNaming(prop.value, prop.value.name);
                }
              }
            });
          }
        }

        if (node.type === 'Identifier' && node.typeAnnotation && isBooleanType(node.typeAnnotation)) {
          reportBooleanNaming(node, node.name);
        }
      },

      // forwardRef callback function parameters - identifier params
      'CallExpression[callee.name="forwardRef"] > ArrowFunctionExpression > Identifier[typeAnnotation]'(
        node: TSESTree.Identifier
      ) {
        if (node.typeAnnotation && isBooleanType(node.typeAnnotation)) {
          reportBooleanNaming(node, node.name);
        }
      },

      // forwardRef callback function parameters
      'CallExpression[callee.name="forwardRef"] > ArrowFunctionExpression > ObjectPattern'(
        node: TSESTree.ObjectPattern
      ) {
        // Find the forwardRef call expression to get the generic type information
        let forwardRefCall: TSESTree.CallExpression | null = null;
        let parent: TSESTree.Node | null = node.parent;
        while (parent) {
          if (
            parent.type === 'CallExpression' &&
            parent.callee.type === 'Identifier' &&
            parent.callee.name === 'forwardRef'
          ) {
            forwardRefCall = parent;
            break;
          }
          parent = parent.parent || null;
        }

        if (forwardRefCall && forwardRefCall.typeArguments && forwardRefCall.typeArguments.params.length >= 2) {
          // Get the props type parameter (second generic argument)
          const propsTypeParam = forwardRefCall.typeArguments.params[1];

          if (propsTypeParam.type === 'TSTypeReference' && propsTypeParam.typeName.type === 'Identifier') {
            // For each destructured property, report if it should have "is" prefix
            node.properties.forEach((prop) => {
              if (prop.type === 'Property' && prop.key.type === 'Identifier' && prop.value.type === 'Identifier') {
                const paramName = prop.value.name;

                // We need to assume boolean properties based on common naming patterns
                // This is a simplified approach since we can't easily access the interface definition here
                // For now, just report all destructured parameters
                reportBooleanNaming(prop.value, paramName);
              }
            });
          }
        } else {
          // Fallback: Handle explicit type annotations on object pattern
          if (node.typeAnnotation && node.typeAnnotation.typeAnnotation.type === 'TSTypeLiteral') {
            const typeMembers = node.typeAnnotation.typeAnnotation.members;

            node.properties.forEach((prop) => {
              if (prop.type === 'Property' && prop.key.type === 'Identifier' && prop.value.type === 'Identifier') {
                const propName = prop.key.name;

                // Find the corresponding type member
                const typeMember = typeMembers.find(
                  (member) =>
                    member.type === 'TSPropertySignature' &&
                    member.key.type === 'Identifier' &&
                    member.key.name === propName
                );

                if (
                  typeMember &&
                  'typeAnnotation' in typeMember &&
                  typeMember.typeAnnotation &&
                  isBooleanType(typeMember.typeAnnotation)
                ) {
                  reportBooleanNaming(prop.value, prop.value.name);
                }
              }
            });
          }
        }
      },

      // Function parameters - only apply to React components
      'FunctionDeclaration[id.name=/^[A-Z]/] > :matches(Identifier[typeAnnotation], ObjectPattern)'(
        node: TSESTree.Identifier | TSESTree.ObjectPattern
      ) {
        if (node.type === 'ObjectPattern') {
          // Handle object pattern destructuring in function parameters
          if (node.typeAnnotation && node.typeAnnotation.typeAnnotation.type === 'TSTypeLiteral') {
            const typeMembers = node.typeAnnotation.typeAnnotation.members;

            node.properties.forEach((prop) => {
              if (prop.type === 'Property' && prop.key.type === 'Identifier' && prop.value.type === 'Identifier') {
                const propName = prop.key.name;

                // Find the corresponding type member
                const typeMember = typeMembers.find(
                  (member) =>
                    member.type === 'TSPropertySignature' &&
                    member.key.type === 'Identifier' &&
                    member.key.name === propName
                );

                if (
                  typeMember &&
                  'typeAnnotation' in typeMember &&
                  typeMember.typeAnnotation &&
                  isBooleanType(typeMember.typeAnnotation)
                ) {
                  reportBooleanNaming(prop.value, prop.value.name);
                }
              }
            });
          }
        }

        // Handle simple identifiers with type annotations
        if (node.type === 'Identifier' && node.typeAnnotation && isBooleanType(node.typeAnnotation)) {
          reportBooleanNaming(node, node.name);
        }
      },

      // Object properties with boolean values
      Property(node) {
        if (node.key.type !== 'Identifier') return;

        const name = node.key.name;

        // Skip if this property is inside a Zod .omit() or .pick() method
        if (isInZodOmitOrPickMethod(node)) {
          return;
        }

        // Skip if this property is inside a constructor call (new Something(...))
        if (isInConstructorCall(node)) {
          return;
        }

        // Check if value is boolean
        if (
          node.value &&
          node.value.type !== 'AssignmentPattern' &&
          'type' in node.value &&
          (isBooleanLiteral(node.value as TSESTree.Expression) ||
            (node.value.type !== 'Identifier' &&
              node.value.type !== 'TSEmptyBodyFunctionExpression' &&
              isBooleanExpression(node.value as TSESTree.Expression)))
        ) {
          reportBooleanNaming(node, name);
        }
      },

      // Class property definitions with boolean values or types
      PropertyDefinition(node) {
        if (node.key.type !== 'Identifier') return;

        const name = node.key.name;

        // Check type annotation
        if (node.typeAnnotation && isBooleanType(node.typeAnnotation)) {
          reportBooleanNaming(node, name);
          return;
        }

        // Check value
        if (node.value && (isBooleanLiteral(node.value) || isBooleanExpression(node.value))) {
          reportBooleanNaming(node, name);
        }
      },

      // Interface property signatures
      TSPropertySignature(node) {
        if (node.key.type !== 'Identifier') return;

        const name = node.key.name;

        if (node.typeAnnotation && isBooleanType(node.typeAnnotation)) {
          reportBooleanNaming(node, name);
        }
      },

      // Variable declarations (const, let, var)
      VariableDeclarator(node) {
        // Handle array destructuring (useState)
        if (
          node.id.type === 'ArrayPattern' &&
          node.init &&
          node.init.type === 'CallExpression' &&
          isUseStateWithBoolean(node.init)
        ) {
          if (node.id.elements.length > 0) {
            const stateVar = node.id.elements[0];
            if (stateVar && stateVar.type === 'Identifier') {
              reportBooleanNaming(stateVar, stateVar.name);
            }
          }
          return;
        }

        // Handle simple identifiers
        if (node.id.type !== 'Identifier') return;

        const name = node.id.name;

        // Check if it has boolean type annotation
        if (node.id.typeAnnotation && isBooleanType(node.id.typeAnnotation)) {
          reportBooleanNaming(node, name);
          return;
        }

        // Check if initialized with boolean value
        if (node.init && (isBooleanLiteral(node.init) || isBooleanExpression(node.init))) {
          reportBooleanNaming(node, name);
          return;
        }
      },

      // Arrow function parameters - only for components
      'VariableDeclarator[id.name=/^[A-Z]/] ArrowFunctionExpression > :matches(Identifier[typeAnnotation], ObjectPattern)'(
        node: TSESTree.Identifier | TSESTree.ObjectPattern
      ) {
        if (node.type === 'ObjectPattern') {
          // Handle object pattern destructuring in arrow function parameters
          if (node.typeAnnotation && node.typeAnnotation.typeAnnotation.type === 'TSTypeLiteral') {
            const typeMembers = node.typeAnnotation.typeAnnotation.members;

            node.properties.forEach((prop) => {
              if (prop.type === 'Property' && prop.key.type === 'Identifier' && prop.value.type === 'Identifier') {
                const propName = prop.key.name;

                // Find the corresponding type member
                const typeMember = typeMembers.find(
                  (member) =>
                    member.type === 'TSPropertySignature' &&
                    member.key.type === 'Identifier' &&
                    member.key.name === propName
                );

                if (
                  typeMember &&
                  'typeAnnotation' in typeMember &&
                  typeMember.typeAnnotation &&
                  isBooleanType(typeMember.typeAnnotation)
                ) {
                  reportBooleanNaming(prop.value, prop.value.name);
                }
              }
            });
          }
        }

        if (node.type === 'Identifier' && node.typeAnnotation && isBooleanType(node.typeAnnotation)) {
          reportBooleanNaming(node, node.name);
        }
      },
    };
  },
  defaultOptions: [{}],
  meta: {
    docs: {
      description: 'Enforce boolean variables, state, and props to start with allowed prefix',
    },
    fixable: undefined,
    messages: {
      booleanShouldStartWithPrefix:
        'Boolean identifier "{{name}}" should start with {{prefixes}} prefix. Consider using "{{suggested}}" instead.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowedPrefixes: {
            items: {
              minLength: 1,
              type: 'string',
            },
            minItems: 1,
            type: 'array',
            uniqueItems: true,
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'require-boolean-prefix-is',
});
