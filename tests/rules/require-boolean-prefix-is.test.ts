import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireBooleanPrefixIs } from '../../src/rules/require-boolean-prefix-is';
import { PARSER_CONFIG } from '../../src/utils/test-utils';

// Helper function to create invalid test cases for require-boolean-prefix-is rule
function createBooleanPrefixInvalidCase(
  code: string,
  name: string,
  prefixes: string,
  suggested: string,
  options?: { allowedPrefixes: string[] }
) {
  return {
    code,
    errors: [
      {
        data: {
          name,
          prefixes,
          suggested,
        },
        messageId: 'booleanShouldStartWithPrefix' as const,
      },
    ],
    ...(options && { options: [options] }),
  };
}

// Helper function to create valid test cases
function createValidCase(code: string, options?: { allowedPrefixes: string[] }) {
  return {
    code,
    ...(options && { options: [options] }),
  };
}

// Test cases for basic boolean variables with default "is" prefix
const basicBooleanVariableCases = [
  createBooleanPrefixInvalidCase('const visible = true;', 'visible', '"is"', 'isVisible'),
  createBooleanPrefixInvalidCase('let disabled = false;', 'disabled', '"is"', 'isDisabled'),
  createBooleanPrefixInvalidCase('var loading = true;', 'loading', '"is"', 'isLoading'),
];

// Test cases for custom single prefix configuration
const customSinglePrefixCases = [
  createBooleanPrefixInvalidCase('const visible = true;', 'visible', '"has"', 'hasVisible', 
    { allowedPrefixes: ['has'] }
  ),
];

// Test cases for custom multiple prefixes configuration
const customMultiplePrefixesCases = [
  createBooleanPrefixInvalidCase('const enabled = true;', 'enabled', '"is", "has", or "should"', 'isEnabled', 
    { allowedPrefixes: ['is', 'has', 'should'] }
  ),
  createBooleanPrefixInvalidCase('const VISIBLE = true;', 'VISIBLE', '"can", or "should"', 'CAN_VISIBLE', 
    { allowedPrefixes: ['can', 'should'] }
  ),
];

// Test cases for underscore-prefixed variables
const underscorePrefixedVariableCases = [
  createBooleanPrefixInvalidCase('const _enabled = true;', '_enabled', '"has"', '_hasEnabled', 
    { allowedPrefixes: ['has'] }
  ),
];

// Test cases for React useState hooks
const reactUseStateCases = [
  createBooleanPrefixInvalidCase('const [open, setOpen] = useState(false);', 'open', '"is"', 'isOpen'),
  createBooleanPrefixInvalidCase(
    'const [visible, setVisible] = useState(true);',
    'visible',
    '"can", or "should"',
    'canVisible',
    { allowedPrefixes: ['can', 'should'] }
  ),
];

// Test cases for interface properties
const interfacePropertyCases = [
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
        messageId: 'booleanShouldStartWithPrefix' as const,
      },
      {
        data: {
          name: 'visible',
          prefixes: '"is"',
          suggested: 'isVisible',
        },
        messageId: 'booleanShouldStartWithPrefix' as const,
      },
    ],
  },
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
        messageId: 'booleanShouldStartWithPrefix' as const,
      },
      {
        data: {
          name: 'enabled',
          prefixes: '"was", or "will"',
          suggested: 'wasEnabled',
        },
        messageId: 'booleanShouldStartWithPrefix' as const,
      },
    ],
    options: [{ allowedPrefixes: ['was', 'will'] }],
  },
];

// Test cases for object constants
const objectConstantCases = [
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
        messageId: 'booleanShouldStartWithPrefix' as const,
      },
      {
        data: {
          name: 'VISIBLE',
          prefixes: '"should"',
          suggested: 'SHOULD_VISIBLE',
        },
        messageId: 'booleanShouldStartWithPrefix' as const,
      },
    ],
    options: [{ allowedPrefixes: ['should'] }],
  },
];

// Test cases for variables with correct default "is" prefix
const correctDefaultPrefixCases = [
  createValidCase('const isVisible = true;'),
  createValidCase('let isDisabled = false;'),
  createValidCase('var isLoading = true;'),
];

// Test cases for underscore variables with correct prefix
const correctUnderscorePrefixCases = [
  createValidCase('const _isVisible = true;'),
  createValidCase('let _isDisabled = false;'),
];

// Test cases for variables with correct custom single prefix
const correctCustomSinglePrefixCases = [
  createValidCase('const hasPermission = true;', { allowedPrefixes: ['has'] }),
  createValidCase('const shouldRetry = false;', { allowedPrefixes: ['should'] }),
  createValidCase('const canAccess = true;', { allowedPrefixes: ['can'] }),
];

// Test cases for variables with correct custom multiple prefixes
const correctCustomMultiplePrefixesCases = [
  createValidCase('const isVisible = true;', { allowedPrefixes: ['is', 'has', 'should'] }),
  createValidCase('const hasPermission = false;', { allowedPrefixes: ['is', 'has', 'should'] }),
  createValidCase('const shouldRefresh = true;', { allowedPrefixes: ['is', 'has', 'should'] }),
];

// Test cases for constants with correct custom prefixes
const correctConstantPrefixCases = [
  createValidCase(
    `
        const CONFIG = {
          CAN_EDIT: true,
          SHOULD_VALIDATE: false,
        };
      `,
    { allowedPrefixes: ['can', 'should'] }
  ),
];

