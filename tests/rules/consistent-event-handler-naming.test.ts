import { RuleTester } from '@typescript-eslint/rule-tester';

import { consistentEventHandlerNaming } from '../../src/rules/consistent-event-handler-naming';

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

ruleTester.run('consistent-event-handler-naming', consistentEventHandlerNaming, {
  invalid: [
    // Internal event handlers with incorrect naming - missing "handle" prefix
    {
      code: `
        function Component() {
          const onClick = () => {};
          return <button onClick={onClick}>Click me</button>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'onClick',
            context: 'internal',
            expected: 'handleClick',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },

    // Internal event handlers with wrong prefix
    {
      code: `
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
      errors: [
        {
          data: {
            actual: 'clickHandler',
            context: 'internal',
            expected: 'handleClick',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'submitFn',
            context: 'internal',
            expected: 'handleSubmit',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },

    // Function declarations with incorrect naming
    {
      code: `
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
      errors: [
        {
          data: {
            actual: 'clickHandler',
            context: 'internal',
            expected: 'handleClick',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'onSubmit',
            context: 'internal',
            expected: 'handleSubmit',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },

    // useCallback with incorrect naming
    {
      code: `
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
      errors: [
        {
          data: {
            actual: 'clickCallback',
            context: 'internal',
            expected: 'handleClick',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'submitHandler',
            context: 'internal',
            expected: 'handleSubmit',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },

    // Event handler props with incorrect naming in interfaces
    {
      code: `
        interface ButtonProps {
          clickHandler: () => void;
          submitCallback: (e: Event) => void;
          inputChanged: (value: string) => void;
        }
        function Button({ clickHandler }: ButtonProps) {
          return <button onClick={clickHandler}>Click me</button>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'clickHandler',
            context: 'prop',
            expected: 'onClick',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'submitCallback',
            context: 'prop',
            expected: 'onSubmit',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'inputChanged',
            context: 'prop',
            expected: 'onInputChange',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },

    // Event handler props with incorrect naming in type aliases
    {
      code: `
        type FormProps = {
          submitHandler: (data: FormData) => void;
          cancelFn: () => void;
          validateCallback: (fields: string[]) => boolean;
        }
        function Form({ submitHandler }: FormProps) {
          return <form onSubmit={submitHandler}>Content</form>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'submitHandler',
            context: 'prop',
            expected: 'onSubmit',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'cancelFn',
            context: 'prop',
            expected: 'onCancel',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'validateCallback',
            context: 'prop',
            expected: 'onValidate',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },

    // Complex event handler scenarios with mixed incorrect naming
    {
      code: `
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
      errors: [
        {
          data: {
            actual: 'clickCallback',
            context: 'prop',
            expected: 'onClick',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'changeHandler',
            context: 'prop',
            expected: 'onChange',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'submitFn',
            context: 'internal',
            expected: 'handleSubmit',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'onFocus',
            context: 'internal',
            expected: 'handleFocus',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },

    // Edge cases with non-standard event names
    {
      code: `
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
      errors: [
        {
          data: {
            actual: 'dragEndCallback',
            context: 'internal',
            expected: 'handleDragEnd',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'mouseEnterFn',
            context: 'internal',
            expected: 'handleMouseEnter',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'keyPressHandler',
            context: 'internal',
            expected: 'handleKeyPress',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },

    // Event handlers with parameter patterns that indicate event handling
    {
      code: `
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
      errors: [
        {
          data: {
            actual: 'clickFn',
            context: 'internal',
            expected: 'handleClick',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'submitCallback',
            context: 'internal',
            expected: 'handleSubmit',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'changeHandler',
            context: 'internal',
            expected: 'handleChange',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },

    // Mixed arrow functions and function declarations
    {
      code: `
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
      errors: [
        {
          data: {
            actual: 'clickCallback',
            context: 'internal',
            expected: 'handleClick',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'submitHandler',
            context: 'internal',
            expected: 'handleSubmit',
          },
          messageId: 'incorrectHandlerNaming',
        },
        {
          data: {
            actual: 'onBlur',
            context: 'internal',
            expected: 'handleBlur',
          },
          messageId: 'incorrectHandlerNaming',
        },
      ],
    },
  ],

  valid: [
    // Internal event handlers with correct "handle" prefix
    {
      code: `
        function Component() {
          const handleClick = () => {};
          const handleSubmit = (e) => {};
          const handleInputChange = (e) => {};
          return <button onClick={handleClick}>Click me</button>;
        }
      `,
    },

    // Internal event handlers using function declarations
    {
      code: `
        function Component() {
          function handleClick() {}
          function handleSubmit(event) {}
          return <button onClick={handleClick}>Click me</button>;
        }
      `,
    },

    // Internal event handlers using useCallback
    {
      code: `
        function Component() {
          const handleClick = useCallback(() => {}, []);
          const handleSubmit = useCallback((e) => {}, []);
          return <button onClick={handleClick}>Click me</button>;
        }
      `,
    },

    // Event handler props with correct "on" prefix in interfaces
    {
      code: `
        interface ButtonProps {
          onClick: () => void;
          onSubmit: (e: Event) => void;
          onInputChange: (value: string) => void;
        }
        function Button({ onClick, onSubmit }: ButtonProps) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
    },

    // Event handler props with correct "on" prefix in type aliases
    {
      code: `
        type FormProps = {
          onSubmit: (data: FormData) => void;
          onCancel: () => void;
          onValidate: (fields: string[]) => boolean;
        }
        function Form({ onSubmit, onCancel }: FormProps) {
          return <form onSubmit={onSubmit}>Content</form>;
        }
      `,
    },

    // Event handlers passed as props with correct naming
    {
      code: `
        function Parent() {
          const handleChildClick = () => {};
          return <Child onClick={handleChildClick} />;
        }
      `,
    },

    // Non-event-handler functions should be ignored
    {
      code: `
        function Component() {
          const validateForm = () => {};
          const processData = (data) => {};
          const fetchUser = async (id) => {};
          return <div>Content</div>;
        }
      `,
    },

    // Utility functions should be ignored
    {
      code: `
        function utilFunction() {
          const clickCounter = () => {};
          const submitValidator = () => {};
          return true;
        }
      `,
    },

    // Event handlers in useEffect and other hooks (non-JSX context)
    {
      code: `
        function Component() {
          useEffect(() => {
            const clickListener = () => {};
            document.addEventListener('click', clickListener);
            return () => document.removeEventListener('click', clickListener);
          }, []);
          return <div>Content</div>;
        }
      `,
    },

    // Inline event handlers should be ignored
    {
      code: `
        function Component() {
          return <button onClick={() => {}}>Click me</button>;
        }
      `,
    },

    // Event handlers with proper naming in complex scenarios
    {
      code: `
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
      `,
    },
  ],
});
