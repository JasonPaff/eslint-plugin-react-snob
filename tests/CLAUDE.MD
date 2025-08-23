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

## Test File Structure Template

Every rule test should follow this standard structure:

```typescript
import { RuleTester } from '@typescript-eslint/rule-tester';

import { ruleName } from '../../src/rules/rule-name';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
});

ruleTester.run('rule-name', ruleName, {
  valid: [
    // Test cases that should NOT trigger the rule
  ],
  invalid: [
    // Test cases that should trigger the rule
  ],
});
```

## Directory Structure

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

## RuleTester Configuration

### Required Parser Options

```typescript
const ruleTester = new RuleTester({
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
});
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

## Test Case Patterns

### Valid Test Cases

Valid test cases demonstrate code that should NOT trigger the rule:

```typescript
valid: [
  {
    code: `
      interface ButtonProps {
        onClick: () => void;
      }
      function Button({ onClick }: ButtonProps) {
        return <button onClick={onClick}>Click me</button>;
      }
    `,
  },
  {
    code: '<div className="my-class">Content</div>',
  },
  // Edge cases that should be ignored
  {
    code: `
      function utilFunction({ debug }: DebugOptions) {
        return debug;
      }
    `,
  },
];
```

#### Valid Test Case Guidelines

- **Correct usage**: Show the proper way to write code according to the rule
- **Edge cases**: Include cases that might look problematic but should be ignored
- **Scope limitations**: Test functions that shouldn't be affected (non-React code)
- **Multiple patterns**: Cover different valid syntax variations

### Invalid Test Cases

Invalid test cases demonstrate code that SHOULD trigger the rule:

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

#### Invalid Test Case Structure

- **`code`**: The problematic code that should trigger the rule
- **`errors`**: Array of expected error objects
  - **`messageId`**: Must match a message ID from the rule's meta.messages
  - **`data`** (optional): Expected data for message interpolation
  - **`line`** (optional): Expected line number of the error
  - **`column`** (optional): Expected column number of the error

### Auto-fix Test Cases

For rules with auto-fix capability:

```typescript
invalid: [
  {
    code: '<div className="text-center">Content</div>',
    errors: [{ messageId: 'requireBraces' }],
    output: '<div className={"text-center"}>Content</div>',
  },
];
```

- **`output`**: Expected code after applying the auto-fix

## Common Test Scenarios for React Rules

### Component Pattern Testing

```typescript
// Test different component declaration styles
valid: [
  // Function declaration
  { code: 'function MyComponent() { return <div />; }' },

  // Arrow function
  { code: 'const MyComponent = () => <div />;' },

  // forwardRef
  { code: 'const MyComponent = forwardRef(() => <div />);' },

  // Non-component (should be ignored)
  { code: 'function myUtil() { return true; }' },
];
```

### JSX-Specific Testing

```typescript
// Test JSX attributes and expressions
valid: [
  { code: '<div className="test">Content</div>' },
  { code: '<Component prop={value} />' },
  { code: '<div {...props}>Content</div>' },
];

invalid: [
  {
    code: '<div style={{ color: "red" }}>Content</div>',
    errors: [{ messageId: 'noInlineStyle' }],
  },
];
```

### TypeScript Interface Testing

```typescript
// Test TypeScript-specific patterns
valid: [
  {
    code: `
      interface ComponentProps {
        title: string;
      }
      const Component = ({ title }: ComponentProps) => <div>{title}</div>;
    `,
  },
];

invalid: [
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

### Comprehensive Coverage

- **Happy path**: Test the main scenarios the rule is designed for
- **Edge cases**: Test boundary conditions and unusual but valid code
- **Error conditions**: Test various ways the rule can be violated
- **Scope testing**: Ensure rule doesn't apply where it shouldn't

### Code Formatting in Tests

```typescript
// Multi-line code: Use template literals with proper indentation
{
  code: `
    interface Props {
      value: string;
    }
    function Component({ value }: Props) {
      return <div>{value}</div>;
    }
  `,
}

// Single-line code: Use regular strings
{ code: '<div className="test">Content</div>' }
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