// Test cases for underscore variables with custom prefixes
const correctUnderscoreCustomPrefixCases = [
  createValidCase('const _hasAccess = true;', { allowedPrefixes: ['has'] }),
  createValidCase('const _canEdit = false;', { allowedPrefixes: ['can', 'will'] }),
];

// Test cases for React useState with correct custom prefix
const correctReactUseStateCases = [
  createValidCase('const [hasPermission, setHasPermission] = useState(false);', { allowedPrefixes: ['has'] }),
  createValidCase('const [shouldShow, setShouldShow] = useState(true);', { allowedPrefixes: ['should', 'can'] }),
];

// Test cases for interface properties with correct custom prefixes
const correctInterfacePropertyCases = [
  createValidCase(
    `
        interface ButtonProps {
          hasPermission: boolean;
          shouldDisable: boolean;
          onClick: () => void;
        }
      `,
    { allowedPrefixes: ['has', 'should'] }
  ),
  createValidCase(
    `
        interface ComponentProps {
          title: string;
          wasActive: boolean;
          count: number;
          willUpdate: boolean;
        }
      `,
    { allowedPrefixes: ['was', 'will'] }
  ),
];

// Test cases for non-boolean variables that should be ignored
const nonBooleanVariableCases = [
  createValidCase('const loading = "in-progress";', { allowedPrefixes: ['should'] }),
  createValidCase('const disabled = 0;', { allowedPrefixes: ['can'] }),
  createValidCase('const visible = "block";', { allowedPrefixes: ['has'] }),
];

// Test cases for non-boolean interface properties
const nonBooleanInterfaceCases = [
  createValidCase(
    `
        interface UserProps {
          name: string;
          age: number;
          status: 'active' | 'inactive';
        }
      `,
    { allowedPrefixes: ['should'] }
  ),
];

// Test cases for non-boolean useState
const nonBooleanUseStateCases = [
  createValidCase('const [count, setCount] = useState(0);', { allowedPrefixes: ['can'] }),
  createValidCase('const [name, setName] = useState("");', { allowedPrefixes: ['has'] }),
];

// Test cases for constants with correct IS_ prefix (default behavior)
const correctDefaultConstantCases = [
  createValidCase(`
        export const CONFIG = {
          API_URL: 'https://example.com',
          IS_DEVELOPMENT: false,
          IS_ENABLED: true,
          MAX_RETRIES: 3,
        };
      `),
  createValidCase(
    `
        const FLAGS = {
          CAN_EDIT: true,
          CAN_DELETE: false,
          SHOULD_VALIDATE: true,
        };
      `,
    { allowedPrefixes: ['can', 'should'] }
  ),
];

// Test cases for Zod schema methods that should be ignored
const zodSchemaCases = [
  createValidCase(
    `
        const userSchema = z.object({
          name: z.string(),
          age: z.number(),
          isActive: z.boolean(),
        });
        
        const publicUserSchema = userSchema.omit({
          isActive: true,
        });
      `,
    { allowedPrefixes: ['should'] }
  ),
  createValidCase(
    `
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
    { allowedPrefixes: ['can'] }
  ),
];

// Test cases for constructor calls and function parameters that should be ignored
const ignoredContextCases = [
  createValidCase('const client = new Realtime({ disabled: true });', { allowedPrefixes: ['should'] }),
  createValidCase(
    `
        function utilityFunction(enabled: boolean, disabled: boolean) {
          return enabled && !disabled;
        }
      `,
    { allowedPrefixes: ['can'] }
  ),
  createValidCase('const loading = someFunction();', { allowedPrefixes: ['has'] }),
  createValidCase(
    `
        function checkStatus(status: string): boolean {
          return status === 'active';
        }
      `,
    { allowedPrefixes: ['should'] }
  ),
];

// Test cases for complex expressions with correct custom prefixes
const complexExpressionCases = [
  createValidCase(
    `
        const hasAccess = hasPermission && !hasRestriction;
        const shouldProceed = canContinue && willSuccess;
      `,
    { allowedPrefixes: ['has', 'should', 'can', 'will'] }
  ),
];

const TEST_CASES = {
  invalid: [
    ...basicBooleanVariableCases,
    ...customSinglePrefixCases,
    ...customMultiplePrefixesCases,
    ...underscorePrefixedVariableCases,
    ...reactUseStateCases,
    ...interfacePropertyCases,
    ...objectConstantCases,
  ],
  valid: [
    ...correctDefaultPrefixCases,
    ...correctUnderscorePrefixCases,
    ...correctCustomSinglePrefixCases,
    ...correctCustomMultiplePrefixesCases,
    ...correctConstantPrefixCases,
    ...correctUnderscoreCustomPrefixCases,
    ...correctReactUseStateCases,
    ...correctInterfacePropertyCases,
    ...nonBooleanVariableCases,
    ...nonBooleanInterfaceCases,
    ...nonBooleanUseStateCases,
    ...correctDefaultConstantCases,
    ...zodSchemaCases,
    ...ignoredContextCases,
    ...complexExpressionCases,
  ],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('require-boolean-prefix-is', requireBooleanPrefixIs, TEST_CASES);
