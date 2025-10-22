import { RuleTester } from '@typescript-eslint/rule-tester';

import { consistentEventHandlerNaming } from '../../src/rules/consistent-event-handler-naming';
import { createValidCase, createEventHandlerInvalidCase, PARSER_CONFIG } from '../../src/utils/test-utils';

// Test cases for internal event handlers with missing "handle" prefix
const missingHandlePrefixCases = [
  createEventHandlerInvalidCase(
    `
      function Component() {
        const onClick = () => {};
        return <button onClick={onClick}>Click me</button>;
      }
    `,
    [{ actual: 'onClick', context: 'internal', expected: 'handleClick' }]
  ),
];

// Test cases for internal event handlers with wrong prefix patterns
const wrongPrefixPatternCases = [
  createEventHandlerInvalidCase(
    `
      function Component() {
        const clickHandler = () => {};
        const submitFn = () => {};
        return (
          <div>
            <button onClick={clickHandler}>Click me</button>
            <form onSubmit={submitFn}>Submit</form>
          </div>
        );
      }
    `,
    [
      { actual: 'clickHandler', context: 'internal', expected: 'handleClick' },
      { actual: 'submitFn', context: 'internal', expected: 'handleSubmit' },
    ]
  ),
];

// Test cases for function declarations with incorrect naming
const functionDeclarationCases = [
  createEventHandlerInvalidCase(
    `
      function Component() {
        function clickHandler() {}
        function onSubmit() {}
        return (
          <div>
            <button onClick={clickHandler}>Click me</button>
            <form onSubmit={onSubmit}>Submit</form>
          </div>
        );
      }
    `,
    [
      { actual: 'clickHandler', context: 'internal', expected: 'handleClick' },
      { actual: 'onSubmit', context: 'internal', expected: 'handleSubmit' },
    ]
  ),
];

// Test cases for useCallback with incorrect naming
const useCallbackCases = [
  createEventHandlerInvalidCase(
    `
      function Component() {
        const clickCallback = useCallback(() => {}, []);
        const submitHandler = useCallback((e) => {}, []);
        return (
          <div>
            <button onClick={clickCallback}>Click me</button>
            <form onSubmit={submitHandler}>Submit</form>
          </div>
        );
      }
    `,
    [
      { actual: 'clickCallback', context: 'internal', expected: 'handleClick' },
      { actual: 'submitHandler', context: 'internal', expected: 'handleSubmit' },
    ]
  ),
];

// Test cases for event handler props with incorrect naming in interfaces
const interfacePropCases = [
  createEventHandlerInvalidCase(
    `
      interface ButtonProps {
        clickHandler: () => void;
        submitCallback: (e: Event) => void;
        inputChanged: (value: string) => void;
      }
      function Button({ clickHandler }: ButtonProps) {
        return <button onClick={clickHandler}>Click me</button>;
      }
    `,
    [
      { actual: 'clickHandler', context: 'prop', expected: 'onClick' },
      { actual: 'submitCallback', context: 'prop', expected: 'onSubmit' },
      { actual: 'inputChanged', context: 'prop', expected: 'onInputChange' },
    ]
  ),
];

// Test cases for event handler props with incorrect naming in type aliases
const typeAliasPropCases = [
  createEventHandlerInvalidCase(
    `
      type FormProps = {
        submitHandler: (data: FormData) => void;
        cancelFn: () => void;
        validateCallback: (fields: string[]) => boolean;
      }
      function Form({ submitHandler }: FormProps) {
        return <form onSubmit={submitHandler}>Content</form>;
      }
    `,
    [
      { actual: 'submitHandler', context: 'prop', expected: 'onSubmit' },
      { actual: 'cancelFn', context: 'prop', expected: 'onCancel' },
      { actual: 'validateCallback', context: 'prop', expected: 'onValidate' },
    ]
  ),
];

// Test cases for complex scenarios with mixed incorrect naming
const mixedIncorrectNamingCases = [
  createEventHandlerInvalidCase(
    `
      interface ComponentProps {
        clickCallback: () => void;
        changeHandler: (value: string) => void;
      }
      
      function Component({ clickCallback, changeHandler }: ComponentProps) {
        const submitFn = () => {};
        const onFocus = () => {};
        
        return (
          <form onSubmit={submitFn}>
            <input onChange={changeHandler} onFocus={onFocus} />
            <button onClick={clickCallback}>Submit</button>
          </form>
        );
      }
    `,
    [
      { actual: 'clickCallback', context: 'prop', expected: 'onClick' },
      { actual: 'changeHandler', context: 'prop', expected: 'onChange' },
      { actual: 'submitFn', context: 'internal', expected: 'handleSubmit' },
      { actual: 'onFocus', context: 'internal', expected: 'handleFocus' },
    ]
  ),
];

// Test cases for non-standard event names
const nonStandardEventCases = [
  createEventHandlerInvalidCase(
    `
      function Component() {
        const dragEndCallback = () => {};
        const mouseEnterFn = () => {};
        const keyPressHandler = () => {};
        
        return (
          <div 
            onDragEnd={dragEndCallback}
            onMouseEnter={mouseEnterFn}
            onKeyPress={keyPressHandler}
          >
            Content
          </div>
        );
      }
    `,
    [
      { actual: 'dragEndCallback', context: 'internal', expected: 'handleDragEnd' },
      { actual: 'mouseEnterFn', context: 'internal', expected: 'handleMouseEnter' },
      { actual: 'keyPressHandler', context: 'internal', expected: 'handleKeyPress' },
    ]
  ),
];

