import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireDerivedConditionalPrefix } from '../../src/rules/require-derived-conditional-prefix';
import { createValidCase, createDerivedConditionalInvalidCase, PARSER_CONFIG } from '../../src/utils/test-utils';

// Test cases for basic logical expressions used in JSX conditional rendering
const basicLogicalExpressionCases = [
  createDerivedConditionalInvalidCase(
    `
      const isSubmitReady = isValid && !isLoading;
      return <div>{isSubmitReady && <button>Submit</button>}</div>;
    `,
    'isSubmitReady',
    '_isSubmitReady'
  ),
  createDerivedConditionalInvalidCase(
    `
      const hasError = error || validationError;
      return <div>{hasError && <ErrorMessage />}</div>;
    `,
    'hasError',
    '_hasError'
  ),
  createDerivedConditionalInvalidCase(
    `
      const canEdit = hasPermission && !isReadOnly;
      return <div>{canEdit && <EditButton />}</div>;
    `,
    'canEdit',
    '_canEdit'
  ),
];

// Test cases for complex logical expressions with multiple operators
const complexLogicalExpressionCases = [
  createDerivedConditionalInvalidCase(
    `
      const canProceed = isAuthenticated && isVerified && !isBanned;
      return <Conditional condition={canProceed}><NextStep /></Conditional>;
    `,
    'canProceed',
    '_canProceed'
  ),
  createDerivedConditionalInvalidCase(
    `
      const hasValidData = data && data.length > 0 && !data.hasError;
      return <div>{hasValidData ? <DataTable /> : <EmptyState />}</div>;
    `,
    'hasValidData',
    '_hasValidData'
  ),
];

// Test cases for negation and comparison expressions
const negationAndComparisonCases = [
  createDerivedConditionalInvalidCase(
    `
      const hasNoResults = !results || results.length === 0;
      return <div>{hasNoResults ? <EmptyState /> : <ResultsList />}</div>;
    `,
    'hasNoResults',
    '_hasNoResults'
  ),
  createDerivedConditionalInvalidCase(
    `
      const isCompleteProfile = user.progress === 100;
      return <div>{isCompleteProfile && <CompleteProfileBanner />}</div>;
    `,
    'isCompleteProfile',
    '_isCompleteProfile'
  ),
  createDerivedConditionalInvalidCase(
    `
      const isCompleteProfile = !!user.name && !!user.email;
      return isCompleteProfile ? <CompleteView /> : <IncompleteView />;
    `,
    'isCompleteProfile',
    '_isCompleteProfile'
  ),
];

// Test cases for multiple derived variables in the same component
const multipleVariableCases = [
  {
    code: `
      const showWarning = isExpired || hasIssues;
      const canSubmit = isValid && !isLoading;
      return (
        <div>
          {showWarning && <Warning />}
          {canSubmit && <button>Submit</button>}
        </div>
      );
    `,
    errors: [
      {
        data: {
          name: 'showWarning',
          suggested: '_showWarning',
        },
        messageId: 'derivedConditionalShouldStartWithUnderscore' as const,
      },
      {
        data: {
          name: 'canSubmit',
          suggested: '_canSubmit',
        },
        messageId: 'derivedConditionalShouldStartWithUnderscore' as const,
      },
    ],
  },
];

// Test cases for different component types (arrow functions, function declarations, forwardRef)
const componentTypeCases = [
  createDerivedConditionalInvalidCase(
    `
      const Component = () => {
        const shouldRender = isVisible && hasPermission;
        return <div>{shouldRender && <SecureContent />}</div>;
      };
    `,
    'shouldRender',
    '_shouldRender'
  ),
  createDerivedConditionalInvalidCase(
    `
      function Component() {
        const readyToShow = isLoaded && !isError && hasData;
        return <div>{readyToShow ? <Content /> : <Loading />}</div>;
      }
    `,
    'readyToShow',
    '_readyToShow'
  ),
  createDerivedConditionalInvalidCase(
    `
      const Input = forwardRef(() => {
        const showError = hasError && !isLoading;
        return <div>{showError && <ErrorText />}</div>;
      });
    `,
    'showError',
    '_showError'
  ),
];

// Test cases for different JSX conditional patterns (ternary, logical AND, custom components)
const jsxConditionalPatternCases = [
  createDerivedConditionalInvalidCase(
    `
      const isReady = isLoaded && !isLoading;
      return <div>{isReady ? <Content /> : <Placeholder />}</div>;
    `,
    'isReady',
    '_isReady'
  ),
  createDerivedConditionalInvalidCase(
    `
      const isEligible = age >= 18 && hasLicense;
      return <Conditional condition={isEligible}><DriveForm /></Conditional>;
    `,
    'isEligible',
    '_isEligible'
  ),
  createDerivedConditionalInvalidCase(
    `
      function Component() {
        const showModal = isOpen && hasContent;
        return (
          <div>
            {showModal && (
              <Modal>
                <Content />
              </Modal>
            )}
          </div>
        );
      }
    `,
    'showModal',
    '_showModal'
  ),
];

