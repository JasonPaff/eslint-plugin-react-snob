# no-inline-styles

Disallow inline styles in JSX elements.

## Rule Details

This rule aims to prevent the use of inline styles in JSX elements, encouraging the use of CSS classes or styled-components instead for better maintainability and performance.

Examples of **incorrect** code for this rule:

```tsx
// ❌ Inline styles
<div style={{ color: 'red', fontSize: '16px' }}>Content</div>
<span style={dynamicStyles}>Text</span>
<button style={{ backgroundColor: 'blue' }}>Click me</button>
```

Examples of **correct** code for this rule:

```tsx
// ✅ CSS classes
<div className="red-text large-font">Content</div>
<span className={dynamicClassName}>Text</span>
<button className="blue-button">Click me</button>

// ✅ No styling
<div>Content</div>
```

## Options

This rule has no options.
