# no-complex-jsx-conditions

Disallow complex boolean conditions in JSX expressions and component props.

## Rule Details

This rule identifies complex boolean conditions in JSX expressions and component props, encouraging developers to extract them into descriptive variables for better readability and maintainability.

Complex conditions are defined as:

- More than 2 logical operators (`&&`, `||`)
- Chained property access with logical operations
- Multiple binary expressions combined with logical operators
- Complex ternary expressions with logical conditions
- Logical assignment operators
- Template literals combined with logical operators

❌ Examples of **incorrect** code for this rule:

```jsx
// Multiple AND conditions
return (
  <div>
    <Conditional condition={user && data && !isLoading && !error}>
      <DataDisplay data={data} />
    </Conditional>
  </div>
);

// Complex OR with AND
return (
  <div>
    <Conditional condition={(!isLoading && !error) || data?.length === 0}>
      <EmptyState />
    </Conditional>
  </div>
);

// Complex condition in JSX expression
return <div>{user && user.permissions && user.permissions.length > 0 && <AdminPanel />}</div>;

// Complex condition in component prop
return <Button disabled={!user || !user.isActive || user.role !== 'admin'}>Submit</Button>;

// Nested property access with multiple conditions
return <div>{user?.profile?.settings?.notifications && !isDisabled && hasPermission() && <NotificationBell />}</div>;

// Multiple comparisons
return <div>{count > 0 && count < 100 && isValid && <Progress value={count} />}</div>;
```

✅ Examples of **correct** code for this rule:

```jsx
// Simple boolean variables
const isReady = true;
return <div>{isReady && <Component />}</div>;

// Single negation
return <div>{!isLoading && <Component />}</div>;

// Single property access
return <div>{user.isActive && <Component />}</div>;

// Single method call
return <div>{hasPermission() && <Component />}</div>;

// Extracted complex conditions
const _canEdit = user && user.permissions && user.permissions.includes('edit');
return <div>{_canEdit && <EditButton />}</div>;

// Simple ternary with single variables
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// Simple comparison
return <div>{count > 0 && <Counter value={count} />}</div>;

// Extracted conditions in different JSX patterns
const _shouldShow = user && !error;
const _isEmpty = !data || data.length === 0;
return (
  <div>
    {_shouldShow && <Component />}
    <button disabled={!_shouldShow}>Click</button>
    <Modal open={_isEmpty}>No data</Modal>
  </div>
);
```

## Why?

Complex boolean conditions in JSX make code harder to read and understand. By extracting these conditions into descriptive variables, you can:

1. **Improve readability**: Variables with descriptive names make the intent clearer
2. **Enhance maintainability**: Changes to complex logic are easier when isolated
3. **Enable reusability**: Extracted conditions can be reused across multiple JSX expressions
4. **Simplify debugging**: Named variables make debugging easier
5. **Facilitate testing**: Complex logic can be tested independently

## Best Practices

When extracting complex conditions, follow these naming conventions:

- Prefix with underscore for derived/computed values: `_canEdit`, `_isReady`
- Use descriptive names that explain the purpose: `_hasPermission` rather than `_check`
- Keep the extraction close to where it's used for better context

## Options

This rule has no configuration options.

## When Not To Use It

You might want to disable this rule if:

- Your team prefers very concise code over explicit variable declarations
- You're working with legacy code where refactoring would be too costly
- The codebase has different conventions for handling complex conditions

However, in most cases, following this rule leads to more maintainable code.
