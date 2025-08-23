import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireJsxStringBraces } from '../../src/rules/require-jsx-string-braces';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('require-jsx-string-braces', requireJsxStringBraces, {
  invalid: [
    {
      code: '<div className="text-center">Content</div>',
      errors: [
        {
          data: {
            attribute: 'className',
            value: 'text-center',
          },
          messageId: 'requireBraces',
        },
      ],
      output: '<div className={"text-center"}>Content</div>',
    },
    {
      code: '<div aria-label="hello">Content</div>',
      errors: [
        {
          data: {
            attribute: 'aria-label',
            value: 'hello',
          },
          messageId: 'requireBraces',
        },
      ],
      output: '<div aria-label={"hello"}>Content</div>',
    },
    {
      code: '<CustomComponent stringProp="wrong" />',
      errors: [
        {
          data: {
            attribute: 'stringProp',
            value: 'wrong',
          },
          messageId: 'requireBraces',
        },
      ],
      output: '<CustomComponent stringProp={"wrong"} />',
    },
    {
      code: "<div title='single quotes'>Content</div>",
      errors: [
        {
          data: {
            attribute: 'title',
            value: 'single quotes',
          },
          messageId: 'requireBraces',
        },
      ],
      output: "<div title={'single quotes'}>Content</div>",
    },
    {
      code: '<div data-testid="my-component" className="container">Content</div>',
      errors: [
        {
          data: {
            attribute: 'data-testid',
            value: 'my-component',
          },
          messageId: 'requireBraces',
        },
        {
          data: {
            attribute: 'className',
            value: 'container',
          },
          messageId: 'requireBraces',
        },
      ],
      output: '<div data-testid={"my-component"} className={"container"}>Content</div>',
    },
    {
      code: '<div xmlns:custom="http://example.com" custom:attr="value" />',
      errors: [
        {
          data: {
            attribute: 'xmlns:custom',
            value: 'http://example.com',
          },
          messageId: 'requireBraces',
        },
        {
          data: {
            attribute: 'custom:attr',
            value: 'value',
          },
          messageId: 'requireBraces',
        },
      ],
      output: '<div xmlns:custom={"http://example.com"} custom:attr={"value"} />',
    },
  ],

  valid: [
    {
      code: '<div className={"text-center"}>Content</div>',
    },
    {
      code: "<div aria-label={'hello'}>Content</div>",
    },
    {
      code: '<CustomComponent stringProp={"right"} />',
    },
    {
      code: '<div id={dynamicId}>Content</div>',
    },
    {
      code: '<div className={`template-${string}`}>Content</div>',
    },
    {
      code: '<div>Content</div>',
    },
    {
      code: '<div className={null}>Content</div>',
    },
    {
      code: '<div disabled={true}>Content</div>',
    },
    {
      code: '<div count={42}>Content</div>',
    },
    {
      code: '<div xmlns:custom={"http://example.com"} custom:attr={"value"} />',
    },
  ],
});