// Test cases for event handlers with parameter patterns
const eventParameterPatternCases = [
  createEventHandlerInvalidCase(
    `
      function Component() {
        const clickFn = (event) => {};
        const submitCallback = (e) => {};
        const changeHandler = (evt) => {};
        
        return (
          <form onSubmit={submitCallback}>
            <input onChange={changeHandler} />
            <button onClick={clickFn}>Submit</button>
          </form>
        );
      }
    `,
    [
      { actual: 'clickFn', context: 'internal', expected: 'handleClick' },
      { actual: 'submitCallback', context: 'internal', expected: 'handleSubmit' },
      { actual: 'changeHandler', context: 'internal', expected: 'handleChange' },
    ]
  ),
];

// Test cases for mixed function types with incorrect naming
const mixedFunctionTypeCases = [
  createEventHandlerInvalidCase(
    `
      function Component() {
        const clickCallback = () => {};
        function submitHandler(e) {}
        const onBlur = useCallback(() => {}, []);
        
        return (
          <form onSubmit={submitHandler}>
            <input onBlur={onBlur} />
            <button onClick={clickCallback}>Submit</button>
          </form>
        );
      }
    `,
    [
      { actual: 'clickCallback', context: 'internal', expected: 'handleClick' },
      { actual: 'submitHandler', context: 'internal', expected: 'handleSubmit' },
      { actual: 'onBlur', context: 'internal', expected: 'handleBlur' },
    ]
  ),
];

// Test cases for internal event handlers with correct "handle" prefix
const correctHandlePrefixCases = [
  createValidCase(`
    function Component() {
      const handleClick = () => {};
      const handleSubmit = (e) => {};
      const handleInputChange = (e) => {};
      return <button onClick={handleClick}>Click me</button>;
    }
  `),
];

// Test cases for function declarations with correct naming
const correctFunctionDeclarationCases = [
  createValidCase(`
    function Component() {
      function handleClick() {}
      function handleSubmit(event) {}
      return <button onClick={handleClick}>Click me</button>;
    }
  `),
];

// Test cases for useCallback with correct naming
const correctUseCallbackCases = [
  createValidCase(`
    function Component() {
      const handleClick = useCallback(() => {}, []);
      const handleSubmit = useCallback((e) => {}, []);
      return <button onClick={handleClick}>Click me</button>;
    }
  `),
];

// Test cases for event handler props with correct "on" prefix in interfaces
const correctInterfacePropCases = [
  createValidCase(`
    interface ButtonProps {
      onClick: () => void;
      onSubmit: (e: Event) => void;
      onInputChange: (value: string) => void;
    }
    function Button({ onClick, onSubmit }: ButtonProps) {
      return <button onClick={onClick}>Click me</button>;
    }
  `),
];

// Test cases for event handler props with correct "on" prefix in type aliases
const correctTypeAliasPropCases = [
  createValidCase(`
    type FormProps = {
      onSubmit: (data: FormData) => void;
      onCancel: () => void;
      onValidate: (fields: string[]) => boolean;
    }
    function Form({ onSubmit, onCancel }: FormProps) {
      return <form onSubmit={onSubmit}>Content</form>;
    }
  `),
];

// Test cases for event handlers passed as props with correct naming
const correctPropPassingCases = [
  createValidCase(`
    function Parent() {
      const handleChildClick = () => {};
      return <Child onClick={handleChildClick} />;
    }
  `),
];

// Test cases for non-event-handler functions that should be ignored
const nonEventHandlerCases = [
  createValidCase(`
    function Component() {
      const validateForm = () => {};
      const processData = (data) => {};
      const fetchUser = async (id) => {};
      return <div>Content</div>;
    }
  `),
];

// Test cases for utility functions that should be ignored
const utilityFunctionCases = [
  createValidCase(`
    function utilFunction() {
      const clickCounter = () => {};
      const submitValidator = () => {};
      return true;
    }
  `),
];

// Test cases for event handlers in hooks (non-JSX context)
const hookEventHandlerCases = [
  createValidCase(`
    function Component() {
      useEffect(() => {
        const clickListener = () => {};
        document.addEventListener('click', clickListener);
        return () => document.removeEventListener('click', clickListener);
      }, []);
      return <div>Content</div>;
    }
  `),
];

// Test cases for inline event handlers that should be ignored
const inlineEventHandlerCases = [
  createValidCase(`
    function Component() {
      return <button onClick={() => {}}>Click me</button>;
    }
  `),
];

// Test cases for complex scenarios with proper naming
const complexCorrectNamingCases = [
  createValidCase(`
    function Component() {
      const handleButtonClick = useCallback(() => {}, []);
      const handleFormSubmit = (e) => { e.preventDefault(); };
      const handleInputChange = (e) => { setValue(e.target.value); };
      
      return (
        <form onSubmit={handleFormSubmit}>
          <input onChange={handleInputChange} />
          <button onClick={handleButtonClick}>Submit</button>
        </form>
      );
    }
  `),
];

const TEST_CASES = {
  invalid: [
    ...missingHandlePrefixCases,
    ...wrongPrefixPatternCases,
    ...functionDeclarationCases,
    ...useCallbackCases,
    ...interfacePropCases,
    ...typeAliasPropCases,
    ...mixedIncorrectNamingCases,
    ...nonStandardEventCases,
    ...eventParameterPatternCases,
    ...mixedFunctionTypeCases,
  ],
  valid: [
    ...correctHandlePrefixCases,
    ...correctFunctionDeclarationCases,
    ...correctUseCallbackCases,
    ...correctInterfacePropCases,
    ...correctTypeAliasPropCases,
    ...correctPropPassingCases,
    ...nonEventHandlerCases,
    ...utilityFunctionCases,
    ...hookEventHandlerCases,
    ...inlineEventHandlerCases,
    ...complexCorrectNamingCases,
  ],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('consistent-event-handler-naming', consistentEventHandlerNaming, TEST_CASES);
