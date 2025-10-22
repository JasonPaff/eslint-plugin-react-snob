import { RuleTester } from '@typescript-eslint/rule-tester';

import { noInlineStyles } from '../../src/rules/no-inline-styles';
import { createNoInlineStylesInvalidCase, createValidCase, PARSER_CONFIG } from '../../src/utils/test-utils';

// Test cases for inline style objects
const inlineStyleObjectCases = [
  createNoInlineStylesInvalidCase('<div style={{ color: "red" }}>Content</div>'),
  createNoInlineStylesInvalidCase('<span style={{ fontSize: "14px", margin: "10px" }}>Text</span>'),
];

// Test cases for style variables
const styleVariableCases = [createNoInlineStylesInvalidCase('<button style={buttonStyles}>Click me</button>')];

// Test cases for elements without style attributes
const noStyleAttributeCases = [
  createValidCase('<div className="my-class">Content</div>'),
  createValidCase('<div>Content</div>'),
];

// Test cases for non-style attributes
const nonStyleAttributeCases = [createValidCase('<div data-style="something">Content</div>')];

const TEST_CASES = {
  invalid: [...inlineStyleObjectCases, ...styleVariableCases],
  valid: [...noStyleAttributeCases, ...nonStyleAttributeCases],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('no-inline-styles', noInlineStyles, TEST_CASES);
