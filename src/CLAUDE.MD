# eslint-plugin-react-snob Source Code Structure

This document describes the structure and conventions of the `eslint-plugin-react-snob` source code for future Claude Code sessions.

## Directory Structure

```
src/
├── configs/           # Configuration presets for ESLint
│   └── flat.ts       # ESLint 9+ flat config format
├── rules/            # Individual ESLint rule implementations
│   ├── component-prop-interface-naming.ts
│   ├── no-complex-jsx-conditions.ts
│   ├── no-inline-styles.ts
│   └── require-jsx-string-braces.ts
├── utils/            # Shared utilities for rules
│   ├── ast-traversal.ts      # AST traversal and expression analysis utilities
│   ├── component-utils.ts    # React component detection and analysis
│   ├── rule-creator.ts       # Standardized rule creator
│   ├── typescript-utils.ts   # TypeScript-specific AST utilities
│   └── index.ts             # Central export for all utilities
└── index.ts          # Main plugin export (legacy format)
```

## Plugin Architecture

### Main Entry Points

**`src/index.ts`** - Legacy configuration format (ESLint 8.x and below):

- Exports a plugin object with `configs`, `meta`, and `rules` properties
- Uses CommonJS `export =` syntax for compatibility
- Defines `recommended` and `strict` configurations
- All rules must be manually added to both configurations

**`src/configs/flat.ts`** - Flat configuration format (ESLint 9+):

- Exports individual `recommended` and `strict` configuration objects
- Uses ES module syntax
- Provides a default export with both configs and plugin
- Supports the new flat config API structure

### Configuration Patterns

#### Config Severity Levels

- **recommended**: All rules set to `'warn'` - provides helpful suggestions
- **strict**: All rules set to `'error'` - enforces strict compliance

#### Adding New Rules to Configs

When adding a new rule, you must update **both** configuration files:

1. **Legacy config (`src/index.ts`)**:

   ```typescript
   import { newRule } from './rules/new-rule';

   // Add to imports and rules object
   rules: {
     'new-rule': newRule,
   }

   // Add to both configurations
   configs: {
     recommended: {
       rules: {
         'react-snob/new-rule': 'warn',
       }
     },
     strict: {
       rules: {
         'react-snob/new-rule': 'error',
       }
     }
   }
   ```

2. **Flat config (`src/configs/flat.ts`)**:

   ```typescript
   import { newRule } from '../rules/new-rule';

   // Add to plugin rules
   const plugin = {
     rules: {
       'new-rule': newRule,
     },
   };

   // Add to both exported configs
   export const recommended = {
     rules: {
       'react-snob/new-rule': 'warn',
     },
   };
   ```

### Rule Import/Export Convention

- Rules are imported using named imports: `import { ruleName } from './rules/rule-name'`
- Rule file names use kebab-case: `no-inline-styles.ts`
- Rule keys in the plugin use kebab-case: `'no-inline-styles'`
- Rule names in configurations use the plugin prefix: `'react-snob/no-inline-styles'`

## Plugin Metadata

### Version Management

- Version is currently hardcoded in both config files
- Keep versions in sync between `src/index.ts` and `src/configs/flat.ts`
- Version should match `package.json` version

### Plugin Naming

- Plugin name: `'eslint-plugin-react-snob'`
- Rule prefix: `'react-snob/'`
- NPM package: `eslint-plugin-react-snob`

## Development Workflow

### Adding a New Rule

1. **Create the rule**: Add implementation to `src/rules/new-rule.ts` (use shared utilities from `src/utils/`)
2. **Add to legacy config**: Import and configure in `src/index.ts`
3. **Add to flat config**: Import and configure in `src/configs/flat.ts`
4. **Create tests**: Add test file to `tests/rules/new-rule.test.ts`
5. **Add documentation**: Create `docs/rules/new-rule.md`
6. **Update README**: Add rule to the "Supported Rules" section

### Build Process

- TypeScript compilation outputs to `dist/` directory
- Main entry: `dist/index.js` (legacy config)
- Flat config entry: `dist/configs/flat.js`
- Type definitions: `dist/index.d.ts`

## Configuration Usage Examples

### Legacy Config (.eslintrc.json)

```json
{
  "extends": ["plugin:react-snob/recommended"],
  "plugins": ["react-snob"],
  "rules": {
    "react-snob/no-inline-styles": "error"
  }
}
```

### Flat Config (eslint.config.js)

```javascript
import reactSnob from 'eslint-plugin-react-snob/configs/flat';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...reactSnob.configs.recommended,
  },
];
```

## Shared Utilities

The `src/utils/` directory contains reusable functions to avoid code duplication across rules:

### Core Utilities

- **`createRule`** (`src/utils/rule-creator.ts`): Standardized rule creator with consistent documentation URLs
- **Component utilities** (`src/utils/component-utils.ts`): Functions for detecting and analyzing React components
- **AST traversal** (`src/utils/ast-traversal.ts`): Functions for traversing and analyzing complex expressions
- **TypeScript utilities** (`src/utils/typescript-utils.ts`): Utilities for working with TypeScript type annotations

### Usage in Rules

Rules should import utilities from `src/utils/` instead of implementing their own versions:

```typescript
// Good - use shared utilities
import { createRule, extractComponentName, isComponentFunction } from '../utils';

// Bad - duplicate functionality
const createRule = ESLintUtils.RuleCreator(...);
function extractComponentName(...) { /* duplicate code */ }
```

## Important Notes

- This plugin is React-focused and should only target JSX/TSX files for component-related rules and JS/TS files for hook-related rules
- All rules should be defensive and only apply to actual React components and hooks
- Maintain backward compatibility when possible
- Follow TypeScript strict mode conventions
- Use shared utilities from `src/utils/` to avoid code duplication
- Use ESLint's TypeScript utilities from `@typescript-eslint/utils`
- Always run `npm run lint:fix` and `npm run format` before committing code, make sure all checks pass
