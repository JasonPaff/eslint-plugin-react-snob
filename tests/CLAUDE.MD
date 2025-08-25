# ESLint Rule Testing Patterns

This document describes the testing framework, structure, and conventions for testing ESLint rules in `eslint-plugin-react-snob`.

## Testing Framework

### Setup

- **Test Framework**: Jest with TypeScript support (`ts-jest`)
- **ESLint Test Utils**: `@typescript-eslint/rule-tester`
- **Test Environment**: Node.js
- **Test File Pattern**: `**/*.test.ts`
- **Test Directory**: `tests/` (separate from `src/`)

### Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
```

## Test File Structure and Organization

### Directory Structure

```
tests/
├── rules/                    # Rule-specific tests (mirrors src/rules/)
│   ├── no-inline-styles.test.ts
│   └── require-jsx-string-braces.test.ts
│
└── CLAUDE.MD                # This documentation file
```

### File Naming Convention

- Test files: `rule-name.test.ts` (matches rule file name)
- Location: `tests/rules/` (mirrors `src/rules/`)
- Import path: `../../src/rules/rule-name`

### Import Organization

Always organize imports in this order:

```typescript
// 1. External dependencies first
import { RuleTester } from '@typescript-eslint/rule-tester';

// 2. Internal rule imports
import { requireJsxStringBraces } from '../../src/rules/require-jsx-string-braces';

// 3. Shared utilities last
import { createInvalidCase, createValidCase, PARSER_CONFIG } from '../../src/utils/test-utils';
```

## Test File Structure Template

Every rule test should follow this standard structure:

```typescript
import { RuleTester } from '@typescript-eslint/rule-tester';
import { ruleName } from '../../src/rules/rule-name';
import { createInvalidCase, createValidCase, PARSER_CONFIG } from '../../src/utils/test-utils';

// Test cases for [describe main functionality]
const mainFunctionalityCases = [createInvalidCase(/* ... */), createInvalidCase(/* ... */)];

// Test cases for [describe edge cases]
const edgeCases = [createInvalidCase(/* ... */)];

// Test cases for [describe valid scenarios]
const validCases = [createValidCase(/* ... */), createValidCase(/* ... */)];

