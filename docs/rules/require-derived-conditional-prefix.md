# require-derived-conditional-prefix

Enforce derived conditional variables used in JSX to start with underscore prefix.

## Rule Details

This rule enforces that variables containing derived boolean expressions used for JSX conditional rendering must start with an underscore (`_`) prefix. This naming convention helps distinguish between simple boolean state/props (which should use the `is` prefix) and complex derived conditional variables that combine multiple conditions for rendering logic.

The rule specifically targets variables that:

1. Are assigned expressions with logical operators (`&&`, `||`) or derived boolean expressions (comparisons, negations)
2. Are used in JSX conditional rendering contexts such as:
   - Logical AND expressions: `{variable && <Component />}`
   - Ternary operators: `{variable ? <ComponentA /> : <ComponentB />}`
   - Custom conditional components: `<Conditional condition={variable}>`

This distinction improves code readability by making it immediately clear when a variable represents derived conditional logic versus simple boolean state.

Examples of **incorrect** code for this rule:

```jsx
// ❌ Derived conditional variable without underscore prefix
const isSubmitReady = isValid && !isLoading;
return <div>{isSubmitReady && <button>Submit</button>}</div>;
```

```jsx
// ❌ Logical OR expression used in conditional rendering
const hasError = error || validationError;
return <div>{hasError && <ErrorMessage />}</div>;
```

```jsx
// ❌ Complex logical expression used in ternary
const canProceed = isAuthenticated && isVerified && !isBanned;
return (
  <Conditional condition={canProceed}>
    <NextStep />
  </Conditional>
);
```

```jsx
// ❌ Comparison expression used in conditional rendering
const isCompleteProfile = user.progress === 100;
return <div>{isCompleteProfile && <CompleteProfileBanner />}</div>;
```

```jsx
// ❌ Negation expression with logical operators
const hasNoResults = !results || results.length === 0;
return <div>{hasNoResults ? <EmptyState /> : <ResultsList />}</div>;
```

```jsx
// ❌ Double negation with logical operators
const isCompleteProfile = !!user.name && !!user.email;
return isCompleteProfile ? <CompleteView /> : <IncompleteView />;
```

```jsx
// ❌ Multiple derived variables in same component
const showWarning = isExpired || hasIssues;
const canSubmit = isValid && !isLoading;
return (
  <div>
    {showWarning && <Warning />}
    {canSubmit && <button>Submit</button>}
  </div>
);
```

```jsx
// ❌ Arrow function component with derived conditional
const Component = () => {
  const shouldRender = isVisible && hasPermission;
  return <div>{shouldRender && <SecureContent />}</div>;
};
```

```jsx
// ❌ Function declaration component with complex expression
function Component() {
  const readyToShow = isLoaded && !isError && hasData;
  return <div>{readyToShow ? <Content /> : <Loading />}</div>;
}
```

```jsx
// ❌ forwardRef component with derived conditional
const Input = forwardRef(() => {
  const showError = hasError && !isLoading;
  return <div>{showError && <ErrorText />}</div>;
});
```

```jsx
// ❌ Complex data validation with property access
const hasValidData = data && data.length > 0 && !data.hasError;
return <div>{hasValidData ? <DataTable /> : <EmptyState />}</div>;
```

Examples of **correct** code for this rule:

```jsx
// ✅ Derived conditional variable with underscore prefix
const _isSubmitReady = isValid && !isLoading;
return <div>{_isSubmitReady && <button>Submit</button>}</div>;
```

```jsx
// ✅ Logical OR expression with underscore prefix
const _hasError = error || validationError;
return <div>{_hasError && <ErrorMessage />}</div>;
```

```jsx
// ✅ Complex logical expression with underscore prefix
const _canProceed = isAuthenticated && isVerified && !isBanned;
return (
  <Conditional condition={_canProceed}>
    <NextStep />
  </Conditional>
);
```

```jsx
// ✅ Comparison expression with underscore prefix
const _isCompleteProfile = user.progress === 100;
return <div>{_isCompleteProfile && <CompleteProfileBanner />}</div>;
```

```jsx
// ✅ Negation expression with underscore prefix
const _hasNoResults = !results || results.length === 0;
return <div>{_hasNoResults ? <EmptyState /> : <ResultsList />}</div>;
```

```jsx
// ✅ Double negation with underscore prefix
const _isCompleteProfile = !!user.name && !!user.email;
return _isCompleteProfile ? <CompleteView /> : <IncompleteView />;
```

```jsx
// ✅ Simple boolean state/props with "is" prefix (not derived)
const isVisible = true;
return <div>{isVisible && <span>Content</span>}</div>;
```

```jsx
// ✅ React useState with "is" prefix (simple boolean state)
const [isOpen, setIsOpen] = useState(false);
return <div>{isOpen ? <Modal /> : null}</div>;
```

```jsx
// ✅ Arrow function component with properly named derived conditional
const Component = () => {
  const _showWarning = isExpired || hasIssues;
  return <div>{_showWarning && <Warning />}</div>;
};
```

```jsx
// ✅ forwardRef component with properly named derived conditional
const Component = forwardRef(() => {
  const _isReady = isLoaded && !isError;
  return <div>{_isReady && <Content />}</div>;
});
```

```jsx
// ✅ Variables not used in JSX conditional rendering (ignored)
const readyForSubmit = isValid && !isLoading;
if (readyForSubmit) {
  console.log('Ready!');
}
return <div>Not used in JSX</div>;
```

```jsx
// ✅ Variables used in non-conditional JSX contexts (ignored)
const ready = isLoaded && !isError;
return <div>Status: {ready.toString()}</div>;
```

```jsx
// ✅ Variables used for CSS classes rather than conditional rendering
const hasItems = items && items.length > 0;
return <div className={hasItems ? 'with-items' : 'empty'}>Content</div>;
```

```jsx
// ✅ Simple boolean variables (not complex expressions)
const visible = someBoolean;
return <div>{visible && <span>Content</span>}</div>;
```

```jsx
// ✅ String fallback patterns are ignored (not boolean expressions)
const message = error || 'No error';
return <div>{message && <span>{message}</span>}</div>;
```

```jsx
// ✅ Function calls that return boolean (not derived expressions)
const canEdit = checkPermissions();
return <div>{canEdit && <EditButton />}</div>;
```

```jsx
// ✅ Direct inline conditional expressions (no variables)
return <div>{isLoading ? <Spinner /> : isError ? <Error /> : <Content />}</div>;
```

## Options

This rule has no options.

## When Not To Use It

You might want to disable this rule if:

- Your project has different established naming conventions for conditional variables
- You prefer to use simple boolean variable names for all conditional logic
- Your codebase doesn't distinguish between simple boolean state and derived conditional expressions
- You're working with legacy code that uses different naming patterns

However, consider that this naming convention significantly improves code readability by making the distinction between simple boolean state (`is` prefix) and complex derived conditional logic (`_` prefix) immediately apparent to developers.

## Related Rules

- `react-snob/require-boolean-prefix-is` - Enforces `is` prefix for simple boolean variables, state, and props
- `react-snob/no-complex-jsx-conditions` - Prevents overly complex conditional expressions in JSX
- `@typescript-eslint/naming-convention` - For more general naming convention enforcement
