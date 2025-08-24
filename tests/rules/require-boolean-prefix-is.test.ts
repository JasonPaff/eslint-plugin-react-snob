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
    // Boolean variables without allowed prefix (default "is")
    {
      code: 'const visible = true;',
      errors: [
        {
          data: {
            name: 'visible',
            prefixes: '"is"',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
    },
    {
      code: 'let disabled = false;',
      errors: [
        {
          data: {
            name: 'disabled',
            prefixes: '"is"',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
    },
    {
      code: 'var loading = true;',
      errors: [
        {
          data: {
            name: 'loading',
            prefixes: '"is"',
            suggested: 'isLoading',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
    },

    // Test with custom allowedPrefixes option - single prefix
    {
      code: 'const visible = true;',
      errors: [
        {
          data: {
            name: 'visible',
            prefixes: '"has"',
            suggested: 'hasVisible',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
      options: [{ allowedPrefixes: ['has'] }],
    },

    // Test with multiple custom prefixes
    {
      code: 'const enabled = true;',
      errors: [
        {
          data: {
            name: 'enabled',
            prefixes: '"is", "has", or "should"',
            suggested: 'isEnabled',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
      options: [{ allowedPrefixes: ['is', 'has', 'should'] }],
    },

    // Test with custom prefixes - should work for different cases
    {
      code: 'const VISIBLE = true;',
      errors: [
        {
          data: {
            name: 'VISIBLE',
            prefixes: '"can", or "should"',
            suggested: 'CAN_VISIBLE',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
      options: [{ allowedPrefixes: ['can', 'should'] }],
    },

    // Test underscore prefixed variables
    {
      code: 'const _enabled = true;',
      errors: [
        {
          data: {
            name: '_enabled',
            prefixes: '"has"',
            suggested: '_hasEnabled',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
      options: [{ allowedPrefixes: ['has'] }],
    },

    // React useState without allowed prefix
    {
      code: 'const [open, setOpen] = useState(false);',
      errors: [
        {
          data: {
            name: 'open',
            prefixes: '"is"',
            suggested: 'isOpen',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
    },

    // React useState with custom prefix
    {
      code: 'const [visible, setVisible] = useState(true);',
      errors: [
        {
          data: {
            name: 'visible',
            prefixes: '"can", or "should"',
            suggested: 'canVisible',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
      options: [{ allowedPrefixes: ['can', 'should'] }],
    },

    // Interface properties without allowed prefix
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
            prefixes: '"is"',
            suggested: 'isDisabled',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
        {
          data: {
            name: 'visible',
            prefixes: '"is"',
            suggested: 'isVisible',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
    },

    // Interface properties with custom prefixes
    {
      code: `
        interface ComponentProps {
          active: boolean;
          enabled: boolean;
        }
      `,
      errors: [
        {
          data: {
            name: 'active',
            prefixes: '"was", or "will"',
            suggested: 'wasActive',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
        {
          data: {
            name: 'enabled',
            prefixes: '"was", or "will"',
            suggested: 'wasEnabled',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
      options: [{ allowedPrefixes: ['was', 'will'] }],
    },

    // Constants without proper prefix
    {
      code: `
        const SETTINGS = {
          ENABLED: true,
          VISIBLE: false,
        };
      `,
      errors: [
        {
          data: {
            name: 'ENABLED',
            prefixes: '"should"',
            suggested: 'SHOULD_ENABLED',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
        {
          data: {
            name: 'VISIBLE',
            prefixes: '"should"',
            suggested: 'SHOULD_VISIBLE',
          },
          messageId: 'booleanShouldStartWithPrefix',
        },
      ],
      options: [{ allowedPrefixes: ['should'] }],
    },
  ],

  valid: [
    // Variables with correct default "is" prefix
    {
      code: 'const isVisible = true;',
    },
    {
      code: 'let isDisabled = false;',
    },
    {
      code: 'var isLoading = true;',
    },

    // Variables with underscore "is" prefix
    {
      code: 'const _isVisible = true;',
    },
    {
      code: 'let _isDisabled = false;',
    },

    // Variables with correct custom single prefix
    {
      code: 'const hasPermission = true;',
      options: [{ allowedPrefixes: ['has'] }],
    },
    {
      code: 'const shouldRetry = false;',
      options: [{ allowedPrefixes: ['should'] }],
    },
    {
      code: 'const canAccess = true;',
      options: [{ allowedPrefixes: ['can'] }],
    },

    // Variables with correct custom multiple prefixes
    {
      code: 'const isVisible = true;',
      options: [{ allowedPrefixes: ['is', 'has', 'should'] }],
    },
    {
      code: 'const hasPermission = false;',
      options: [{ allowedPrefixes: ['is', 'has', 'should'] }],
    },
    {
      code: 'const shouldRefresh = true;',
      options: [{ allowedPrefixes: ['is', 'has', 'should'] }],
    },

    // Constants with correct custom prefixes
    {
      code: `
        const CONFIG = {
          CAN_EDIT: true,
          SHOULD_VALIDATE: false,
        };
      `,
      options: [{ allowedPrefixes: ['can', 'should'] }],
    },

    // Underscore variables with custom prefixes
    {
      code: 'const _hasAccess = true;',
      options: [{ allowedPrefixes: ['has'] }],
    },
    {
      code: 'const _canEdit = false;',
      options: [{ allowedPrefixes: ['can', 'will'] }],
    },

    // React useState with correct custom prefix
    {
      code: 'const [hasPermission, setHasPermission] = useState(false);',
      options: [{ allowedPrefixes: ['has'] }],
    },
    {
      code: 'const [shouldShow, setShouldShow] = useState(true);',
      options: [{ allowedPrefixes: ['should', 'can'] }],
    },

    // Interface properties with correct custom prefixes
    {
      code: `
        interface ButtonProps {
          hasPermission: boolean;
          shouldDisable: boolean;
          onClick: () => void;
        }
      `,
      options: [{ allowedPrefixes: ['has', 'should'] }],
    },

    // Mixed valid and non-boolean properties
    {
      code: `
        interface ComponentProps {
          title: string;
          wasActive: boolean;
          count: number;
          willUpdate: boolean;
        }
      `,
      options: [{ allowedPrefixes: ['was', 'will'] }],
    },

    // Non-boolean variables (should be ignored regardless of options)
    {
      code: 'const loading = "in-progress";',
      options: [{ allowedPrefixes: ['should'] }],
    },
    {
      code: 'const disabled = 0;',
      options: [{ allowedPrefixes: ['can'] }],
    },
    {
      code: 'const visible = "block";',
      options: [{ allowedPrefixes: ['has'] }],
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
      options: [{ allowedPrefixes: ['should'] }],
    },

    // Non-boolean useState
    {
      code: 'const [count, setCount] = useState(0);',
      options: [{ allowedPrefixes: ['can'] }],
    },
    {
      code: 'const [name, setName] = useState("");',
      options: [{ allowedPrefixes: ['has'] }],
    },

    // Constants with correct IS_ prefix (default behavior)
    {
      code: `
        export const CONFIG = {
          API_URL: 'https://example.com',
          IS_DEVELOPMENT: false,
          IS_ENABLED: true,
          MAX_RETRIES: 3,
        };
      `,
    },

    // Constants with custom prefix
    {
      code: `
        const FLAGS = {
          CAN_EDIT: true,
          CAN_DELETE: false,
          SHOULD_VALIDATE: true,
        };
      `,
      options: [{ allowedPrefixes: ['can', 'should'] }],
    },

    // Zod schema with .omit() method - should not flag boolean values
    {
      code: `
        const userSchema = z.object({
          name: z.string(),
          age: z.number(),
          isActive: z.boolean(),
        });
        
        const publicUserSchema = userSchema.omit({
          isActive: true,
        });
      `,
      options: [{ allowedPrefixes: ['should'] }],
    },

    // Zod schema with .pick() method - should not flag boolean values
    {
      code: `
        const userSchema = z.object({
          name: z.string(),
          email: z.string(),
          isVerified: z.boolean(),
          createdAt: z.date(),
        });
        
        const basicUserSchema = userSchema.pick({
          name: true,
          email: true,
          createdAt: true,
        });
      `,
      options: [{ allowedPrefixes: ['can'] }],
    },

    // Constructor calls should be ignored
    {
      code: 'const client = new Realtime({ disabled: true });',
      options: [{ allowedPrefixes: ['should'] }],
    },

    // Non-component functions (should be ignored)
    {
      code: `
        function utilityFunction(enabled: boolean, disabled: boolean) {
          return enabled && !disabled;
        }
      `,
      options: [{ allowedPrefixes: ['can'] }],
    },

    // Variables without explicit boolean type or value
    {
      code: 'const loading = someFunction();',
      options: [{ allowedPrefixes: ['has'] }],
    },

    // Function with boolean return type but non-boolean parameters
    {
      code: `
        function checkStatus(status: string): boolean {
          return status === 'active';
        }
      `,
      options: [{ allowedPrefixes: ['should'] }],
    },

    // Complex expressions with correct custom prefixes
    {
      code: `
        const hasAccess = hasPermission && !hasRestriction;
        const shouldProceed = canContinue && willSuccess;
      `,
      options: [{ allowedPrefixes: ['has', 'should', 'can', 'will'] }],
    },
  ],
});