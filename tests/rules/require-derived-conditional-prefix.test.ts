import { RuleTester } from '@typescript-eslint/rule-tester';

import { requireDerivedConditionalPrefix } from '../../src/rules/require-derived-conditional-prefix';

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

ruleTester.run('require-derived-conditional-prefix', requireDerivedConditionalPrefix, {
  invalid: [
    // Basic logical AND expressions used in JSX conditional rendering
    {
      code: `
        const isSubmitReady = isValid && !isLoading;
        return <div>{isSubmitReady && <button>Submit</button>}</div>;
      `,
      errors: [
        {
          data: {
            name: 'isSubmitReady',
            suggested: '_isSubmitReady',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Logical OR expressions used in JSX conditional rendering
    {
      code: `
        const hasError = error || validationError;
        return <div>{hasError && <ErrorMessage />}</div>;
      `,
      errors: [
        {
          data: {
            name: 'hasError',
            suggested: '_hasError',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Complex logical expressions with multiple operators
    {
      code: `
        const canProceed = isAuthenticated && isVerified && !isBanned;
        return <Conditional condition={canProceed}><NextStep /></Conditional>;
      `,
      errors: [
        {
          data: {
            name: 'canProceed',
            suggested: '_canProceed',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Negation expressions used in conditional rendering
    {
      code: `
        const hasNoResults = !results || results.length === 0;
        return <div>{hasNoResults ? <EmptyState /> : <ResultsList />}</div>;
      `,
      errors: [
        {
          data: {
            name: 'hasNoResults',
            suggested: '_hasNoResults',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Comparison expressions used in conditional rendering
    {
      code: `
        const isCompleteProfile = user.progress === 100;
        return <div>{isCompleteProfile && <CompleteProfileBanner />}</div>;
      `,
      errors: [
        {
          data: {
            name: 'isCompleteProfile',
            suggested: '_isCompleteProfile',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Multiple derived variables in same component
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
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
        {
          data: {
            name: 'canSubmit',
            suggested: '_canSubmit',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Variables with double negation used in conditional rendering
    {
      code: `
        const isCompleteProfile = !!user.name && !!user.email;
        return isCompleteProfile ? <CompleteView /> : <IncompleteView />;
      `,
      errors: [
        {
          data: {
            name: 'isCompleteProfile',
            suggested: '_isCompleteProfile',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Arrow function component with derived conditionals
    {
      code: `
        const Component = () => {
          const shouldRender = isVisible && hasPermission;
          return <div>{shouldRender && <SecureContent />}</div>;
        };
      `,
      errors: [
        {
          data: {
            name: 'shouldRender',
            suggested: '_shouldRender',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Function declaration component with derived conditionals
    {
      code: `
        function Component() {
          const readyToShow = isLoaded && !isError && hasData;
          return <div>{readyToShow ? <Content /> : <Loading />}</div>;
        }
      `,
      errors: [
        {
          data: {
            name: 'readyToShow',
            suggested: '_readyToShow',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // forwardRef component with derived conditionals
    {
      code: `
        const Input = forwardRef(() => {
          const showError = hasError && !isLoading;
          return <div>{showError && <ErrorText />}</div>;
        });
      `,
      errors: [
        {
          data: {
            name: 'showError',
            suggested: '_showError',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Variables used in ternary expressions within JSX
    {
      code: `
        const isReady = isLoaded && !isLoading;
        return <div>{isReady ? <Content /> : <Placeholder />}</div>;
      `,
      errors: [
        {
          data: {
            name: 'isReady',
            suggested: '_isReady',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Variables used in logical AND expressions within JSX
    {
      code: `
        const canEdit = hasPermission && !isReadOnly;
        return <div>{canEdit && <EditButton />}</div>;
      `,
      errors: [
        {
          data: {
            name: 'canEdit',
            suggested: '_canEdit',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Const variables with let/var alternatives
    {
      code: `
        let isAvailable = inStock && !isReserved;
        return <div>{isAvailable && <AddToCart />}</div>;
      `,
      errors: [
        {
          data: {
            name: 'isAvailable',
            suggested: '_isAvailable',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },
    {
      code: `
        var shouldDisplay = isActive || isPending;
        return <div>{shouldDisplay ? <StatusIcon /> : null}</div>;
      `,
      errors: [
        {
          data: {
            name: 'shouldDisplay',
            suggested: '_shouldDisplay',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Variables used in custom conditional components
    {
      code: `
        const isEligible = age >= 18 && hasLicense;
        return <Conditional condition={isEligible}><DriveForm /></Conditional>;
      `,
      errors: [
        {
          data: {
            name: 'isEligible',
            suggested: '_isEligible',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Nested conditions within components
    {
      code: `
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
      errors: [
        {
          data: {
            name: 'showModal',
            suggested: '_showModal',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Mixed expressions with comparison and logical operators
    {
      code: `
        const hasValidData = data && data.length > 0 && !data.hasError;
        return <div>{hasValidData ? <DataTable /> : <EmptyState />}</div>;
      `,
      errors: [
        {
          data: {
            name: 'hasValidData',
            suggested: '_hasValidData',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Variables already starting with "is" but are derived and used conditionally
    {
      code: `
        const isCompleteAndValid = isComplete && isValid;
        return <div>{isCompleteAndValid && <SuccessMessage />}</div>;
      `,
      errors: [
        {
          data: {
            name: 'isCompleteAndValid',
            suggested: '_isCompleteAndValid',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },

    // Variables with "has", "can", "should" prefixes that are derived
    {
      code: `
        const canProceedNow = canProceed && !isBlocked;
        return <div>{canProceedNow ? <ProceedButton /> : <BlockedMessage />}</div>;
      `,
      errors: [
        {
          data: {
            name: 'canProceedNow',
            suggested: '_canProceedNow',
          },
          messageId: 'derivedConditionalShouldStartWithUnderscore',
        },
      ],
    },
  ],

  valid: [
    // Simple boolean state/props with correct "is" prefix (should not trigger underscore rule)
    {
      code: `
        const isVisible = true;
        return <div>{isVisible && <span>Content</span>}</div>;
      `,
    },
    {
      code: `
        const [isOpen, setIsOpen] = useState(false);
        return <div>{isOpen ? <Modal /> : null}</div>;
      `,
    },

    // Derived conditional variables with correct underscore prefix
    {
      code: `
        const _isSubmitReady = isValid && !isLoading && hasData;
        return <div>{_isSubmitReady && <button>Submit</button>}</div>;
      `,
    },
    {
      code: `
        const _shouldShowError = hasError && !isLoading;
        return <div>{_shouldShowError ? <ErrorMessage /> : null}</div>;
      `,
    },
    {
      code: `
        const _canProceed = isAuthenticated && isVerified && !isBanned;
        return <Conditional condition={_canProceed}><NextStep /></Conditional>;
      `,
    },

    // Complex expressions with underscore prefix in different contexts
    {
      code: `
        const _hasNoResults = !results || results.length === 0;
        return <div>{_hasNoResults && <EmptyState />}</div>;
      `,
    },
    {
      code: `
        const _isCompleteProfile = !!user.name && !!user.email && !!user.avatar;
        return _isCompleteProfile ? <CompleteView /> : <IncompleteView />;
      `,
    },

    // Arrow function components
    {
      code: `
        const Component = () => {
          const _showWarning = isExpired || hasIssues;
          return <div>{_showWarning && <Warning />}</div>;
        };
      `,
    },

    // forwardRef components
    {
      code: `
        const Component = forwardRef(() => {
          const _isReady = isLoaded && !isError;
          return <div>{_isReady && <Content />}</div>;
        });
      `,
    },

    // Variables used outside JSX (should not trigger rule)
    {
      code: `
        const readyForSubmit = isValid && !isLoading;
        if (readyForSubmit) {
          console.log('Ready!');
        }
        return <div>Not used in JSX</div>;
      `,
    },

    // Simple boolean variables not used in conditional rendering
    {
      code: `
        const ready = isLoaded && !isError;
        return <div>Status: {ready.toString()}</div>;
      `,
    },

    // Variables that are not derived (single identifier or literal)
    {
      code: `
        const visible = someBoolean;
        return <div>{visible && <span>Content</span>}</div>;
      `,
    },
    {
      code: `
        const visible = true;
        return <div>{visible && <span>Content</span>}</div>;
      `,
    },

    // Non-boolean expressions
    {
      code: `
        const message = error || 'No error';
        return <div>{message && <span>{message}</span>}</div>;
      `,
    },

    // Function calls that return boolean
    {
      code: `
        const canEdit = checkPermissions();
        return <div>{canEdit && <EditButton />}</div>;
      `,
    },

    // Ternary expressions in JSX without derived variables
    {
      code: `
        return <div>{isLoading ? <Spinner /> : isError ? <Error /> : <Content />}</div>;
      `,
    },

    // Variables used in non-conditional JSX contexts
    {
      code: `
        const hasItems = items && items.length > 0;
        return <div className={hasItems ? 'with-items' : 'empty'}>Content</div>;
      `,
    },
  ],
});
