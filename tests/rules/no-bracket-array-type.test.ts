import { RuleTester } from '@typescript-eslint/rule-tester';

import { noBracketArrayType } from '../../src/rules/no-bracket-array-type';
import { PARSER_CONFIG } from '../../src/utils/test-utils';

// Test cases for simple primitive array types
const simplePrimitiveArrayCases = [
  {
    code: 'const items: string[] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const items: Array<string> = [];',
  },
  {
    code: 'const numbers: number[] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const numbers: Array<number> = [];',
  },
  {
    code: 'const flags: boolean[] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const flags: Array<boolean> = [];',
  },
];

// Test cases for nested array types
const nestedArrayCases = [
  {
    code: 'const matrix: string[][] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const matrix: Array<Array<string>> = [];',
  },
  {
    code: 'const cube: number[][][] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const cube: Array<Array<Array<number>>> = [];',
  },
];

// Test cases for complex/custom types
const complexTypeCases = [
  {
    code: 'const files: DiscoveredFile[] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const files: Array<DiscoveredFile> = [];',
  },
  {
    code: 'const users: ManualFile[] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const users: Array<ManualFile> = [];',
  },
];

// Test cases for object literal types
const objectLiteralCases = [
  {
    code: 'type Users = { id: string; name: string; }[];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'type Users = Array<{ id: string; name: string; }>;',
  },
  {
    code: 'const items: { id: number }[] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const items: Array<{ id: number }> = [];',
  },
];

// Test cases for function parameters
const functionParameterCases = [
  {
    code: 'const doThing = (items: string[]) => {}',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const doThing = (items: Array<string>) => {}',
  },
  {
    code: 'function doThing(items: string[][]) {}',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'function doThing(items: Array<Array<string>>) {}',
  },
  {
    code: 'function process(data: number[], flags: boolean[]) {}',
    errors: [{ messageId: 'useBracketArrayType' }, { messageId: 'useBracketArrayType' }],
    output: 'function process(data: Array<number>, flags: Array<boolean>) {}',
  },
];

// Test cases for function return types
const functionReturnTypeCases = [
  {
    code: 'function getItems(): string[] { return []; }',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'function getItems(): Array<string> { return []; }',
  },
  {
    code: 'const getNumbers = (): number[] => [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const getNumbers = (): Array<number> => [];',
  },
];

// Test cases for interface properties
const interfacePropertyCases = [
  {
    code: `interface PriorityGroupProps {
  files: DiscoveredFile[];
  label: string[][];
  manualFiles: ManualFile[];
  onRemoveManualFile?: (filePath: string[]) => void;
  onSelectFiles: (fileKeys: string[]) => void;
  selectedFiles: string[];
  variant: BadgeVariant;
}`,
    errors: [
      { messageId: 'useBracketArrayType' }, // files
      { messageId: 'useBracketArrayType' }, // label (only outer array reported)
      { messageId: 'useBracketArrayType' }, // manualFiles
      { messageId: 'useBracketArrayType' }, // onRemoveManualFile param
      { messageId: 'useBracketArrayType' }, // onSelectFiles param
      { messageId: 'useBracketArrayType' }, // selectedFiles
    ],
    output: `interface PriorityGroupProps {
  files: Array<DiscoveredFile>;
  label: Array<Array<string>>;
  manualFiles: Array<ManualFile>;
  onRemoveManualFile?: (filePath: Array<string>) => void;
  onSelectFiles: (fileKeys: Array<string>) => void;
  selectedFiles: Array<string>;
  variant: BadgeVariant;
}`,
  },
];

// Test cases for type aliases
const typeAliasCases = [
  {
    code: 'type StringArray = string[];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'type StringArray = Array<string>;',
  },
  {
    code: 'type UserList = User[];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'type UserList = Array<User>;',
  },
];

// Test cases for union and intersection types
const unionIntersectionCases = [
  {
    code: 'const items: (string | number)[] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const items: Array<string | number> = [];',
  },
  {
    code: 'type MixedArray = (string | number)[];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'type MixedArray = Array<string | number>;',
  },
];

// Test cases for readonly arrays
const readonlyArrayCases = [
  {
    code: 'const items: readonly string[] = [];',
    errors: [{ messageId: 'useBracketArrayType' }],
    output: 'const items: readonly Array<string> = [];',
  },
];

// Test cases for tuple types (should not be flagged - tuples are different from arrays)
const tupleCases = [
  {
    code: 'const tuple: [string, number] = ["hello", 42];',
    errors: [],
  },
  {
    code: 'type Pair = [string, number];',
    errors: [],
  },
];

// Valid test cases - already using Array<T> syntax
const validArrayGenericCases = [
  'const items: Array<string> = [];',
  'const numbers: Array<number> = [];',
  'const matrix: Array<Array<string>> = [];',
  'function process(items: Array<string>) {}',
  'interface Props { items: Array<string>; }',
  'type Users = Array<User>;',
  'const mixed: Array<string | number> = [];',
];

const TEST_CASES = {
  invalid: [
    ...simplePrimitiveArrayCases,
    ...nestedArrayCases,
    ...complexTypeCases,
    ...objectLiteralCases,
    ...functionParameterCases,
    ...functionReturnTypeCases,
    ...interfacePropertyCases,
    ...typeAliasCases,
    ...unionIntersectionCases,
    ...readonlyArrayCases,
  ],
  valid: [...validArrayGenericCases, ...tupleCases],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('no-bracket-array-type', noBracketArrayType, TEST_CASES);
