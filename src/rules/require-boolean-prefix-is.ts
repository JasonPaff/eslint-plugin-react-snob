import { TSESTree } from '@typescript-eslint/utils';

import {
  createRule,
  isBooleanType,
  isBooleanLiteral,
  isLikelyBooleanExpression,
  isUseStateWithBoolean,
  isComponentOrHookParameter,
  isInZodOmitOrPickMethod,
  isInConstructorCall,
  suggestPrefixedName,
  hasAnyValidPrefix,
} from '../utils';

export interface RuleOptions {
  allowedPrefixes: string[];
}

const DEFAULT_OPTIONS: RuleOptions = {
  allowedPrefixes: ['is'],
};

export const requireBooleanPrefixIs = createRule<[RuleOptions], 'booleanShouldStartWithPrefix'>({
  create(context, [options = DEFAULT_OPTIONS]) {
    const { allowedPrefixes } = options;

    function formatPrefixes(prefixes: string[]): string {
      if (prefixes.length === 1) {
        return `"${prefixes[0]}"`;
      }
      if (prefixes.length === 2) {
        return `"${prefixes[0]}", or "${prefixes[1]}"`;
      }
      const lastPrefix = prefixes[prefixes.length - 1];
      const otherPrefixes = prefixes.slice(0, -1);
      return `${otherPrefixes.map((p) => `"${p}"`).join(', ')}, or "${lastPrefix}"`;
    }

    function reportBooleanPrefixError(node: TSESTree.Node, name: string): void {
      const suggested = suggestPrefixedName(name, allowedPrefixes);
      const prefixes = formatPrefixes(allowedPrefixes);

      context.report({
        data: {
          name,
          prefixes,
          suggested,
        },
        messageId: 'booleanShouldStartWithPrefix',
        node,
      });
    }

    function checkBooleanVariable(node: TSESTree.VariableDeclarator | TSESTree.AssignmentPattern, name: string): void {
      if (hasAnyValidPrefix(name, allowedPrefixes)) return;

      // Check if it's in a context we should ignore
      if (isInZodOmitOrPickMethod(node) || isInConstructorCall(node)) return;

      // Check for boolean literal values
      if (node.type === 'VariableDeclarator' && node.init && isBooleanLiteral(node.init)) {
        reportBooleanPrefixError(node, name);
        return;
      }
      if (node.type === 'AssignmentPattern' && isBooleanLiteral(node.right)) {
        reportBooleanPrefixError(node, name);
        return;
      }

      // Check for boolean type annotation
      if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
        if (node.id.typeAnnotation && isBooleanType(node.id.typeAnnotation)) {
          reportBooleanPrefixError(node, name);
          return;
        }
      }

      // Check for boolean expressions (not nullish coalescing with non-boolean)
      if (node.type === 'VariableDeclarator' && node.init && isLikelyBooleanExpression(node.init)) {
        // Skip nullish coalescing unless both operands are boolean
        if (node.init.type === 'LogicalExpression' && node.init.operator === '??') {
          if (isBooleanLiteral(node.init.left) || isBooleanLiteral(node.init.right)) {
            reportBooleanPrefixError(node, name);
          }
        } else {
          reportBooleanPrefixError(node, name);
        }
      }
      if (node.type === 'AssignmentPattern' && isLikelyBooleanExpression(node.right)) {
        // Skip nullish coalescing unless both operands are boolean
        if (node.right.type === 'LogicalExpression' && node.right.operator === '??') {
          if (isBooleanLiteral(node.right.left) || isBooleanLiteral(node.right.right)) {
            reportBooleanPrefixError(node, name);
          }
        } else {
          reportBooleanPrefixError(node, name);
        }
      }
    }

    function checkArrayPattern(node: TSESTree.ArrayPattern): void {
      // Check useState destructuring
      const parent = node.parent;
      if (
        parent?.type === 'VariableDeclarator' &&
        parent.init?.type === 'CallExpression' &&
        isUseStateWithBoolean(parent.init) &&
        node.elements.length > 0 &&
        node.elements[0]?.type === 'Identifier'
      ) {
        const stateVarName = node.elements[0].name;
        if (!hasAnyValidPrefix(stateVarName, allowedPrefixes)) {
          reportBooleanPrefixError(node.elements[0], stateVarName);
        }
      }
    }

    function checkObjectProperty(node: TSESTree.Property): void {
      if (
        node.key.type === 'Identifier' &&
        !node.computed &&
        node.value &&
        !hasAnyValidPrefix(node.key.name, allowedPrefixes)
      ) {
        // Skip if in Zod omit/pick or constructor calls
        if (isInZodOmitOrPickMethod(node) || isInConstructorCall(node)) return;

        // Skip if this is a function call argument
        let current: TSESTree.Node | undefined = node.parent;
        while (current) {
          if (current.type === 'CallExpression') {
            return; // Skip function call arguments
          }
          if (current.type === 'VariableDeclarator' || current.type === 'AssignmentExpression') {
            break; // This is a variable assignment, proceed with checks
          }
          current = current.parent || undefined;
        }

        // Type guard to check if value is an Expression
        const isExpression = (val: unknown): val is TSESTree.Expression => {
          return (
            val !== null &&
            val !== undefined &&
            // @ts-expect-error ignore
            val.type !== 'AssignmentPattern' &&
            // @ts-expect-error ignore
            val.type !== 'TSEmptyBodyFunctionExpression'
          );
        };

        // Check for boolean literal values
        if (isExpression(node.value) && isBooleanLiteral(node.value)) {
          reportBooleanPrefixError(node.key, node.key.name);
          return;
        }

        // Check for boolean expressions
        if (isExpression(node.value) && isLikelyBooleanExpression(node.value)) {
          reportBooleanPrefixError(node.key, node.key.name);
        }
      }
    }

    function checkParameter(node: TSESTree.Parameter): void {
      if (node.type === 'Identifier' && !hasAnyValidPrefix(node.name, allowedPrefixes)) {
        // Only check parameters in React components or hooks
        if (!isComponentOrHookParameter(node)) return;

        // Check type annotation
        if (node.typeAnnotation && isBooleanType(node.typeAnnotation)) {
          reportBooleanPrefixError(node, node.name);
        }
      } else if (node.type === 'AssignmentPattern' && node.left.type === 'Identifier') {
        const name = node.left.name;
        if (!hasAnyValidPrefix(name, allowedPrefixes)) {
          // Only check parameters in React components or hooks
          if (!isComponentOrHookParameter(node)) return;

          // Check for boolean default value
          if (isBooleanLiteral(node.right)) {
            reportBooleanPrefixError(node.left, name);
            return;
          }

          // Check type annotation
          if (node.left.typeAnnotation && isBooleanType(node.left.typeAnnotation)) {
            reportBooleanPrefixError(node.left, name);
          }
        }
      }
    }

    function checkObjectPatternProperty(node: TSESTree.Property | TSESTree.RestElement): void {
      if (
        node.type === 'Property' &&
        node.key.type === 'Identifier' &&
        node.value.type === 'Identifier' &&
        !hasAnyValidPrefix(node.value.name, allowedPrefixes)
      ) {
        // Check if this is a parameter destructuring in a component/hook
        if (!isComponentOrHookParameter(node)) return;

        // The property name in object destructuring is the same as the variable name
        // So we need to check if the key (not value) has a boolean type annotation
        // But in parameter destructuring, we need to check the original interface/type
        // For now, let's check if the destructured property has boolean type annotation
        if (node.value.typeAnnotation && isBooleanType(node.value.typeAnnotation)) {
          reportBooleanPrefixError(node.value, node.value.name);
        }
      }
    }

    function checkInterfaceProperty(node: TSESTree.TSPropertySignature): void {
      if (
        node.key.type === 'Identifier' &&
        !hasAnyValidPrefix(node.key.name, allowedPrefixes) &&
        node.typeAnnotation &&
        isBooleanType(node.typeAnnotation)
      ) {
        reportBooleanPrefixError(node.key, node.key.name);
      }
    }

    function checkClassProperty(node: TSESTree.PropertyDefinition): void {
      if (node.key.type === 'Identifier' && !hasAnyValidPrefix(node.key.name, allowedPrefixes)) {
        // Check for boolean value
        if (node.value && isBooleanLiteral(node.value)) {
          reportBooleanPrefixError(node.key, node.key.name);
          return;
        }

        // Check for boolean type annotation
        if (node.typeAnnotation && isBooleanType(node.typeAnnotation)) {
          reportBooleanPrefixError(node.key, node.key.name);
        }
      }
    }

    function checkParameterPattern(node: TSESTree.ObjectPattern): void {
      // Check if this is a React component or hook parameter
      if (!isComponentOrHookParameter(node)) return;

      // Get the type annotation from the parameter
      const typeAnnotation = node.typeAnnotation?.typeAnnotation;
      if (!typeAnnotation || typeAnnotation.type !== 'TSTypeLiteral') return;

      // Create a map of property types
      const propertyTypes: Map<string, boolean> = new Map();
      typeAnnotation.members.forEach((member) => {
        if (
          member.type === 'TSPropertySignature' &&
          member.key.type === 'Identifier' &&
          member.typeAnnotation &&
          isBooleanType(member.typeAnnotation)
        ) {
          propertyTypes.set(member.key.name, true);
        }
      });

      // Check each destructured property
      node.properties.forEach((prop) => {
        if (
          prop.type === 'Property' &&
          prop.key.type === 'Identifier' &&
          prop.value.type === 'Identifier' &&
          !hasAnyValidPrefix(prop.value.name, allowedPrefixes) &&
          propertyTypes.has(prop.key.name)
        ) {
          reportBooleanPrefixError(prop.value, prop.value.name);
        }
      });
    }

    return {
      ArrayPattern: checkArrayPattern,
      AssignmentPattern(node) {
        if (node.left.type === 'Identifier') {
          checkBooleanVariable(node, node.left.name);
        }
      },
      'FunctionDeclaration > :first-child[type="Identifier"]'(node: TSESTree.Identifier) {
        checkParameter(node);
      },
      'MethodDefinition[value.params] > FunctionExpression > :first-child[type="Identifier"]'(
        node: TSESTree.Identifier
      ) {
        checkParameter(node);
      },
      ObjectPattern(node) {
        // Check if this is a parameter pattern first
        checkParameterPattern(node);
        // Then check for variable destructuring patterns
        if (node.parent?.type === 'VariableDeclarator') {
          node.properties.forEach((prop) => {
            checkObjectPatternProperty(prop);
          });
        }
      },
      'Property[kind="init"]': checkObjectProperty,
      PropertyDefinition: checkClassProperty,
      'TSInterfaceDeclaration TSPropertySignature': checkInterfaceProperty,
      'TSTypeAliasDeclaration TSPropertySignature': checkInterfaceProperty,
      VariableDeclarator(node) {
        if (node.id.type === 'Identifier') {
          checkBooleanVariable(node, node.id.name);
        }
      },
    };
  },
  defaultOptions: [DEFAULT_OPTIONS],
  meta: {
    docs: {
      description:
        'Enforce boolean variables, state, and props to start with "is" prefix (or custom prefixes) in developer-controlled contexts',
    },
    messages: {
      booleanShouldStartWithPrefix:
        'Boolean identifier "{{name}}" should start with {{prefixes}} prefix. Consider renaming to "{{suggested}}".',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowedPrefixes: {
            items: { type: 'string' },
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'require-boolean-prefix-is',
});
