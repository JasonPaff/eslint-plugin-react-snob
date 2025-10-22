import { RuleTester } from '@typescript-eslint/rule-tester';

import { noShorthandFragment } from '../../src/rules/no-shorthand-fragment';
import { createValidCase, PARSER_CONFIG } from '../../src/utils/test-utils';

// Helper to create invalid cases for this rule
function createNoShorthandFragmentInvalidCase(code: string) {
  return {
    code,
    errors: [
      {
        messageId: 'noShorthandFragment' as const,
      },
    ],
  };
}

// Test cases for basic shorthand fragment usage
const basicShorthandFragmentCases = [
  createNoShorthandFragmentInvalidCase(`
    function Component() {
      return (
        <>
          <div>Content</div>
        </>
      );
    }
  `),
  createNoShorthandFragmentInvalidCase(`
    const Component = () => (
      <>
        <CheckCircle2 aria-hidden className={'mr-1 size-4'} />
        Selected
      </>
    );
  `),
];

// Test cases for nested shorthand fragments
const nestedShorthandFragmentCases = [
  createNoShorthandFragmentInvalidCase(`
    function Component() {
      return (
        <div>
          <>
            <span>Nested</span>
          </>
        </div>
      );
    }
  `),
];

// Test cases for multiple children in shorthand fragments
const multipleChildrenCases = [
  createNoShorthandFragmentInvalidCase(`
    function Component() {
      return (
        <>
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </>
      );
    }
  `),
];

// Test cases for explicit Fragment usage (should be valid)
const explicitFragmentCases = [
  createValidCase(`
    import { Fragment } from 'react';
    function Component() {
      return (
        <Fragment>
          <div>Content</div>
        </Fragment>
      );
    }
  `),
  createValidCase(`
    import React from 'react';
    function Component() {
      return (
        <React.Fragment>
          <div>Content</div>
        </React.Fragment>
      );
    }
  `),
  createValidCase(`
    function Component() {
      return (
        <Fragment>
          <CheckCircle2 aria-hidden className={'mr-1 size-4'} />
          Selected
        </Fragment>
      );
    }
  `),
];

// Test cases for regular JSX elements (should be valid)
const regularJsxCases = [
  createValidCase(`
    function Component() {
      return <div>Content</div>;
    }
  `),
  createValidCase(`
    function Component() {
      return (
        <div>
          <span>Nested</span>
        </div>
      );
    }
  `),
];

// Test cases for Fragment with key prop (should be valid with explicit Fragment)
const fragmentWithPropsCases = [
  createValidCase(`
    function Component({ items }) {
      return items.map(item => (
        <Fragment key={item.id}>
          <div>{item.name}</div>
        </Fragment>
      ));
    }
  `),
];

const TEST_CASES = {
  invalid: [...basicShorthandFragmentCases, ...nestedShorthandFragmentCases, ...multipleChildrenCases],
  valid: [...explicitFragmentCases, ...regularJsxCases, ...fragmentWithPropsCases],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('no-shorthand-fragment', noShorthandFragment, TEST_CASES);
