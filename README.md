# eslint-plugin-react-snob

[![npm version](https://badge.fury.io/js/eslint-plugin-react-snob.svg)](https://badge.fury.io/js/eslint-plugin-react-snob)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An ESLint plugin for React best practices and opinionated code style enforcement. This plugin enforces consistent and clean React code patterns to maintain high code quality standards.

## Installation

```bash
npm install eslint-plugin-react-snob --save-dev
```

## Usage

Add `react-snob` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["react-snob"]
}
```

Then configure the rules you want to use under the rules section:

```json
{
  "rules": {
    "react-snob/no-inline-styles": "error",
    "react-snob/require-jsx-string-braces": "error"
  }
}
```

## Configurations

This plugin provides some predefined configurations:

### Recommended

```json
{
  "extends": ["plugin:react-snob/recommended"]
}
```

### Strict

```json
{
  "extends": ["plugin:react-snob/strict"]
}
```

## Supported Rules

### ✅ `react-snob/no-inline-styles`

Disallow inline styles in JSX elements to promote better separation of concerns and maintainability.

**❌ Incorrect:**

```jsx
<div style={{ color: 'red', fontSize: '16px' }}>Content</div>
```

**✅ Correct:**

```jsx
<div className="red-text large-font">Content</div>
```

[📖 Full documentation](docs/rules/no-inline-styles.md)

### ✅ `react-snob/require-jsx-string-braces`

Require curly braces around string literals in JSX attributes for consistency.

**❌ Incorrect:**

```jsx
<div className="text-center" aria-label="hello">Content</div>
<CustomComponent stringProp="value" />
```

**✅ Correct:**

```jsx
<div className={"text-center"} aria-label={"hello"}>Content</div>
<CustomComponent stringProp={"value"} />
```

[📖 Full documentation](docs/rules/require-jsx-string-braces.md)

## Development

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT © [Jason Paff](https://github.com/jasonpaff)
