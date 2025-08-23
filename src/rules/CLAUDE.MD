# ESLint Rule Implementation Patterns

This document describes the consistent patterns and conventions for implementing ESLint rules in `eslint-plugin-react-snob`.

## Rule Structure Template

Every rule should follow this standard structure using shared utilities:

```typescript
import { TSESTree } from '@typescript-eslint/utils';
import { createRule, extractComponentName, isComponentFunction } from '../utils';

export const ruleName = createRule({
  create(context) {
    return {
      // AST node visitors
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Brief description of what the rule does',
    },
    fixable: 'code' | 'whitespace' | undefined,
    messages: {
      messageId: 'Error message template with {{data}}',
    },
    schema: [], // JSON Schema for rule options
    type: 'problem' | 'suggestion' | 'layout',
  },
  name: 'rule-name',
});
```

## Required Imports

### Shared Utilities (Always Required)

```typescript
import { createRule } from '../utils';
```

- **`createRule`**: Standardized rule creator with consistent documentation URLs

### TypeScript ESTree Types (When Needed)

```typescript
import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
```

- **TSESTree**: TypeScript ESTree node types for AST manipulation
- **AST_NODE_TYPES**: Enumeration of all AST node types

### Component and Analysis Utilities (When Needed)

```typescript
import {
  extractComponentName,
  isComponentFunction,
  countLogicalOperators,
  hasTemplateLiteral,
  findInterfaceNamesInTypeReference,
} from '../utils';
```

- **Component utilities**: Functions for detecting and analyzing React components
- **AST traversal utilities**: Functions for analyzing complex expressions
- **TypeScript utilities**: Functions for working with type annotations

## Rule Metadata Structure

### `meta` Object Properties

#### `docs` (Required)

```typescript
docs: {
  description: 'Concise one-line description of the rule purpose',
}
```

#### `fixable` (Optional)

- `'code'`: Rule can fix code structure/syntax
- `'whitespace'`: Rule only fixes whitespace/formatting
- `undefined`: Rule cannot provide automatic fixes

#### `messages` (Required)

```typescript
messages: {
  messageId: 'Template message with {{placeholder}} for data interpolation',
  anotherMessage: 'Multiple messages can be defined for different scenarios',
}
```

#### `schema` (Required)

```typescript
schema: [], // Empty array for rules with no options
schema: [  // JSON Schema for rules with options
  {
    type: 'object',
    properties: {
      option: { type: 'boolean' }
    },
    additionalProperties: false,
  }
]
```

#### `type` (Required)

- **`'problem'`**: Rule identifies code that will cause errors or unexpected behavior
- **`'suggestion'`**: Rule suggests better ways of doing things but not errors
- **`'layout'`**: Rule cares about whitespace, semicolons, commas, and parentheses

## Common AST Node Patterns for React Rules

### JSX Attribute Detection

```typescript
JSXAttribute(node) {
  // Check attribute name
  if (node.name.type === 'JSXIdentifier' && node.name.name === 'style') {
    // Handle style attribute
  }
}
```

### JSX Expression Container

```typescript
JSXExpressionContainer(node) {
  // Check for inline object expressions
  if (node.expression.type === 'ObjectExpression') {
    // Handle object expressions in JSX
  }
}
```

### Function Component Detection

```typescript
// Function declaration
FunctionDeclaration(node) {
  if (node.id && /^[A-Z]/.test(node.id.name)) {
    // This is likely a React component
  }
}

// Arrow function variable
VariableDeclarator(node) {
  if (node.id.type === 'Identifier' &&
      /^[A-Z]/.test(node.id.name) &&
      node.init?.type === 'ArrowFunctionExpression') {
    // This is likely a React component
  }
}
```

### TypeScript Interface Detection

