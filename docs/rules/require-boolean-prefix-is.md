# require-boolean-prefix-is

Enforce boolean variables, state, and props to start with "is" prefix (or custom prefixes) in developer-controlled contexts.

## Rule Details

This rule enforces that boolean identifiers must start with a specified prefix (default: `is`) to improve code readability and make boolean values immediately identifiable. The rule has been designed to only check contexts where developers have full control over naming, avoiding false positives from third-party APIs, libraries, and components.

The rule **only applies** to code that the developer writes and controls:

### What is Checked ✅

- **React component parameters**: Boolean parameters in React components (functions starting with capital letters)
- **Custom hook parameters**: Boolean parameters in custom hooks (functions starting with "use" + capital letter)
- **useState variables**: React state variables with boolean initial values
- **Interface and type properties**: Boolean properties in standalone interfaces and types
- **Variable declarations**: Variables with boolean values or explicit boolean type annotations
- **Object properties**: Boolean properties in object literals (variable assignments only, not function calls)
- **Class properties**: Boolean class properties with values or type annotations

### What is NOT Checked ❌

- **JSX prop names**: Boolean props passed to components in JSX syntax
- **Third-party function calls**: Arguments passed to any function calls
- **Non-React function parameters**: Parameters of functions that don't follow React component/hook naming
- **General utility functions**: Regular functions that don't start with capital letters or "use"

This targeted approach eliminates false positives while maintaining strict enforcement within your own component and hook definitions.

## Options

This rule accepts an options object with the following property:

- `allowedPrefixes` (string[], default: `["is"]`): Array of allowed prefixes for boolean identifiers

### Configuration Examples

```json
// Default usage (requires "is" prefix)
"react-snob/require-boolean-prefix-is": "error"

// Custom single prefix
"react-snob/require-boolean-prefix-is": ["error", {
  "allowedPrefixes": ["has"]
}]

// Multiple allowed prefixes
"react-snob/require-boolean-prefix-is": ["error", {
  "allowedPrefixes": ["is", "has", "should", "can"]
}]
```

## Examples

### ❌ Incorrect Code

```jsx
// Variables with boolean values
const visible = true;
const disabled = false;
let loading = true;

// React useState without proper prefix
const [open, setOpen] = useState(false);
const [active, setActive] = useState(true);

// Interface properties
interface ButtonProps {
  disabled: boolean;
  visible: boolean;
  onClick: () => void;
}

// React component parameters
function MyComponent({ visible }: { visible: boolean }) {
  return <div>{visible}</div>;
}

// Custom hook parameters
function useToggle({ enabled }: { enabled: boolean }) {
  return enabled;
}

// Object properties with boolean values
const config = {
  settings: {
    enabled: true,
    visible: false,
  },
};

// Class properties
class MyComponent extends React.Component {
  loading: boolean = false;
  visible = true;
}
```

### ✅ Correct Code

```jsx
// Variables with proper "is" prefix
const isVisible = true;
const isDisabled = false;
let isLoading = true;

// React useState with proper prefix
const [isOpen, setIsOpen] = useState(false);
const [isActive, setIsActive] = useState(true);

// Interface properties with proper prefix
interface ButtonProps {
  isDisabled: boolean;
  isVisible: boolean;
  onClick: () => void;
}

// React component parameters with proper prefix
function MyComponent({ isVisible }: { isVisible: boolean }) {
  return <div>{isVisible}</div>;
}

// Custom hook parameters with proper prefix
function useToggle({ isEnabled }: { isEnabled: boolean }) {
  return isEnabled;
}

// Object properties with proper prefix
const config = {
  settings: {
    isEnabled: true,
    isVisible: false,
  },
};

// Class properties with proper prefix
class MyComponent extends React.Component {
  isLoading: boolean = false;
  isVisible = true;
}

// JSX props are NOT checked (no errors)
<Component disabled={true} visible={false} />
<Button enabled={enabled} loading={loading} />

// Function call arguments are NOT checked (no errors)
someFunction({ active: true, enabled: false });
api.call({ visible: true, disabled: false });

// Non-React function parameters are NOT checked (no errors)
function utilityFunction({ visible }: { visible: boolean }) {
  return visible;
}

const helperFn = ({ disabled }: { disabled: boolean }) => {
  return !disabled;
};

// Non-boolean variables are ignored
const loading = 'in-progress';
const disabled = 0;
const visible = 'block';

// Constants with "IS_" prefix
const CONFIG = {
  API_URL: 'https://example.com',
  IS_DEVELOPMENT: false,
  IS_ENABLED: true,
  MAX_RETRIES: 3,
};
```

### Custom Prefix Examples

```jsx
// With allowedPrefixes: ["has", "can", "should"]

// ❌ Incorrect
const visible = true;
const enabled = false;

// ✅ Correct
const hasPermission = true;
const canEdit = false;
const shouldRender = true;
```

## Special Cases and Exceptions

### Zod Schema Methods

The rule makes an exception for Zod schema `.omit()` and `.pick()` method calls, where boolean values indicate property inclusion/exclusion rather than actual boolean data:

```jsx
// ✅ Allowed: Zod .omit() and .pick() methods
const schema = userSchema.omit({
  createdAt: true, // OK - indicates property should be omitted
  updatedAt: false, // OK - indicates property should be included
});

const basicSchema = userSchema.pick({
  name: true, // OK - indicates property should be picked
  email: true, // OK - indicates property should be picked
});
```

### Constructor Calls

Properties in constructor calls (new expressions) are not checked:

```jsx
// ✅ Not checked
const client = new Realtime({ disabled: true });
const instance = new SomeClass({ enabled: false, visible: true });
```

### Nullish Coalescing Operator

Variables using nullish coalescing with non-boolean values are correctly ignored:

```jsx
// ✅ Not flagged (non-boolean values)
const title = userTitle ?? 'Default Title';
const count = userCount ?? 0;
const _breakpoint = breakpoint ?? 'mobile';
```

## When Not To Use It

You might want to disable this rule if:

- Your project uses different boolean naming conventions (like `has`, `can`, `should` exclusively)
- You're working extensively with third-party APIs that use different patterns (though this rule now avoids most such conflicts)
- Your team prefers not to enforce boolean naming conventions

However, consistent boolean naming significantly improves code readability and is a widely accepted convention in the React community.

## Related Rules

- `@typescript-eslint/naming-convention` - For more general naming convention enforcement
- `react-hooks/exhaustive-deps` - Ensures useState dependencies are properly tracked
