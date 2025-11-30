import { componentPropInterfaceNaming } from '../rules/component-prop-interface-naming';
import { consistentEventHandlerNaming } from '../rules/consistent-event-handler-naming';
import { noBracketArrayType } from '../rules/no-bracket-array-type';
import { noComplexJsxConditions } from '../rules/no-complex-jsx-conditions';
import { noIifeInJsx } from '../rules/no-iife-in-jsx';
import { noInlineStyles } from '../rules/no-inline-styles';
import { noReactNamespace } from '../rules/no-react-namespace';
import { noShorthandFragment } from '../rules/no-shorthand-fragment';
import { requireBooleanPrefixIs } from '../rules/require-boolean-prefix-is';
import { requireDerivedConditionalPrefix } from '../rules/require-derived-conditional-prefix';
import { requireJsxStringBraces } from '../rules/require-jsx-string-braces';

const plugin = {
  meta: {
    name: 'eslint-plugin-react-snob',
    version: '0.0.25',
  },
  rules: {
    'component-prop-interface-naming': componentPropInterfaceNaming,
    'consistent-event-handler-naming': consistentEventHandlerNaming,
    'no-bracket-array-type': noBracketArrayType,
    'no-complex-jsx-conditions': noComplexJsxConditions,
    'no-iife-in-jsx': noIifeInJsx,
    'no-inline-styles': noInlineStyles,
    'no-react-namespace': noReactNamespace,
    'no-shorthand-fragment': noShorthandFragment,
    'require-boolean-prefix-is': requireBooleanPrefixIs,
    'require-derived-conditional-prefix': requireDerivedConditionalPrefix,
    'require-jsx-string-braces': requireJsxStringBraces,
  },
};

export const recommended = {
  plugins: {
    'react-snob': plugin,
  },
  rules: {
    'react-snob/component-prop-interface-naming': 'warn',
    'react-snob/consistent-event-handler-naming': 'warn',
    'react-snob/no-bracket-array-type': 'warn',
    'react-snob/no-complex-jsx-conditions': 'warn',
    'react-snob/no-iife-in-jsx': 'warn',
    'react-snob/no-inline-styles': 'warn',
    'react-snob/no-react-namespace': 'warn',
    'react-snob/no-shorthand-fragment': 'warn',
    'react-snob/require-boolean-prefix-is': 'warn',
    'react-snob/require-derived-conditional-prefix': 'warn',
    'react-snob/require-jsx-string-braces': 'warn',
  },
};

export const strict = {
  plugins: {
    'react-snob': plugin,
  },
  rules: {
    'react-snob/component-prop-interface-naming': 'error',
    'react-snob/consistent-event-handler-naming': 'error',
    'react-snob/no-bracket-array-type': 'error',
    'react-snob/no-complex-jsx-conditions': 'error',
    'react-snob/no-iife-in-jsx': 'error',
    'react-snob/no-inline-styles': 'error',
    'react-snob/no-react-namespace': 'error',
    'react-snob/no-shorthand-fragment': 'error',
    'react-snob/require-boolean-prefix-is': 'error',
    'react-snob/require-derived-conditional-prefix': 'error',
    'react-snob/require-jsx-string-braces': 'error',
  },
};

export default {
  configs: {
    recommended,
    strict,
  },
  plugin,
};
