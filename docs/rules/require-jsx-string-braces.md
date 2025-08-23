# require-jsx-string-braces

Require curly braces around string literals in JSX attributes.

## Rule Details

This rule enforces that all string literal values in JSX attributes are wrapped in curly braces with quotes inside, rather than using direct string literals. This promotes consistency and makes it explicit when you're using JavaScript expressions vs. plain strings.

Examples of **incorrect** code for this rule:

```jsx
// ❌ Direct string literals
<div className="text-center">Content</div>
<div aria-label="hello">Content</div>
<CustomComponent stringProp="wrong" />
<input placeholder='Enter text' />
<div data-testid="my-component">Content</div>
<div xmlns:custom="http://example.com" custom:attr="value" />
```

Examples of **correct** code for this rule:

```jsx
// ✅ String literals wrapped in curly braces
<div className={"text-center"}>Content</div>
<div aria-label={'hello'}>Content</div>
<CustomComponent stringProp={"right"} />
<input placeholder={'Enter text'} />
<div data-testid={"my-component"}>Content</div>
<div xmlns:custom={"http://example.com"} custom:attr={"value"} />

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
