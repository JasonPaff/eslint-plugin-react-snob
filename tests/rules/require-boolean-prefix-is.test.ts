import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireBooleanPrefixIs } from '../../src/rules/require-boolean-prefix-is';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
});

ruleTester.run('require-boolean-prefix-is', requireBooleanPrefixIs, {
  invalid: [
    // Boolean variables without "is" prefix
    {
      code: 'const visible = true;',
      errors: [
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },
    {
      code: 'let disabled = false;',
      errors: [
        {
          data: {
            name: 'disabled',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },
    {
      code: 'var loading = true;',
      errors: [
        {
          data: {
            name: 'loading',
            suggested: 'isLoading',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // React useState without "is" prefix
    {
      code: 'const [open, setOpen] = useState(false);',
      errors: [
        {
          data: {
            name: 'open',
            suggested: 'isOpen',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },
    {
      code: 'const [visible, setVisible] = useState(true);',
      errors: [
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Interface properties without "is" prefix
    {
      code: `
        interface ButtonProps {
          disabled: boolean;
          visible: boolean;
          onClick: () => void;
        }
      `,
      errors: [
        {
          data: {
            name: 'disabled',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Type alias properties without "is" prefix
    {
      code: `
        type ModalProps = {
          open: boolean;
          closable: boolean;
        };
      `,
      errors: [
        {
          data: {
            name: 'open',
            suggested: 'isOpen',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'closable',
            suggested: 'isClosable',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Function parameters without "is" prefix
    {
      code: `
        function Button({ disabled }: { disabled: boolean }) {
          return <button disabled={disabled}>Click</button>;
        }
      `,
      errors: [
        {
          data: {
            name: 'disabled',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'disabled',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Arrow function parameters
    {
      code: `
        const handleToggle = (enabled: boolean) => {
          console.log(enabled);
        };
      `,
      errors: [
        {
          data: {
            name: 'enabled',
            suggested: 'isEnabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Variables with boolean expressions
    {
      code: 'const ready = loaded && !error;',
      errors: [
        {
          data: {
            name: 'ready',
            suggested: 'isReady',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Multiple boolean variables in one declaration
    {
      code: 'const visible = true, enabled = false, loading = true;',
      errors: [
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'enabled',
            suggested: 'isEnabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'loading',
            suggested: 'isLoading',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Destructured props without "is" prefix
    {
      code: `
        function Component({ visible, disabled }: { visible: boolean; disabled: boolean }) {
          return <div style={{ display: visible ? 'block' : 'none' }}>Content</div>;
        }
      `,
      errors: [
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'disabled',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'disabled',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Boolean variables used in conditional expressions
    {
      code: `
        const active = true;
        if (active) {
          console.log('Active');
        }
      `,
      errors: [
        {
          data: {
            name: 'active',
            suggested: 'isActive',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Optional boolean properties without "is" prefix
    {
      code: `
        interface ComponentProps {
          disabled?: boolean;
          visible?: boolean;
        }
      `,
      errors: [
        {
          data: {
            name: 'disabled',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Union types with boolean
    {
      code: `
        interface Props {
          active: boolean | undefined;
          loading: boolean | null;
        }
      `,
      errors: [
        {
          data: {
            name: 'active',
            suggested: 'isActive',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'loading',
            suggested: 'isLoading',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Boolean variables in different scopes
    {
      code: `
        function Component() {
          const visible = true;
          const enabled = false;
          
          if (visible && enabled) {
            return <div>Both true</div>;
          }
          
          return null;
        }
      `,
      errors: [
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'enabled',
            suggested: 'isEnabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Class component state without "is" prefix
    {
      code: `
        class MyComponent extends React.Component {
          state = {
            loading: false,
            visible: true
          };
        }
      `,
      errors: [
        {
          data: {
            name: 'loading',
            suggested: 'isLoading',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Nested object properties with boolean values
    {
      code: `
        const config = {
          settings: {
            enabled: true,
            visible: false
          }
        };
      `,
      errors: [
        {
          data: {
            name: 'enabled',
            suggested: 'isEnabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'visible',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // forwardRef with boolean props
    {
      code: `
        interface InputProps {
          disabled: boolean;
          readOnly: boolean;
        }
        const Input = forwardRef<HTMLInputElement, InputProps>(
          ({ disabled, readOnly }, ref) => <input ref={ref} disabled={disabled} readOnly={readOnly} />
        );
      `,
      errors: [
        {
          data: {
            name: 'disabled',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'readOnly',
            suggested: 'isReadOnly',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'disabled',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'readOnly',
            suggested: 'isReadOnly',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Constants without proper IS_ prefix (should be invalid)
    {
      code: `
        const SETTINGS = {
          ENABLED: true,
          VISIBLE: false,
          DEBUG_MODE: true,
        };
      `,
      errors: [
        {
          data: {
            name: 'ENABLED',
            suggested: 'IS_ENABLED',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'VISIBLE',
            suggested: 'IS_VISIBLE',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'DEBUG_MODE',
            suggested: 'IS_DEBUG_MODE',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },

    // Mixed case constants without IS_ prefix
    {
      code: `
        export const APP_CONFIG = {
          API_ENDPOINT: 'https://api.example.com',
          FEATURE_ENABLED: true,
          DEBUG: false,
          VERSION: '1.0.0',
          PRODUCTION_MODE: false,
        } as const;
      `,
      errors: [
        {
          data: {
            name: 'FEATURE_ENABLED',
            suggested: 'IS_FEATURE_ENABLED',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'DEBUG',
            suggested: 'IS_DEBUG',
          },
          messageId: 'booleanShouldStartWithIs',
        },
        {
          data: {
            name: 'PRODUCTION_MODE',
            suggested: 'IS_PRODUCTION_MODE',
          },
          messageId: 'booleanShouldStartWithIs',
        },
      ],
    },
  ],

  valid: [
    // Variables with correct "is" prefix
    {
      code: 'const isVisible = true;',
    },
    {
      code: 'let isDisabled = false;',
    },
    {
      code: 'var isLoading = true;',
    },

    // React useState with correct naming
    {
      code: 'const [isOpen, setIsOpen] = useState(false);',
    },
    {
      code: 'const [isActive, setIsActive] = useState(true);',
    },

    // Function parameters with correct naming
    {
      code: `
        function Button({ isDisabled }: { isDisabled: boolean }) {
          return <button disabled={isDisabled}>Click</button>;
        }
      `,
    },

    // Interface properties with correct naming
    {
      code: `
        interface ButtonProps {
          isVisible: boolean;
          isDisabled: boolean;
          onClick: () => void;
        }
      `,
    },

    // Type alias properties with correct naming
    {
      code: `
        type ModalProps = {
          isOpen: boolean;
          onClose: () => void;
        };
      `,
    },

    // Function declarations with boolean parameters
    {
      code: `
        function toggleVisibility(isVisible: boolean) {
          return !isVisible;
        }
      `,
    },

    // Arrow function parameters
    {
      code: `
        const handleClick = (isEnabled: boolean) => {
          if (isEnabled) {
            console.log('Enabled');
          }
        };
      `,
    },

    // Non-boolean variables (should be ignored)
    {
      code: 'const loading = "in-progress";',
    },
    {
      code: 'const disabled = 0;',
    },
    {
      code: 'const visible = "block";',
    },

    // Non-boolean interface properties
    {
      code: `
        interface UserProps {
          name: string;
          age: number;
          status: 'active' | 'inactive';
        }
      `,
    },

    // Non-boolean useState
    {
      code: 'const [count, setCount] = useState(0);',
    },
    {
      code: 'const [name, setName] = useState("");',
    },

    // Non-component functions (should be ignored)
    {
      code: `
        function utilityFunction(enabled: boolean, disabled: boolean) {
          return enabled && !disabled;
        }
      `,
    },

    // Object destructuring with non-boolean
    {
      code: 'const { loading, error } = api;',
    },

    // Variables without explicit boolean type or value
    {
      code: 'const loading = someFunction();',
    },

    // Complex boolean expressions with correct naming
    {
      code: `
        const isReady = isLoaded && !isError;
        const isComplete = isValid && isSubmitted;
      `,
    },

    // Boolean variables in different scopes
    {
      code: `
        function Component() {
          const isVisible = true;
          const isEnabled = false;
          
          if (isVisible) {
            return <div>Visible</div>;
          }
          
          return null;
        }
      `,
    },

    // Optional boolean properties
    {
      code: `
        interface ComponentProps {
          isDisabled?: boolean;
          isVisible?: boolean;
        }
      `,
    },

    // Union types with boolean
    {
      code: `
        interface Props {
          isActive: boolean | undefined;
          isLoading: boolean | null;
        }
      `,
    },

    // Function with boolean return type but non-boolean parameters
    {
      code: `
        function checkStatus(status: string): boolean {
          return status === 'active';
        }
      `,
    },

    // Generic types
    {
      code: `
        interface Props<T> {
          isVisible: boolean;
          data: T;
        }
      `,
    },

    // Already correctly named destructured props
    {
      code: `
        function Button({ isDisabled, isVisible }: { isDisabled: boolean; isVisible: boolean }) {
          return <button disabled={isDisabled} style={{ display: isVisible ? 'block' : 'none' }}>Click</button>;
        }
      `,
    },

    // Nested boolean properties with correct naming
    {
      code: `
        interface NestedProps {
          config: {
            isEnabled: boolean;
            isDebugMode: boolean;
          };
        }
      `,
    },

    // Class component state with correct naming
    {
      code: `
        class MyComponent extends React.Component {
          state = {
            isLoading: false,
            isVisible: true
          };
        }
      `,
    },

    // Constants with IS_ prefix (should be valid)
    {
      code: `
        export const BOBBLEHEAD_DEFAULTS = {
          COMMENT_COUNT: 0,
          CURRENT_CONDITION: 'excellent',
          IS_DELETED: false,
          IS_FEATURED: false,
          IS_PUBLIC: true,
          LIKE_COUNT: 0,
          SORT_ORDER: 0,
          STATUS: 'owned',
          VIEW_COUNT: 0,
        } as const;
      `,
    },

    // Object with mixed IS_ constants and non-boolean constants
    {
      code: `
        const CONFIG = {
          API_URL: 'https://example.com',
          IS_DEVELOPMENT: false,
          IS_ENABLED: true,
          MAX_RETRIES: 3,
          IS_DEBUG_MODE: false,
        };
      `,
    },

    // Constants object with proper IS_ naming
    {
      code: `
        const FLAGS = {
          IS_FEATURE_A_ENABLED: true,
          IS_FEATURE_B_ENABLED: false,
          IS_BETA_USER: true,
        };
      `,
    },
  ],
});
