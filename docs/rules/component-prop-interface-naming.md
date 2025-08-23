# component-prop-interface-naming

Enforce component prop interfaces follow ComponentNameProps naming convention.

## Rule Details

This rule enforces that all React component prop interfaces follow the specific naming convention `ComponentNameProps`, where `ComponentName` matches the exact name of the component. This improves code consistency, makes prop interfaces easily identifiable, and follows common React TypeScript conventions.

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
```

## Rule Coverage

This rule works with:

- **Function declarations**: `function ComponentName(props) { ... }`
- **Arrow function components**: `const ComponentName = (props) => { ... }`
- **Function expressions**: `const ComponentName = function(props) { ... }`
- **forwardRef components**: `forwardRef<RefType, PropsType>((props, ref) => { ... })`
- **Higher-order components**: Components wrapped in `memo`, `forwardRef`, etc.
- **Destructured props**: Both `({ prop1, prop2 }: PropsInterface)` and `(props: PropsInterface)`
- **TypeScript generics**: Handles forwardRef and other generic patterns

This rule does **not** apply to:

- Functions that don't start with a capital letter (non-components)
- Components without typed props
- Components with inline type annotations `({ prop }: { prop: string })`
- Non-TypeScript codebases

## Options

This rule has no options.
