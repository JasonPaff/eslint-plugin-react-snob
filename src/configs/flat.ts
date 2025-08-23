import { componentPropInterfaceNaming } from '../rules/component-prop-interface-naming';
import { noComplexJsxConditions } from '../rules/no-complex-jsx-conditions';
import { noInlineStyles } from '../rules/no-inline-styles';
import { requireBooleanPrefixIs } from '../rules/require-boolean-prefix-is';
import { requireJsxStringBraces } from '../rules/require-jsx-string-braces';

// ESLint 9+ Flat Config Format
const plugin = {
  meta: {
    name: 'eslint-plugin-react-snob',
    version: '0.0.12',
  },
  rules: {
    'component-prop-interface-naming': componentPropInterfaceNaming,
    'no-complex-jsx-conditions': noComplexJsxConditions,
    'no-inline-styles': noInlineStyles,
    'require-boolean-prefix-is': requireBooleanPrefixIs,
    'require-jsx-string-braces': requireJsxStringBraces,
  },
};

// Predefined flat configs
export const recommended = {
  plugins: {
    'react-snob': plugin,
  },
  rules: {
    'react-snob/component-prop-interface-naming': 'error',
    'react-snob/no-complex-jsx-conditions': 'warn',
    'react-snob/no-inline-styles': 'warn',
    'react-snob/require-boolean-prefix-is': 'warn',
    'react-snob/require-jsx-string-braces': 'error',
  },
};

export const strict = {
  plugins: {
    'react-snob': plugin,
  },
  rules: {
    'react-snob/component-prop-interface-naming': 'error',
    'react-snob/no-complex-jsx-conditions': 'error',
    'react-snob/no-inline-styles': 'error',
    'react-snob/require-boolean-prefix-is': 'error',
    'react-snob/require-jsx-string-braces': 'error',
  },
};

// Default export for eslint.config.js usage
export default {
  configs: {
    recommended,
    strict,
  },
  plugin,
};
