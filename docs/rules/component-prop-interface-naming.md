# component-prop-interface-naming

Enforce component prop interfaces follow ComponentNameProps naming convention.

## Rule Details

This rule enforces that all React component prop interfaces follow the specific naming convention `ComponentNameProps`, where `ComponentName` matches the exact name of the component. For components with names ending in "Component" or "FunctionComponent", the rule accepts both the full component name (e.g., `MyFunctionComponentProps`) and the base name (e.g., `MyProps`) for flexibility. This improves code consistency, makes prop interfaces easily identifiable, and follows common React TypeScript conventions.

Examples of **incorrect** code for this rule:

```tsx
// ❌ Interface name doesn't follow ComponentNameProps pattern
interface ButtonOptions {
  onClick: () => void;
  disabled?: boolean;
}
function Button({ onClick, disabled }: ButtonOptions) {
  return <button onClick={onClick} disabled={disabled}>Click me</button>;
}

// ❌ Interface name has wrong component name
interface ComponentProps {
  title: string;
}
function Header({ title }: ComponentProps) {
  return <h1>{title}</h1>;
}

// ❌ Arrow function component with incorrect naming
interface CardData {
  title: string;
  content: string;
}
const Card = ({ title, content }: CardData) => (
  <div>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

// ❌ forwardRef component with incorrect naming
interface InputConfig {
  placeholder: string;
  type?: string;
}
const Input = forwardRef<HTMLInputElement, InputConfig>(
  ({ placeholder, type }, ref) => (
    <input ref={ref} placeholder={placeholder} type={type} />
  )
);

// ❌ TypeScript generic type annotation with wrong naming
interface DogPenOptions {  // Should be DogPenProps or DogPenFunctionComponentProps
  name: string;
}
const DogPenFunctionComponent: FunctionComponent<DogPenOptions> = ({ name }) => (
  <div>{name}</div>
);

// ❌ Complex nested generic with incorrect props interface
interface UserSettings {  // Should be UserComponentProps or UserProps
  id: number;
}
const UserComponent: FunctionComponent<ChildWrapper<UserSettings>> = ({ id }) => (
  <div>User {id}</div>
);
```

Examples of **correct** code for this rule:

```tsx
// ✅ Correct interface naming for function component
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}
function Button({ onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>Click me</button>;
}

// ✅ Correct interface naming for arrow function component
interface CardProps {
  title: string;
  content: string;
}
const Card = ({ title, content }: CardProps) => (
  <div>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

// ✅ Correct interface naming for forwardRef component
interface InputProps {
  placeholder: string;
  type?: string;
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, type }, ref) => (
    <input ref={ref} placeholder={placeholder} type={type} />
  )
);

// ✅ Complex component names work correctly
interface FileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  files: string[];
}
function FileDrawer({ isOpen, onClose, files }: FileDrawerProps) {
  return isOpen ? (
    <div onClick={onClose}>
      {files.map(file => <div key={file}>{file}</div>)}
    </div>
  ) : null;
}

// ✅ Components with no props are ignored
function SimpleComponent() {
  return <div>No props needed</div>;
}

// ✅ Components wrapped in higher-order components
interface MemoComponentProps {
  value: string;
}
const MemoComponent = memo(({ value }: MemoComponentProps) => (
  <div>{value}</div>
));

// ✅ TypeScript generic type annotations
interface DogPenProps {
  name: string;
}
const DogPenFunctionComponent: FunctionComponent<DogPenProps> = ({ name }) => (
  <div>{name}</div>
);

// ✅ Flexible naming for components ending in "Component"
interface UserProps {  // Acceptable for UserComponent
  id: number;
}
function UserComponent({ id }: UserProps) {
  return <div>User {id}</div>;
}

// ✅ Also acceptable: full component name
interface UserComponentProps {  // Also acceptable for UserComponent
  id: number;
}
function UserComponent({ id }: UserComponentProps) {
  return <div>User {id}</div>;
}

// ✅ Complex nested generic types
interface MyComponentProps {
  title: string;
}
const MyComponent: FunctionComponent<ChildWrapper<MyComponentProps>> = ({ title }) => (
  <div>{title}</div>
);
```

## Naming Convention Details

### Basic Convention
The rule enforces that prop interfaces follow the pattern `ComponentNameProps` where `ComponentName` matches the component's exact name.

### Flexible Naming for Components Ending in "Component"
For components with names ending in "Component" or "FunctionComponent", the rule accepts two naming patterns:

1. **Full component name**: `MyFunctionComponentProps` for component `MyFunctionComponent`
2. **Base component name**: `MyProps` for component `MyFunctionComponent`

This flexibility accommodates different coding styles while maintaining consistency.

### TypeScript Generic Type Support
The rule handles various TypeScript generic patterns:

- **Direct generic annotation**: `FunctionComponent<PropsInterface>`
- **Nested generics**: `FunctionComponent<Wrapper<PropsInterface>>`
- **forwardRef generics**: `forwardRef<Element, PropsInterface>`

When analyzing nested generics, the rule searches for interfaces ending in common suffixes (Props, Options, Config, Settings) and validates against the expected naming pattern.

## Rule Coverage

This rule works with:

- **Function declarations**: `function ComponentName({ prop }: ComponentNameProps) { ... }`
- **Arrow function components**: `const ComponentName = ({ prop }: ComponentNameProps) => { ... }`
- **Function expressions**: `const ComponentName = function({ prop }: ComponentNameProps) { ... }`
- **forwardRef components**: `forwardRef<RefType, PropsType>((props, ref) => { ... })`
- **forwardRef with generics**: `forwardRef<HTMLElement, ComponentProps>(...)`
- **Higher-order components**: Components wrapped in `memo`, `forwardRef`, etc.
- **TypeScript generic type annotations**: `const Component: FunctionComponent<PropsType> = ...`
- **Complex nested generic types**: `FunctionComponent<Wrapper<PropsType>>` and similar patterns
- **Flexible component naming**: Accepts both `ComponentProps` and `ComponentFunctionComponentProps` for components ending in "Component"
- **Multiple interface suffix detection**: Recognizes Props, Options, Config, and Settings suffixes in nested generics

This rule does **not** apply to:

- Functions that don't start with a capital letter (non-components)
- Components without typed props or type annotations
- Components with inline type annotations `({ prop }: { prop: string })`
- Components that use type aliases directly in parameters without interface/type declarations
- Non-TypeScript codebases (`.js`, `.jsx` files)

## Options

This rule has no options.
