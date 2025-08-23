# require-jsx-string-braces

Require curly braces around string literals in JSX attributes.

## Rule Details

This rule enforces that all string literal values in JSX attributes are wrapped in curly braces with quotes inside, rather than using direct string literals. This promotes consistency and makes it explicit when you're using JavaScript expressions vs. plain strings.

For multi-line string literals, the rule automatically converts them to template literals (backticks) to preserve the line breaks and formatting.

Examples of **incorrect** code for this rule:

```tsx
// ❌ Direct string literals
<div className="text-center">Content</div>
<div aria-label="hello">Content</div>
<CustomComponent stringProp="wrong" />
<input placeholder='Enter text' />
<div data-testid="my-component">Content</div>
<div xmlns:custom="http://example.com" custom:attr="value" />

// ❌ Multi-line string literals
<path d="M449.99,422.439v-85.005h22.354v11.444
  c6.152-7.383,16.544-13.538,27.095-13.538v21.818" />
<div title="This is a
  multi-line string">Content</div>
```

Examples of **correct** code for this rule:

```tsx
// ✅ String literals wrapped in curly braces
<div className={"text-center"}>Content</div>
<div aria-label={'hello'}>Content</div>
<CustomComponent stringProp={"right"} />
<input placeholder={'Enter text'} />
<div data-testid={"my-component"}>Content</div>
<div xmlns:custom={"http://example.com"} custom:attr={"value"} />

// ✅ Multi-line strings as template literals
<path d={`M449.99,422.439v-85.005h22.354v11.444
  c6.152-7.383,16.544-13.538,27.095-13.538v21.818`} />
<div title={`This is a
  multi-line string`}>Content</div>

// ✅ Dynamic values (already in curly braces)
<div className={dynamicClass}>Content</div>
<div title={`Hello ${name}`}>Content</div>

// ✅ Non-string values
<div disabled={true}>Content</div>
<div count={42}>Content</div>
<div callback={handleClick}>Content</div>

// ✅ No attributes
<div>Content</div>
```

## Options

This rule has no options.
