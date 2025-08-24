# require-boolean-prefix-is

Enforce boolean variables, state, and props to start with "is" prefix (or "IS\_" for constants).

## Rule Details

This rule enforces that all boolean variables, state variables, and props must start with the prefix `is` (or `IS_` for uppercase constants). This naming convention improves code readability and makes boolean values immediately identifiable. By requiring consistent naming for boolean identifiers, the rule helps developers quickly understand the purpose and type of variables, leading to more maintainable and self-documenting code.

The rule recognizes two valid prefixes:

- `is` followed by a capital letter for regular variables (e.g., `isVisible`, `isEnabled`)
- `IS_` for uppercase constant naming (e.g., `IS_DELETED`, `IS_FEATURED`)

The rule applies to:

- Variable declarations with boolean values or types
- React `useState` hooks with boolean initial values
- Interface and type alias properties with boolean types
- Function parameters with boolean types (in React components)
- Object properties with boolean values
- Class properties with boolean values or types

## Exception: Zod Schema Methods

The rule makes a special exception for Zod schema `.omit()` and `.pick()` method calls. When using these Zod utilities, boolean values in the property selection objects are not required to follow the "is" prefix convention. This is because these boolean values represent whether to include/exclude properties in the schema transformation, not actual boolean data values.

```jsx
// ✅ Exception: Zod .omit() and .pick() methods
const schema = userSchema.omit({
  createdAt: true,    // OK - indicates property should be omitted
  updatedAt: false,   // OK - indicates property should be included
});
```

This exception only applies to object properties directly within `.omit()` and `.pick()` method calls. Regular object properties and boolean variables elsewhere in the code must still follow the "is" prefix convention.

Examples of **incorrect** code for this rule:

```jsx
// ❌ Boolean variables without "is" prefix
const visible = true;
const disabled = false;
let loading = true;
```

```jsx
// ❌ React useState without "is" prefix
const [open, setOpen] = useState(false);
const [active, setActive] = useState(true);
```

```jsx
// ❌ Interface properties without "is" prefix
interface ButtonProps {
  disabled: boolean;
  visible: boolean;
  onClick: () => void;
}
```

```jsx
// ❌ Type alias properties without "is" prefix
type ModalProps = {
  open: boolean;
  closable: boolean;
};
```

```jsx
// ❌ Component props without "is" prefix
function Button({ disabled }: { disabled: boolean }) {
  return <button disabled={disabled}>Click</button>;
}
```

```jsx
// ❌ Arrow function parameters without "is" prefix
const handleToggle = (enabled: boolean) => {
  console.log(enabled);
};
```

```jsx
// ❌ Object properties with boolean values
const config = {
  settings: {
    enabled: true,
    visible: false,
  },
};
```

```jsx
// ❌ Class component state without "is" prefix
class MyComponent extends React.Component {
  state = {
    loading: false,
    visible: true,
  };
}
```

```jsx
// ❌ forwardRef with boolean props
interface InputProps {
  disabled: boolean;
  readOnly: boolean;
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ disabled, readOnly }, ref) => <input ref={ref} disabled={disabled} readOnly={readOnly} />
);
```

```jsx
// ❌ Constants without "IS_" prefix
const SETTINGS = {
  ENABLED: true,
  VISIBLE: false,
  DEBUG_MODE: true,
};

export const APP_CONFIG = {
  API_ENDPOINT: 'https://api.example.com',
  FEATURE_ENABLED: true,
  DEBUG: false,
  VERSION: '1.0.0',
  PRODUCTION_MODE: false,
} as const;
```

Examples of **correct** code for this rule:

```jsx
// ✅ Boolean variables with "is" prefix
const isVisible = true;
const isDisabled = false;
let isLoading = true;
```

```jsx
// ✅ React useState with "is" prefix
const [isOpen, setIsOpen] = useState(false);
const [isActive, setIsActive] = useState(true);
```

```jsx
// ✅ Interface properties with "is" prefix
interface ButtonProps {
  isDisabled: boolean;
  isVisible: boolean;
  onClick: () => void;
}
```

```jsx
// ✅ Type alias properties with "is" prefix
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
```

