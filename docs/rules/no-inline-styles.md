# no-inline-styles

Disallow inline styles in JSX elements.

## Rule Details

This rule aims to prevent the use of inline styles in JSX elements, encouraging the use of CSS classes or styled-components instead for better maintainability and performance.

Examples of **incorrect** code for this rule:

```jsx
// ❌ Inline styles
<div style={{ color: 'red', fontSize: '16px' }}>Content</div>
<span style={dynamicStyles}>Text</span>
<button style={{ backgroundColor: 'blue' }}>Click me</button>
```

Examples of **correct** code for this rule:

```jsx
// ✅ CSS classes
<div className="red-text large-font">Content</div>
<span className={dynamicClassName}>Text</span>
<button className="blue-button">Click me</button>

// ✅ No styling
<div>Content</div>
```

## When Not To Use It

If your project specifically requires inline styles (e.g., dynamic styling based on props), you may want to disable this rule or use ESLint disable comments for specific cases.

## Further Reading

- [React Styling Best Practices](https://reactjs.org/docs/dom-elements.html#style)
- [CSS-in-JS vs CSS Classes](https://css-tricks.com/the-fragmented-but-evolving-state-of-css-in-js/)
