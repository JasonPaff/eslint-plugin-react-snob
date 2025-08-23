import { ESLintUtils } from '@typescript-eslint/utils';

/**
 * Creates a rule creator with consistent documentation URL pattern for all plugin rules
 */
export const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/jasonpaff/eslint-plugin-react-snob/blob/main/docs/rules/${name}.md`
);
