import { componentPropInterfaceNaming } from '../rules/component-prop-interface-naming';
import { noInlineStyles } from '../rules/no-inline-styles';
import { requireJsxStringBraces } from '../rules/require-jsx-string-braces';

// ESLint 9+ Flat Config Format
const plugin = {
  meta: {
    name: 'eslint-plugin-react-snob',
    version: '0.0.6',
  },
  rules: {
    'component-prop-interface-naming': componentPropInterfaceNaming,
    'no-inline-styles': noInlineStyles,
    'require-jsx-string-braces': requireJsxStringBraces,
  },
};

// Predefined flat configs
export const recommended = {
  plugins: {
    'react-snob': plugin,
  },
  rules: {
    'react-snob/component-prop-interface-naming': 'warn',
    'react-snob/no-inline-styles': 'warn',
    'react-snob/require-jsx-string-braces': 'warn',
  },
};

export const strict = {
  plugins: {
    'react-snob': plugin,
  },
  rules: {
    'react-snob/component-prop-interface-naming': 'error',
    'react-snob/no-inline-styles': 'error',
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
