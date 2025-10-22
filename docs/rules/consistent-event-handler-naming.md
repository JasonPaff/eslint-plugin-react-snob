# consistent-event-handler-naming

Enforce consistent naming patterns for event handlers based on their context.

## Rule Details

This rule enforces that event handlers use appropriate prefixes based on where they are defined and used. Internal event handler functions within React components must use the `handle` prefix (e.g., `handleClick`, `handleSubmit`), while event handler props passed to components must use the `on` prefix (e.g., `onClick`, `onSubmit`). This improves code readability, makes the purpose of functions immediately clear, and follows established React conventions for event handling patterns.

The rule automatically detects functions used as event handlers by analyzing their usage in JSX event attributes, their parameter signatures (functions with parameters named `e`, `event`, or `evt`), and their naming patterns. For TypeScript interfaces and type definitions, it ensures callback function properties follow the `on` prefix convention.

Examples of **incorrect** code for this rule:

```tsx
// ❌ Internal event handlers should use "handle" prefix
function Component() {
  const onClick = () => {
    console.log('Button clicked');
  };

  const submitCallback = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  const clickHandler = () => {
    console.log('Another click');
  };

  return (
    <form onSubmit={submitCallback}>
      <button onClick={onClick}>Click me</button>
      <button onClick={clickHandler}>Or me</button>
    </form>
  );
}

// ❌ Function declarations with incorrect naming
function Component() {
  function clickHandler() {
    console.log('Clicked');
  }

  function onSubmit(e) {
    e.preventDefault();
  }

  return (
    <form onSubmit={onSubmit}>
      <button onClick={clickHandler}>Submit</button>
    </form>
  );
}

// ❌ useCallback with incorrect naming
function Component() {
  const clickCallback = useCallback(() => {
    console.log('Clicked');
  }, []);

  const submitHandler = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <form onSubmit={submitHandler}>
      <button onClick={clickCallback}>Submit</button>
    </form>
  );
}

// ❌ Interface properties should use "on" prefix
interface ButtonProps {
  clickHandler: () => void;
  submitCallback: (e: Event) => void;
  inputChanged: (value: string) => void;
}

function Button({ clickHandler, submitCallback }: ButtonProps) {
  return (
    <form onSubmit={submitCallback}>
      <button onClick={clickHandler}>Submit</button>
    </form>
  );
}

// ❌ Type alias properties with incorrect naming
type FormProps = {
  submitHandler: (data: FormData) => void;
  cancelFn: () => void;
  validateCallback: (fields: string[]) => boolean;
};

function Form({ submitHandler }: FormProps) {
  return <form onSubmit={submitHandler}>Content</form>;
}

// ❌ Event handlers detected by parameter names
function Component() {
  const clickFn = (event) => {
    console.log('Clicked:', event.target);
  };

  const submitCallback = (e) => {
    e.preventDefault();
  };

  const changeHandler = (evt) => {
    console.log('Changed:', evt.target.value);
  };

  return (
    <form onSubmit={submitCallback}>
      <input onChange={changeHandler} />
      <button onClick={clickFn}>Submit</button>
    </form>
  );
}

// ❌ Functions used in JSX event attributes
function Component() {
  const dragEndCallback = () => {};
  const mouseEnterFn = () => {};
  const keyPressHandler = () => {};

  return (
    <div onDragEnd={dragEndCallback} onMouseEnter={mouseEnterFn} onKeyPress={keyPressHandler}>
      Content
    </div>
  );
}
```

Examples of **correct** code for this rule:

```tsx
// ✅ Correct "handle" prefix for internal event handlers
function Component() {
  const handleClick = () => {
    console.log('Button clicked');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleInputChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}

// ✅ Correct naming for function declarations
function Component() {
  function handleClick() {
    console.log('Clicked');
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}

// ✅ Correct naming with useCallback
function Component() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
    },
    [dependency]
  );

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}

// ✅ Correct "on" prefix for interface properties
interface ButtonProps {
  onClick: () => void;
  onSubmit: (e: Event) => void;
  onInputChange: (value: string) => void;
}

function Button({ onClick, onSubmit }: ButtonProps) {
  return (
    <form onSubmit={onSubmit}>
      <button onClick={onClick}>Submit</button>
    </form>
  );
}

// ✅ Correct naming for type alias properties
type FormProps = {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  onValidate: (fields: string[]) => boolean;
};

function Form({ onSubmit, onCancel }: FormProps) {
  return <form onSubmit={onSubmit}>Content</form>;
}

// ✅ Complex event handler scenarios
function Component() {
  const handleButtonClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input onChange={handleInputChange} />
      <button onClick={handleButtonClick}>Submit</button>
    </form>
  );
}

// ✅ Functions that don't look like event handlers are ignored
function Component() {
  const validateForm = () => {
    return true;
  };

  const processData = (data) => {
    return processedData;
  };

  const fetchUser = async (id) => {
    return await api.getUser(id);
  };

  return <div>Content</div>;
}

// ✅ Event handlers in utility functions are ignored
function utilFunction() {
  const clickCounter = () => {
    return count++;
  };

  const submitValidator = () => {
    return isValid;
  };

  return { clickCounter, submitValidator };
}

// ✅ Inline event handlers are ignored
function Component() {
  return <button onClick={() => console.log('Clicked')}>Click me</button>;
}

// ✅ Event listeners in useEffect are ignored
function Component() {
  useEffect(() => {
    const clickListener = () => {
      console.log('Document clicked');
    };

    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }, []);

  return <div>Content</div>;
}
```