```jsx
// ✅ Component props with "is" prefix
function Button({ isDisabled }: { isDisabled: boolean }) {
  return <button disabled={isDisabled}>Click</button>;
}
```

```jsx
// ✅ Arrow function parameters with "is" prefix
const handleToggle = (isEnabled: boolean) => {
  if (isEnabled) {
    console.log('Enabled');
  }
};
```

```jsx
// ✅ Object properties with "is" prefix for boolean values
const config = {
  settings: {
    isEnabled: true,
    isVisible: false,
  },
};
```

```jsx
// ✅ Class component state with "is" prefix
class MyComponent extends React.Component {
  state = {
    isLoading: false,
    isVisible: true,
  };
}
```

```jsx
// ✅ forwardRef with properly named boolean props
interface InputProps {
  isDisabled: boolean;
  isReadOnly: boolean;
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isDisabled, isReadOnly }, ref) => <input ref={ref} disabled={isDisabled} readOnly={isReadOnly} />
);
```

```jsx
// ✅ Complex boolean expressions with "is" prefix
const isReady = isLoaded && !isError;
const isComplete = isValid && isSubmitted;
```

```jsx
// ✅ Optional boolean properties with "is" prefix
interface ComponentProps {
  isDisabled?: boolean;
  isVisible?: boolean;
}
```

```jsx
// ✅ Union types with boolean and "is" prefix
interface Props {
  isActive: boolean | undefined;
  isLoading: boolean | null;
}
```

```jsx
// ✅ Non-boolean variables are ignored
const loading = 'in-progress';
const disabled = 0;
const visible = 'block';
const count = useState(0);
const name = useState('');
```

```jsx
// ✅ Non-component functions are ignored for parameters
function utilityFunction(enabled: boolean, disabled: boolean) {
  return enabled && !disabled;
}
```

```jsx
// ✅ Constants with "IS_" prefix
export const BOBBLEHEAD_DEFAULTS = {
  COMMENT_COUNT: 0,
  CURRENT_CONDITION: 'excellent',
  IS_DELETED: false,
  IS_FEATURED: false,
  IS_PUBLIC: true,
  LIKE_COUNT: 0,
  SORT_ORDER: 0,
  STATUS: 'owned',
  VIEW_COUNT: 0,
} as const;

const CONFIG = {
  API_URL: 'https://example.com',
  IS_DEVELOPMENT: false,
  IS_ENABLED: true,
  MAX_RETRIES: 3,
  IS_DEBUG_MODE: false,
};

const FLAGS = {
  IS_FEATURE_A_ENABLED: true,
  IS_FEATURE_B_ENABLED: false,
  IS_BETA_USER: true,
};
```

```jsx
// ✅ Destructuring non-boolean values
const { loading, error } = api;
const loading = someFunction();
```

```jsx
// ✅ Zod schema .omit() and .pick() methods (exception)
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  isActive: z.boolean(),
});

// Boolean values in .omit() and .pick() are allowed without "is" prefix
const publicUserSchema = userSchema.omit({
  isActive: true,      // ✅ Allowed in .omit()
  createdAt: true,     // ✅ Allowed in .omit()  
});

const basicUserSchema = userSchema.pick({
  name: true,          // ✅ Allowed in .pick()
  email: true,         // ✅ Allowed in .pick()
  updatedAt: false,    // ✅ Allowed in .pick()
});

// Complex Zod transformations are also allowed
const transformedSchema = baseSchema
  .omit({ metadata: true })
  .pick({ 
    name: true,
    isActive: true,
    createdAt: false,
  });
```

## Options

This rule has no options.

## When Not To Use It

You might want to disable this rule if:

- Your project has different established naming conventions for boolean values
- You're working with external APIs or libraries that use different boolean naming patterns
- You prefer a different boolean naming convention (like `has`, `can`, `should`, etc.)

However, consider that consistent boolean naming with the `is` prefix significantly improves code readability and is a widely accepted convention in the React community.

## Related Rules

- `@typescript-eslint/naming-convention` - For more general naming convention enforcement
- `react-hooks/exhaustive-deps` - Ensures useState dependencies are properly tracked
