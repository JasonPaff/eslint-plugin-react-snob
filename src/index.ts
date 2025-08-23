import { noInlineStyles } from './rules/no-inline-styles';
import { requireJsxStringBraces } from './rules/require-jsx-string-braces';

const plugin = {
  configs: {
    recommended: {
      plugins: ['react-snob'],
      rules: {
        'react-snob/no-inline-styles': 'warn',
        'react-snob/require-jsx-string-braces': 'warn',
      },
    },
    strict: {
      plugins: ['react-snob'],
      rules: {
        'react-snob/no-inline-styles': 'error',
        'react-snob/require-jsx-string-braces': 'error',
      },
    },
  },
  meta: {
    name: 'eslint-plugin-react-snob',
    version: '0.0.3',
  },
  rules: {
    'no-inline-styles': noInlineStyles,
    'require-jsx-string-braces': requireJsxStringBraces,
  },
};

export = plugin;
