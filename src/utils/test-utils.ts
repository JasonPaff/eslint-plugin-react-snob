// Parser configuration for JSX testing
export const PARSER_CONFIG = {
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2020,
      sourceType: 'module' as const,
    },
  },
} as const;

// Helper function to create invalid test cases
export function createInvalidCase(code: string, output: string, errors: Array<{ attribute: string; value: string }>) {
  return {
    code,
    errors: errors.map((error) => ({
      data: error,
      messageId: 'requireBraces' as const,
    })),
    output,
  };
}

// Helper function to create invalid test cases for no-inline-styles rule
export function createNoInlineStylesInvalidCase(code: string) {
  return {
    code,
    errors: [
      {
        messageId: 'noInlineStyle' as const,
      },
    ],
  };
}

// Helper function to create invalid test cases for no-complex-jsx-conditions rule
export function createComplexConditionInvalidCase(code: string, errorCount: number = 1) {
  return {
    code,
    errors: Array(errorCount).fill({
      messageId: 'complexCondition' as const,
    }),
  };
}

// Helper function to create valid test cases
export function createValidCase(code: string) {
  return { code };
}