const TEST_CASES = {
  invalid: [...mainFunctionalityCases, ...edgeCases],
  valid: [...validCases],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('rule-name', ruleName, TEST_CASES);
```

## Test Data Organization Guidelines

### Group Test Cases by Functionality

Organize test cases into logical groups with descriptive names:

```typescript
// ✅ Good: Descriptive group names
const basicStringAttributeCases = [
  /* ... */
];
const quotingVariationCases = [
  /* ... */
];
const multipleAttributeCases = [
  /* ... */
];

// ❌ Bad: Generic or unclear names
const testCases1 = [
  /* ... */
];
const invalidTests = [
  /* ... */
];
```

### Use Helper Functions

Always use the shared helper functions for consistency:

```typescript
// ✅ Good: Use helper functions
const basicStringAttributeCases = [
  createInvalidCase('<div className="text-center">Content</div>', '<div className={"text-center"}>Content</div>', [
    { attribute: 'className', value: 'text-center' },
  ]),
];

// ❌ Bad: Manual object creation
const basicStringAttributeCases = [
  {
    code: '<div className="text-center">Content</div>',
    output: '<div className={"text-center"}>Content</div>',
    errors: [
      {
        data: { attribute: 'className', value: 'text-center' },
        messageId: 'requireBraces',
      },
    ],
  },
];
```

## RuleTester Configuration

### Standard Configuration (Shared Constant)

Use the shared `PARSER_CONFIG` constant for consistency:

```typescript
// In test-utils.ts
export const PARSER_CONFIG = {
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaFeatures: {
        jsx: true, // Essential for React/JSX rules
      },
      ecmaVersion: 2020, // Modern JavaScript features
      sourceType: 'module', // ES modules
    },
  },
};
```

### TypeScript-Specific Configuration (when needed)

```typescript
const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 2020,
      sourceType: 'module',
      // Add these for TypeScript-specific tests
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
    },
  },
});
```

## Test Case Categories and Patterns

### Invalid Test Cases

Group invalid test cases by the type of issue they test:

1. **Basic functionality** - Core rule behavior
2. **Edge cases** - Unusual but valid inputs
3. **Multiple scenarios** - Complex combinations
4. **Special characters** - Strings with quotes, backticks, etc.
5. **Formatting variations** - Different quote styles, multiline strings

#### Invalid Test Case Construction

Use `createInvalidCase()` with these parameters:

1. **Input code** - The code that should trigger the rule
2. **Expected output** - The code after auto-fix is applied
3. **Expected errors** - Array of error objects with `attribute` and `value`

```typescript
createInvalidCase(
  '<div className="text-center">Content</div>', // Input
  '<div className={"text-center"}>Content</div>', // Expected output
  [{ attribute: 'className', value: 'text-center' }] // Expected errors
);
```

#### Manual Invalid Test Case Structure (when helpers can't be used)

```typescript
invalid: [
  {
    code: `
      interface ButtonOptions {
        onClick: () => void;
      }
      function Button({ onClick }: ButtonOptions) {
        return <button onClick={onClick}>Click me</button>;
      }
    `,
    errors: [
      {
        messageId: 'incorrectPropsInterfaceName',
        data: {
          actual: 'ButtonOptions',
          expected: 'ButtonProps',
          component: 'Button',
        },
      },
    ],
  },
];
```

### Valid Test Cases

Group valid test cases by why they should pass:

1. **Already compliant** - Code that already follows the rule
2. **Non-applicable** - Code the rule shouldn't affect
3. **Edge cases** - Boundary conditions that should be valid

#### Valid Test Case Construction

Use `createValidCase()` with just the code that should pass:

```typescript
createValidCase('<div className={"text-center"}>Content</div>');
```

#### Valid Test Case Guidelines

- **Correct usage**: Show the proper way to write code according to the rule
- **Edge cases**: Include cases that might look problematic but should be ignored
- **Scope limitations**: Test functions that shouldn't be affected (non-React code)
- **Multiple patterns**: Cover different valid syntax variations

### Auto-fix Test Cases

For rules with auto-fix capability, the `createInvalidCase` helper handles this automatically. For manual cases:

```typescript
invalid: [
  {
    code: '<div className="text-center">Content</div>',
    errors: [{ messageId: 'requireBraces' }],
    output: '<div className={"text-center"}>Content</div>',
  },
];
```

## Naming Conventions

### Variable Names

- Use descriptive names that explain what the test cases cover
- End group names with `Cases` for consistency
- Use camelCase for variable names

```typescript
// ✅ Good examples
const basicStringAttributeCases = [
  /* ... */
];
const namespacedAttributeCases = [
  /* ... */
];
const validMultilineCases = [
  /* ... */
];

// ❌ Bad examples
const tests1 = [
  /* ... */
];
const invalidCases = [
  /* ... */
]; // Too generic
const BASIC_TESTS = [
  /* ... */
]; // Wrong case style
```

### Comments

- Add a comment above each test case group explaining its purpose
- Use consistent comment formatting

```typescript
// Test cases for basic string attributes that should be wrapped in braces
const basicStringAttributeCases = [
  /* ... */
];

// Test cases for different quote styles
const quotingVariationCases = [
  /* ... */
];
```

## Common Test Scenarios for React Rules

### Component Pattern Testing

```typescript
// Test different component declaration styles
const validComponentCases = [
  // Function declaration
  createValidCase('function MyComponent() { return <div />; }'),

  // Arrow function
  createValidCase('const MyComponent = () => <div />;'),

  // forwardRef
  createValidCase('const MyComponent = forwardRef(() => <div />);'),

  // Non-component (should be ignored)
  createValidCase('function myUtil() { return true; }'),
];
```

### JSX-Specific Testing

```typescript
// Test JSX attributes and expressions
const validJsxCases = [
  createValidCase('<div className="test">Content</div>'),
  createValidCase('<Component prop={value} />'),
  createValidCase('<div {...props}>Content</div>'),
];

