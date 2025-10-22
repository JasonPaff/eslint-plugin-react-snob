import { RuleTester } from '@typescript-eslint/rule-tester';

import { noIifeInJsx } from '../../src/rules/no-iife-in-jsx';
import { PARSER_CONFIG } from '../../src/utils/test-utils';

// Test cases for arrow function IIFEs
const arrowFunctionIifeCases = [
  {
    code: `
      <div>
        {(() => {
          const variable = "some_value";
          return <span>{variable}</span>;
        })()}
      </div>
    `,
    errors: [{ messageId: 'noIifeInJsx' }],
  },
  {
    code: `
      <div>
        <div>title</div>
        <div>
          {(() => {
            const variable = "some_value";
            /* some code would be here */
          })()}
        </div>
      </div>
    `,
    errors: [{ messageId: 'noIifeInJsx' }],
  },
  {
    code: `
      <div>
        {(() => "immediate return")()}
      </div>
    `,
    errors: [{ messageId: 'noIifeInJsx' }],
  },
];

// Test cases for function expression IIFEs
const functionExpressionIifeCases = [
  {
    code: `
      <div>
        {(function() {
          const variable = "some_value";
          return <span>{variable}</span>;
        })()}
      </div>
    `,
    errors: [{ messageId: 'noIifeInJsx' }],
  },
  {
    code: `
      <div>
        {(function() {
          return "immediate return";
        })()}
      </div>
    `,
    errors: [{ messageId: 'noIifeInJsx' }],
  },
];

// Test cases for valid JSX expressions (not IIFEs)
const validJsxExpressionCases = [
  {
    code: `
      const MyComponent = () => {
        const value = "some_value";
        return <div>{value}</div>;
      };
    `,
  },
  {
    code: `
      const renderContent = () => {
        const variable = "some_value";
        return <span>{variable}</span>;
      };
      <div>{renderContent()}</div>
    `,
  },
  {
    code: `
      <div>{someFunction()}</div>
    `,
  },
  {
    code: `
      <div>{items.map(item => <span key={item}>{item}</span>)}</div>
    `,
  },
  {
    code: `
      <div>{useMemo(() => expensiveCalculation(), [deps])}</div>
    `,
  },
];

// Test cases for JSX attributes (should not trigger on non-JSX IIFEs)
const attributeCases = [
  {
    code: `
      const Component = () => {
        const config = (() => ({ value: 'test' }))();
        return <div>{config.value}</div>;
      };
    `,
  },
];

const TEST_CASES = {
  invalid: [...arrowFunctionIifeCases, ...functionExpressionIifeCases],
  valid: [...validJsxExpressionCases, ...attributeCases],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('no-iife-in-jsx', noIifeInJsx, TEST_CASES);
