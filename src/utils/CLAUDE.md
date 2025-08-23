# ESLint Plugin Shared Utilities

This document describes the shared utility functions available for all ESLint rules in `eslint-plugin-react-snob`. These utilities help eliminate code duplication and ensure consistent behavior across all rules.

## Overview

The utilities are organized into specialized modules:

- **`rule-creator.ts`**: Standardized rule creation
- **`component-utils.ts`**: React component detection and analysis
- **`ast-traversal.ts`**: AST traversal and expression analysis
- **`typescript-utils.ts`**: TypeScript-specific AST utilities
- **`index.ts`**: Central export point for all utilities

## Usage

Import utilities from the central index file:

```typescript
import { createRule, extractComponentName, countLogicalOperators } from '../utils';
```

## Rule Creation Utilities

### `createRule`

**File**: `rule-creator.ts`  
**Purpose**: Creates ESLint rules with consistent documentation URL patterns

```typescript
import { createRule } from '../utils';

export const myRule = createRule({
  name: 'my-rule',
  meta: {
    /* ... */
  },
  defaultOptions: [],
  create(context) {
    // Rule implementation
  },
});
```

**Benefits**:

- Consistent documentation URL generation for all rules
- Type safety with TypeScript ESTree
- Standardized rule structure

## Component Analysis Utilities

### `extractComponentName(node: TSESTree.Node): string | null`

**File**: `component-utils.ts`  
**Purpose**: Extracts component name from function declarations or variable declarators

```typescript
import { extractComponentName } from '../utils';

FunctionDeclaration(node) {
  const componentName = extractComponentName(node);
  if (componentName) {
    console.log(`Found component: ${componentName}`);
  }
}
```

**Supports**:

- Function declarations: `function MyComponent() {}`
- Variable declarators: `const MyComponent = () => {}`

### `isComponentFunction(node: TSESTree.Node): boolean`

**File**: `component-utils.ts`  
**Purpose**: Determines if a function node represents a React component based on naming convention

```typescript
import { isComponentFunction } from '../utils';

FunctionDeclaration(node) {
  if (isComponentFunction(node)) {
    // This is a React component (starts with uppercase)
  }
}
```

**Detection Rules**:

- Function name must start with uppercase letter (PascalCase)
- Works with both function declarations and variable declarators

## AST Traversal Utilities

### `countLogicalOperators(node: TSESTree.Expression): number`

**File**: `ast-traversal.ts`  
**Purpose**: Recursively counts logical operators in an expression

```typescript
import { countLogicalOperators } from '../utils';

JSXExpressionContainer(node) {
  const count = countLogicalOperators(node.expression);
  if (count > 2) {
    // Expression is too complex
  }
}
```

**Counts**:

- Logical operators: `&&`, `||`
- Logical assignment operators: `||=`, `&&=`, `??=`
- Handles nested expressions and complex AST structures

### `hasTemplateLiteral(node: TSESTree.Expression): boolean`

**File**: `ast-traversal.ts`  
**Purpose**: Checks if an expression contains template literals

```typescript
import { hasTemplateLiteral } from '../utils';

if (hasTemplateLiteral(expression) && countLogicalOperators(expression) > 0) {
  // Complex condition with template literals
}
```

**Detection**:

- Recursively searches through all expression types
- Finds template literals at any nesting level

### `hasLogicalAssignment(node: TSESTree.Expression): boolean`

**File**: `ast-traversal.ts`  
**Purpose**: Checks if an expression contains logical assignment operators

```typescript
import { hasLogicalAssignment } from '../utils';

if (hasLogicalAssignment(expression)) {
  // Expression uses ||=, &&=, or ??=
}
```

**Detects**: `||=`, `&&=`, `??=` operators

### `isComplexOperand(node: TSESTree.Expression): boolean`

**File**: `ast-traversal.ts`  
**Purpose**: Determines if an operand in a logical chain is complex

```typescript
import { isComplexOperand } from '../utils';

// Used internally by other utilities to assess expression complexity
```

**Considers Complex**:

- Chained property access (`a.b.c`)
- Function calls with arguments
- Binary expressions
- Nested logical expressions

## TypeScript Utilities

### `findInterfaceNamesInTypeReference(typeRef: TSESTree.TSTypeReference): string[]`

**File**: `typescript-utils.ts`  
**Purpose**: Recursively finds all interface names in a TypeScript type reference

```typescript
import { findInterfaceNamesInTypeReference } from '../utils';

if (typeAnnotation.type === 'TSTypeReference') {
  const interfaces = findInterfaceNamesInTypeReference(typeAnnotation);
  interfaces.forEach((name) => {
    // Process each interface name
  });
}
```

**Features**:

- Extracts main type reference names
- Recursively processes generic type arguments
- Returns all interface names found in the type structure

## Development Guidelines

### Adding New Utilities

1. **Choose the right module**: Add to the most appropriate specialized file
2. **Export from index**: Always export new utilities from `src/utils/index.ts`
3. **Document thoroughly**: Add JSDoc comments and usage examples
4. **Test integration**: Ensure utilities work with existing rules
5. **Update CLAUDE.MD**: Document new utilities in this file

### Best Practices

1. **Single Responsibility**: Each utility should have one clear purpose
2. **Type Safety**: Use proper TypeScript types for all parameters and return values
3. **Error Handling**: Handle edge cases gracefully
4. **Performance**: Avoid expensive operations when possible
5. **Reusability**: Design utilities to be useful across multiple rules

### Example: Adding a New Utility

```typescript
// src/utils/jsx-utils.ts
import { TSESTree } from '@typescript-eslint/utils';

/**
 * Checks if a JSX attribute has a specific name
 */
export function isJSXAttributeNamed(node: TSESTree.JSXAttribute, name: string): boolean {
  return node.name.type === 'JSXIdentifier' && node.name.name === name;
}
```

```typescript
// src/utils/index.ts (add to exports)
export { isJSXAttributeNamed } from './jsx-utils';
```

## Migration from Rule-Specific Functions

When updating existing rules to use shared utilities:

1. **Identify duplicated code**: Look for similar functions across rules
2. **Replace with imports**: Remove local functions and import from utils
3. **Test thoroughly**: Ensure behavior remains unchanged
4. **Update tests if needed**: Tests should still pass without modification

## Performance Considerations

- **AST traversal utilities**: Designed for efficiency but use judiciously on large expressions
- **Caching**: Utilities don't implement internal caching; cache results in rules if needed
- **Early returns**: Most utilities use early returns to minimize computation

## Maintenance

- **Keep utilities focused**: Don't add kitchen-sink utilities
- **Version compatibility**: Ensure utilities work with the supported TypeScript/ESLint versions
- **Documentation**: Keep this file updated when adding or modifying utilities
- **Testing**: While utilities don't have dedicated tests, they're tested through rule tests