// Test cases for different variable declaration types (const, let, var)
const variableDeclarationTypeCases = [
  createDerivedConditionalInvalidCase(
    `
      let isAvailable = inStock && !isReserved;
      return <div>{isAvailable && <AddToCart />}</div>;
    `,
    'isAvailable',
    '_isAvailable'
  ),
  createDerivedConditionalInvalidCase(
    `
      var shouldDisplay = isActive || isPending;
      return <div>{shouldDisplay ? <StatusIcon /> : null}</div>;
    `,
    'shouldDisplay',
    '_shouldDisplay'
  ),
];

// Test cases for variables with boolean-like prefixes that are still derived
const booleanPrefixDerivedCases = [
  createDerivedConditionalInvalidCase(
    `
      const isCompleteAndValid = isComplete && isValid;
      return <div>{isCompleteAndValid && <SuccessMessage />}</div>;
    `,
    'isCompleteAndValid',
    '_isCompleteAndValid'
  ),
  createDerivedConditionalInvalidCase(
    `
      const canProceedNow = canProceed && !isBlocked;
      return <div>{canProceedNow ? <ProceedButton /> : <BlockedMessage />}</div>;
    `,
    'canProceedNow',
    '_canProceedNow'
  ),
];

// Test cases for simple boolean state/props that should not trigger the rule
const simpleBooleanStateCases = [
  createValidCase(`
    const isVisible = true;
    return <div>{isVisible && <span>Content</span>}</div>;
  `),
  createValidCase(`
    const [isOpen, setIsOpen] = useState(false);
    return <div>{isOpen ? <Modal /> : null}</div>;
  `),
];

// Test cases for derived conditional variables with correct underscore prefix
const correctUnderscorePrefixCases = [
  createValidCase(`
    const _isSubmitReady = isValid && !isLoading && hasData;
    return <div>{_isSubmitReady && <button>Submit</button>}</div>;
  `),
  createValidCase(`
    const _shouldShowError = hasError && !isLoading;
    return <div>{_shouldShowError ? <ErrorMessage /> : null}</div>;
  `),
  createValidCase(`
    const _canProceed = isAuthenticated && isVerified && !isBanned;
    return <Conditional condition={_canProceed}><NextStep /></Conditional>;
  `),
  createValidCase(`
    const _hasNoResults = !results || results.length === 0;
    return <div>{_hasNoResults && <EmptyState />}</div>;
  `),
  createValidCase(`
    const _isCompleteProfile = !!user.name && !!user.email && !!user.avatar;
    return _isCompleteProfile ? <CompleteView /> : <IncompleteView />;
  `),
];

// Test cases for different component types with correct underscore prefix
const correctComponentTypeCases = [
  createValidCase(`
    const Component = () => {
      const _showWarning = isExpired || hasIssues;
      return <div>{_showWarning && <Warning />}</div>;
    };
  `),
  createValidCase(`
    const Component = forwardRef(() => {
      const _isReady = isLoaded && !isError;
      return <div>{_isReady && <Content />}</div>;
    });
  `),
];

// Test cases for variables used outside JSX that should not trigger the rule
const nonJsxUsageCases = [
  createValidCase(`
    const readyForSubmit = isValid && !isLoading;
    if (readyForSubmit) {
      console.log('Ready!');
    }
    return <div>Not used in JSX</div>;
  `),
  createValidCase(`
    const ready = isLoaded && !isError;
    return <div>Status: {ready.toString()}</div>;
  `),
  createValidCase(`
    const hasItems = items && items.length > 0;
    return <div className={hasItems ? 'with-items' : 'empty'}>Content</div>;
  `),
];

// Test cases for variables that are not derived (single identifier or literal)
const nonDerivedVariableCases = [
  createValidCase(`
    const visible = someBoolean;
    return <div>{visible && <span>Content</span>}</div>;
  `),
  createValidCase(`
    const visible = true;
    return <div>{visible && <span>Content</span>}</div>;
  `),
  createValidCase(`
    const canEdit = checkPermissions();
    return <div>{canEdit && <EditButton />}</div>;
  `),
];

// Test cases for non-boolean expressions and inline JSX conditionals
const nonBooleanAndInlineCases = [
  createValidCase(`
    const message = error || 'No error';
    return <div>{message && <span>{message}</span>}</div>;
  `),
  createValidCase(`
    return <div>{isLoading ? <Spinner /> : isError ? <Error /> : <Content />}</div>;
  `),
];

const TEST_CASES = {
  invalid: [
    ...basicLogicalExpressionCases,
    ...complexLogicalExpressionCases,
    ...negationAndComparisonCases,
    ...multipleVariableCases,
    ...componentTypeCases,
    ...jsxConditionalPatternCases,
    ...variableDeclarationTypeCases,
    ...booleanPrefixDerivedCases,
  ],
  valid: [
    ...simpleBooleanStateCases,
    ...correctUnderscorePrefixCases,
    ...correctComponentTypeCases,
    ...nonJsxUsageCases,
    ...nonDerivedVariableCases,
    ...nonBooleanAndInlineCases,
  ],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('require-derived-conditional-prefix', requireDerivedConditionalPrefix, TEST_CASES);
