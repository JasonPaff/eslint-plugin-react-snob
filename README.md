# eslint-plugin-react-snob

An ESLint plugin for React best practices and opinionated code style enforcement.

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

- [`react-snob/no-inline-styles`](docs/rules/no-inline-styles.md) - Disallow inline styles in JSX elements
- [`react-snob/require-jsx-string-braces`](docs/rules/require-jsx-string-braces.md) - Require curly braces around string literals in JSX attributes

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

## License

MIT
