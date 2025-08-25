import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireJsxStringBraces } from '../../src/rules/require-jsx-string-braces';

// Parser configuration for JSX testing
const PARSER_CONFIG = {
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2020,
      sourceType: 'module' as const,
    },
  },
} as const;

// Helper function to create invalid test cases
function createInvalidCase(
  code: string,
  output: string,
  errors: Array<{ attribute: string; value: string }>
) {
  return {
    code,
    output,
    errors: errors.map(error => ({
      data: error,
      messageId: 'requireBraces' as const,
    })),
  };
}

// Helper function to create valid test cases
function createValidCase(code: string) {
  return { code };
}

// Test cases for basic string attributes that should be wrapped in braces
const basicStringAttributeCases = [
  createInvalidCase(
    '<div className="text-center">Content</div>',
    '<div className={"text-center"}>Content</div>',
    [{ attribute: 'className', value: 'text-center' }]
  ),
  createInvalidCase(
    '<div aria-label="hello">Content</div>',
    '<div aria-label={"hello"}>Content</div>',
    [{ attribute: 'aria-label', value: 'hello' }]
  ),
  createInvalidCase(
    '<CustomComponent stringProp="wrong" />',
    '<CustomComponent stringProp={"wrong"} />',
    [{ attribute: 'stringProp', value: 'wrong' }]
  ),
];

// Test cases for different quote styles
const quotingVariationCases = [
  createInvalidCase(
    "<div title='single quotes'>Content</div>",
    "<div title={'single quotes'}>Content</div>",
    [{ attribute: 'title', value: 'single quotes' }]
  ),
];

// Test cases for multiple attributes on the same element
const multipleAttributeCases = [
  createInvalidCase(
    '<div data-testid="my-component" className="container">Content</div>',
    '<div data-testid={"my-component"} className={"container"}>Content</div>',
    [
      { attribute: 'data-testid', value: 'my-component' },
      { attribute: 'className', value: 'container' },
    ]
  ),
];

// Test cases for namespaced attributes
const namespacedAttributeCases = [
  createInvalidCase(
    '<div xmlns:custom="http://example.com" custom:attr="value" />',
    '<div xmlns:custom={"http://example.com"} custom:attr={"value"} />',
    [
      { attribute: 'xmlns:custom', value: 'http://example.com' },
      { attribute: 'custom:attr', value: 'value' },
    ]
  ),
];

// Test cases for multiline strings
const multilineStringCases = [
  createInvalidCase(
    `<div title="This is a
    multi-line string">Content</div>`,
    `<div title={\`This is a
    multi-line string\`}>Content</div>`,
    [{ attribute: 'title', value: 'This is a\n    multi-line string' }]
  ),
  createInvalidCase(
    `<path
    d="M449.99,422.439v-85.005h22.354v11.444
      c6.152-7.383,16.544-13.538,27.095-13.538v21.818"
  />`,
    `<path
    d={\`M449.99,422.439v-85.005h22.354v11.444
      c6.152-7.383,16.544-13.538,27.095-13.538v21.818\`}
  />`,
    [{ attribute: 'd', value: 'M449.99,422.439v-85.005h22.354v11.444\n      c6.152-7.383,16.544-13.538,27.095-13.538v21.818' }]
  ),
];

// Test cases for strings containing special characters
const specialCharacterCases = [
  createInvalidCase(
    `<div data-value="string with \`backticks\`">Content</div>`,
    `<div data-value={"string with \`backticks\`"}>Content</div>`,
    [{ attribute: 'data-value', value: 'string with `backticks`' }]
  ),
];

// Test cases for strings already wrapped in braces (should be valid)
const alreadyBracedCases = [
  createValidCase('<div className={"text-center"}>Content</div>'),
  createValidCase("<div aria-label={'hello'}>Content</div>"),
  createValidCase('<CustomComponent stringProp={"right"} />'),
  createValidCase('<div xmlns:custom={"http://example.com"} custom:attr={"value"} />'),
];

// Test cases for non-string values (should be valid)
const nonStringValueCases = [
  createValidCase('<div id={dynamicId}>Content</div>'),
  createValidCase('<div className={`template-${string}`}>Content</div>'),
  createValidCase('<div className={null}>Content</div>'),
  createValidCase('<div disabled={true}>Content</div>'),
  createValidCase('<div count={42}>Content</div>'),
];

// Test cases for elements without problematic attributes (should be valid)
const noAttributeCases = [
  createValidCase('<div>Content</div>'),
];

// Test cases for multiline template literals (should be valid)
const validMultilineCases = [
  createValidCase(`<div title={\`This is a
    multi-line template literal\`}>Content</div>`),
  createValidCase(`<path d={\`M449.99,422.439v-85.005h22.354v11.444
    c6.152-7.383,16.544-13.538,27.095-13.538v21.818\`} />`),
];

// Organize all test cases
const TEST_CASES = {
  invalid: [
    ...basicStringAttributeCases,
    ...quotingVariationCases,
    ...multipleAttributeCases,
    ...namespacedAttributeCases,
    ...multilineStringCases,
    ...specialCharacterCases,
  ],
  valid: [
    ...alreadyBracedCases,
    ...nonStringValueCases,
    ...noAttributeCases,
    ...validMultilineCases,
  ],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('require-jsx-string-braces', requireJsxStringBraces, TEST_CASES);