const invalidJsxCases = [
  createInvalidCase(
    '<div style={{ color: "red" }}>Content</div>',
    '<div>Content</div>', // Expected after fix
    [{ messageId: 'noInlineStyle' }]
  ),
];
```

### TypeScript Interface Testing

```typescript
// Test TypeScript-specific patterns
const validTypescriptCases = [
  createValidCase(`
    interface ComponentProps {
      title: string;
    }
    const Component = ({ title }: ComponentProps) => <div>{title}</div>;
  `),
];

const invalidTypescriptCases = [
  {
    code: `
      interface ComponentConfig {
        title: string;
      }
      const Component = ({ title }: ComponentConfig) => <div>{title}</div>;
    `,
    errors: [
      {
        messageId: 'incorrectNaming',
        data: { expected: 'ComponentProps', actual: 'ComponentConfig' },
      },
    ],
  },
];
```

## Testing Best Practices

### Do's

- ✅ Group related test cases together
- ✅ Use descriptive variable names and comments
- ✅ Use shared helper functions and constants (`PARSER_CONFIG`, `createInvalidCase`, etc.)
- ✅ Keep test cases focused on specific scenarios
- ✅ Include both positive and negative test cases
- ✅ Test edge cases and special characters
- ✅ Test the main scenarios the rule is designed for
- ✅ Test boundary conditions and unusual but valid code
- ✅ Test various ways the rule can be violated
- ✅ Ensure rule doesn't apply where it shouldn't

### Don'ts

- ❌ Don't create monolithic test case arrays
- ❌ Don't repeat test case structure manually when helpers exist
- ❌ Don't use generic or unclear naming
- ❌ Don't mix unrelated test scenarios in the same group
- ❌ Don't forget to test auto-fix output for invalid cases
- ❌ Don't rely on default messages - always specify `messageId`

### Code Formatting in Tests

```typescript
// Multi-line code: Use template literals with proper indentation
createValidCase(`
  interface Props {
    value: string;
  }
  function Component({ value }: Props) {
    return <div>{value}</div>;
  }
`);

// Single-line code: Use regular strings
createValidCase('<div className="test">Content</div>');
```

### Error Message Testing

- **Always specify `messageId`**: Don't rely on default messages
- **Test data interpolation**: When messages use `{{placeholder}}`, provide expected data
- **Multiple errors**: Test scenarios that should report multiple violations

### Regression Testing

- Add test cases for any bugs discovered and fixed
- Test complex real-world scenarios, not just simple examples
- Include tests for reported edge cases from users

## Running Tests

### All Tests

```bash
npm test
```

### Specific Rule Tests

```bash
npm test -- --testPathPattern=rule-name
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage

```bash
npm test -- --coverage
```

## Test Development Workflow

1. **Write failing tests first**: Define expected behavior before implementing
2. **Start with valid cases**: Establish what should NOT trigger the rule
3. **Add invalid cases**: Define what SHOULD trigger the rule
4. **Test edge cases**: Consider unusual but valid syntax
5. **Test error messages**: Ensure messages are helpful and accurate
6. **Test auto-fixes**: Verify fixes produce correct output
7. **Add regression tests**: Prevent future bugs

## Final Test Structure Template

Always end test files with this pattern:

```typescript
// Organize all test cases
const TEST_CASES = {
  invalid: [
    ...basicStringAttributeCases,
    ...quotingVariationCases,
    ...multipleAttributeCases,
    // ... other invalid case groups
  ],
  valid: [
    ...alreadyBracedCases,
    ...nonStringValueCases,
    ...noAttributeCases,
    // ... other valid case groups
  ],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('rule-name', ruleImplementation, TEST_CASES);
```

Following these conventions ensures consistent, maintainable, and readable test files across the project.