## Event Handler Detection

The rule identifies event handlers through multiple methods:

### 1. JSX Event Attribute Usage

Functions used in JSX event attributes are automatically detected as event handlers:

```tsx
// These functions will be flagged if they don't use "handle" prefix
const clickFn = () => {};
const submitCallback = () => {};

<button onClick={clickFn}>Click</button>
<form onSubmit={submitCallback}>Submit</form>
```

### 2. Parameter Signature Analysis

Functions with parameters that suggest event handling:

```tsx
// Functions with event-like parameters are detected
const someFunction = (e) => {}; // Parameter named 'e'
const anotherFunction = (event) => {}; // Parameter named 'event'
const thirdFunction = (evt) => {}; // Parameter named 'evt'
```

### 3. Naming Pattern Recognition

Functions with names that follow event handler patterns:

```tsx
// These naming patterns are automatically detected
const clickHandler = () => {}; // Ends with "Handler"
const submitCallback = () => {}; // Ends with "Callback"
const changeFn = () => {}; // Ends with "Fn"
const onSomething = () => {}; // Starts with "on" + uppercase letter
const handleSomething = () => {}; // Starts with "handle" + uppercase letter
```

### 4. TypeScript Interface Analysis

Interface and type properties that represent function callbacks:

```tsx
interface ComponentProps {
  // Function type properties are checked
  onClick: () => void; // TSFunctionType
  onSubmit: (e: Event) => void; // TSFunctionType
  callback: () => void; // Any function-type property
}
```

## Rule Coverage

This rule works with:

- **Function declarations**: `function handleClick() { ... }`
- **Arrow function expressions**: `const handleClick = () => { ... }`
- **Function expressions**: `const handleClick = function() { ... }`
- **useCallback hooks**: `const handleClick = useCallback(() => { ... }, [])`
- **JSX event attributes**: Any function used in `onClick`, `onSubmit`, etc.
- **TypeScript interfaces**: `interface Props { onClick: () => void }`
- **Type aliases**: `type Props = { onClick: () => void }`
- **Method signatures**: Function properties in interfaces
- **Event parameter detection**: Functions with `(e)`, `(event)`, `(evt)` parameters
- **Complex JSX events**: `onDragEnd`, `onMouseEnter`, `onKeyPress`, etc.

This rule does **not** apply to:

- **Inline event handlers**: `onClick={() => {}}`
- **Non-component functions**: Functions not in React component context
- **Utility functions**: Functions that don't appear to be event handlers
- **Event listeners in useEffect**: DOM event listeners in hooks
- **Functions without event-like signatures**: Regular utility functions

## Naming Conventions

### Internal Event Handlers (use `handle` prefix)

```tsx
// ✅ Correct internal handler naming
const handleClick = () => {};
const handleSubmit = () => {};
const handleInputChange = () => {};
const handleDragEnd = () => {};
const handleMouseEnter = () => {};
```

### Event Handler Props (use `on` prefix)

```tsx
// ✅ Correct prop handler naming
interface ComponentProps {
  onClick: () => void;
  onSubmit: (e: Event) => void;
  onInputChange: (value: string) => void;
  onDragEnd: () => void;
  onMouseEnter: () => void;
}
```

### Past Tense Event Names

The rule automatically converts past-tense event names to present tense:

```tsx
// ❌ Past tense naming
inputChanged -> onInputChange  // "Changed" becomes "Change"
buttonClicked -> onButtonClick // "Clicked" becomes "Click"
keyPressed -> onKeyPress      // "Pressed" becomes "Press"

// ✅ Present tense naming (preferred)
onChange, onClick, onPress
```

## Options

This rule has no options.
