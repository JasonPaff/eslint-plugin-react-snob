# ESLint Plugin Shared Utilities

This document describes the shared utility functions available for all ESLint rules in `eslint-plugin-react-snob`. These utilities help eliminate code duplication and ensure consistent behavior across all rules.

## Overview

The utilities are organized into specialized modules:

- **`rule-creator.ts`**: Standardized rule creation
- **`component-utils.ts`**: React component detection and analysis
- **`ast-traversal.ts`**: AST traversal and expression analysis
- **`typescript-utils.ts`**: TypeScript-specific AST utilities
- **`jsx-utils.ts`**: JSX and context detection utilities
- **`naming-utils.ts`**: Naming convention utilities
- **`boolean-utils.ts`**: Boolean type and expression utilities
- **`event-handler-utils.ts`**: Event handler naming and detection utilities
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

## JSX and Context Detection Utilities

### `containsJSX(node: TSESTree.Node, visited?: Set<TSESTree.Node>): boolean`

**File**: `jsx-utils.ts`  
**Purpose**: Checks if a node contains JSX elements, with cycle detection

```typescript
import { containsJSX } from '../utils';

if (containsJSX(expression.right)) {
  // Expression contains JSX elements
}
```

### `isInZodOmitOrPickMethod(node: TSESTree.Node): boolean`

**File**: `jsx-utils.ts`  
**Purpose**: Checks if a property is inside a Zod .omit() or .pick() method call

```typescript
import { isInZodOmitOrPickMethod } from '../utils';

if (isInZodOmitOrPickMethod(node)) {
  return; // Skip validation for Zod utility calls
}
```

### `isInConstructorCall(node: TSESTree.Node): boolean`

**File**: `jsx-utils.ts`  
**Purpose**: Checks if a property is inside a constructor call (new Something(...))

## Naming Convention Utilities

### `suggestUnderscorePrefix(name: string): string`

**File**: `naming-utils.ts`  
**Purpose**: Converts a variable name to its suggested underscore prefixed version

```typescript
import { suggestUnderscorePrefix } from '../utils';

const suggestion = suggestUnderscorePrefix('isLoading'); // "_isLoading"
```

### `hasUnderscorePrefix(name: string): boolean`

**File**: `naming-utils.ts`  
**Purpose**: Checks if a name already starts with underscore

### `suggestPrefixedName(name: string, allowedPrefixes: string[]): string`

**File**: `naming-utils.ts`  
**Purpose**: Converts a variable name to its suggested prefixed version based on allowed prefixes

```typescript
import { suggestPrefixedName } from '../utils';

const suggestion = suggestPrefixedName('loading', ['is', 'has']); // "isLoading"
```

### `hasValidPrefix(name: string, prefix: string): boolean`

**File**: `naming-utils.ts`  
**Purpose**: Checks if a name already starts with a valid prefix (including underscore prefix)

### `hasAnyValidPrefix(name: string, allowedPrefixes: string[]): boolean`

**File**: `naming-utils.ts`  
**Purpose**: Checks if a name starts with any of the allowed prefixes

## Boolean Type and Expression Utilities

### `isBooleanType(typeAnnotation?: TSESTree.TSTypeAnnotation): boolean`

**File**: `boolean-utils.ts`  
**Purpose**: Checks if a type annotation is boolean or includes boolean

```typescript
import { isBooleanType } from '../utils';

if (isBooleanType(node.typeAnnotation)) {
  // This parameter has boolean type
}
```

### `isBooleanLiteral(node?: TSESTree.Expression): boolean`

**File**: `boolean-utils.ts`  
**Purpose**: Checks if a literal value is boolean

### `isBooleanExpression(node: TSESTree.Expression): boolean`

**File**: `boolean-utils.ts`  
**Purpose**: Checks if an expression is likely to return a boolean value

### `isLikelyBooleanExpression(node: TSESTree.Expression): boolean`

**File**: `boolean-utils.ts`  
**Purpose**: Checks if an expression is likely to produce a boolean value (more comprehensive)

### `isDerivedBooleanExpression(node: TSESTree.Expression): boolean`

**File**: `boolean-utils.ts`  
**Purpose**: Checks if an expression is a derived boolean expression that should require underscore prefix

### `isUseStateWithBoolean(node: TSESTree.CallExpression): boolean`

**File**: `boolean-utils.ts`  
**Purpose**: Checks if a CallExpression is a useState call with a boolean initial value

## Event Handler Utilities

### `eventHandlerAttributes: Set<string>`

**File**: `event-handler-utils.ts`  
**Purpose**: Set of common React event handler attribute names (onClick, onChange, etc.)

### `extractEventFromHandlerName(handlerName: string): string`

**File**: `event-handler-utils.ts`  
**Purpose**: Extracts the event name from a handler name by removing common prefixes/suffixes

```typescript
import { extractEventFromHandlerName } from '../utils';

const eventName = extractEventFromHandlerName('handleSubmit'); // "submit"
```

### `generateHandleEventName(eventName: string): string`

**File**: `event-handler-utils.ts`  
**Purpose**: Generates a properly formatted "handle" prefixed event handler name

### `generateOnEventName(eventName: string): string`

**File**: `event-handler-utils.ts`  
**Purpose**: Generates a properly formatted "on" prefixed event handler prop name

### `isEventHandlerName(name: string): boolean`

**File**: `event-handler-utils.ts`  
**Purpose**: Checks if a name looks like an event handler based on common patterns

### `isEventHandlerParameter(param: TSESTree.Parameter): boolean`

**File**: `event-handler-utils.ts`  
**Purpose**: Checks if a parameter looks like an event parameter (e, event, evt)

### `hasEventHandlerParameters(node: Function): boolean`

**File**: `event-handler-utils.ts`  
**Purpose**: Checks if a function has event handler-style parameters

### `isFunctionType(node: TSESTree.TypeNode): boolean`

**File**: `event-handler-utils.ts`  
**Purpose**: Checks if a TypeScript type node represents a function type

### `looksLikeFunctionType(propertyName: string, node?: TSESTree.TypeNode): boolean`

**File**: `event-handler-utils.ts`  
**Purpose**: Checks if a property looks like a function type based on name or type annotation

## Maintenance

- **Keep utilities focused**: Don't add kitchen-sink utilities
- **Version compatibility**: Ensure utilities work with the supported TypeScript/ESLint versions
- **Documentation**: Keep this file updated when adding or modifying utilities
- **Testing**: While utilities don't have dedicated tests, they're tested through rule tests