```typescript
// Interface props pattern
if (firstParam.type === 'ObjectPattern' && firstParam.typeAnnotation) {
  const typeAnnotation = firstParam.typeAnnotation.typeAnnotation;
  if (typeAnnotation.type === 'TSTypeReference' && typeAnnotation.typeName.type === 'Identifier') {
    const interfaceName = typeAnnotation.typeName.name;
    // Work with interface name
  }
}
```

### forwardRef Pattern Detection

```typescript
// Direct forwardRef call
if (
  node.init.type === 'CallExpression' &&
  node.init.callee.type === 'Identifier' &&
  node.init.callee.name === 'forwardRef'
) {
  // Check type arguments for generic types
  if (node.init.typeArguments && node.init.typeArguments.params.length >= 2) {
    const propsTypeParam = node.init.typeArguments.params[1];
    // Handle props type parameter
  }
}
```

## Error Reporting Patterns

### Basic Error Report

```typescript
context.report({
  messageId: 'errorMessage',
  node: nodeToHighlight,
});
```

### Error Report with Data

```typescript
context.report({
  messageId: 'errorWithData',
  node: nodeToHighlight,
  data: {
    actual: actualValue,
    expected: expectedValue,
  },
});
```

### Error Report with Auto-fix

```typescript
context.report({
  messageId: 'fixableError',
  node: nodeToHighlight,
  fix(fixer) {
    return fixer.replaceText(node, newText);
  },
});
```

## Using Shared Utilities

Instead of implementing your own utility functions, use the shared utilities from `src/utils/`:

### Component Analysis

```typescript
import { extractComponentName, isComponentFunction } from '../utils';

// In your rule's create function
FunctionDeclaration(node) {
  if (!isComponentFunction(node)) return;

  const componentName = extractComponentName(node);
  if (componentName) {
    // Process component...
  }
}
```

### AST Expression Analysis

```typescript
import { countLogicalOperators, hasTemplateLiteral } from '../utils';

// In your rule's create function
JSXExpressionContainer(node) {
  const logicalCount = countLogicalOperators(node.expression);
  const hasTemplate = hasTemplateLiteral(node.expression);

  if (logicalCount > 2 || hasTemplate) {
    // Report complex condition...
  }
}
```

### TypeScript Type Analysis

```typescript
import { findInterfaceNamesInTypeReference } from '../utils';

// In your rule's create function
if (typeRef.type === 'TSTypeReference') {
  const interfaceNames = findInterfaceNamesInTypeReference(typeRef);
  // Process interface names...
}
```

## Naming Conventions

### Rule Names

- Use kebab-case: `props-interface-naming`
- Be descriptive but concise
- Follow pattern: `action-target-qualifier`
  - `no-inline-styles` (no + target + context)
  - `require-jsx-string-braces` (require + target + context)
  - `props-interface-naming` (target + context + action)

### Export Names

- Use camelCase: `propsInterfaceNaming`
- Convert kebab-case rule name to camelCase
- Export as named export: `export const ruleName = createRule({...})`

### Message IDs

- Use camelCase: `incorrectPropsInterfaceName`
- Be descriptive of the specific error condition
- Group related messages with common prefix when applicable

## Rule Categories

### Style Rules (`type: 'suggestion'`)

- Enforce consistent code style
- Usually auto-fixable
- Examples: `require-jsx-string-braces`, `no-inline-styles`

### Best Practice Rules (`type: 'suggestion'`)

- Enforce React best practices
- May or may not be auto-fixable
- Examples: `props-interface-naming`

### Error Prevention Rules (`type: 'problem'`)

- Prevent runtime errors or bugs
- Usually not auto-fixable
- Focus on correctness over style

## Performance Considerations

- **Minimize AST traversal**: Only listen for relevant node types
- **Early returns**: Exit early when conditions don't match
- **Avoid expensive operations**: Cache results when possible
- **Defensive coding**: Always check node types and properties before accessing

## Testing Integration

Each rule should have corresponding tests in `tests/rules/rule-name.test.ts` following the patterns documented in `tests/CLAUDE.MD`.
