import { RuleTester } from '@typescript-eslint/rule-tester';

import { noComplexJsxConditions } from '../../src/rules/no-complex-jsx-conditions';
import { createComplexConditionInvalidCase, createValidCase, PARSER_CONFIG } from '../../src/utils/test-utils';

// Test cases for multiple AND conditions in component props
const multipleAndConditionCases = [
  createComplexConditionInvalidCase(`
    return (
      <div>
        <Conditional condition={user && data && !isLoading && !error}>
          <DataDisplay data={data} />
        </Conditional>
      </div>
    );
  `),
  createComplexConditionInvalidCase(`
    return (
      <div>
        {user && user.permissions && user.permissions.length > 0 && <AdminPanel />}
      </div>
    );
  `),
  createComplexConditionInvalidCase(`
    return (
      <div>
        {user?.profile?.settings?.notifications && !isDisabled && hasPermission() && <NotificationBell />}
      </div>
    );
  `),
];

// Test cases for complex OR and mixed logical operators
const mixedLogicalOperatorCases = [
  createComplexConditionInvalidCase(`
    return (
      <div>
        <Conditional condition={(!isLoading && !error) || data?.length === 0}>
          <EmptyState />
        </Conditional>
      </div>
    );
  `),
  createComplexConditionInvalidCase(`
    return (
      <div>
        {(user && user.isActive) || (guest && allowGuests) && !maintenanceMode && <Content />}
      </div>
    );
  `),
];

// Test cases for complex ternary conditions
const complexTernaryCases = [
  createComplexConditionInvalidCase(`
    return (
      <div>
        {user && data && !isLoading ? <Success /> : <Loading />}
      </div>
    );
  `),
  createComplexConditionInvalidCase(`
    return (
      <div>
        {user && isAuthenticated && hasPermission() ? 
          <AdminContent /> : 
          (isGuest && allowGuests ? <GuestContent /> : <LoginPrompt />)
        }
      </div>
    );
  `),
];

// Test cases for complex conditions in component attributes
const componentAttributeCases = [
  createComplexConditionInvalidCase(`
    return (
      <Button 
        disabled={!user || !user.isActive || user.role !== 'admin'} 
      >
        Submit
      </Button>
    );
  `),
  createComplexConditionInvalidCase(
    `
    return (
      <Form
        disabled={!user || !user.isActive || user.role !== 'admin'}
        visible={data && data.length > 0 && !isLoading}
        required={user && user.settings && user.settings.strictMode}
      />
    );
  `,
    3
  ),
];

// Test cases for complex comparisons and array operations
const complexComparisonCases = [
  createComplexConditionInvalidCase(`
    return (
      <div>
        {count > 0 && count < 100 && isValid && <Progress value={count} />}
      </div>
    );
  `),
  createComplexConditionInvalidCase(`
    return (
      <div>
        {items && items.length > 0 && !items.some(item => item.error) && <ItemList items={items} />}
      </div>
    );
  `),
  createComplexConditionInvalidCase(`
    return <div>{user.name && user.name.length > 3 && <Welcome />}</div>;
  `),
];

// Test cases for function calls and method chaining
const functionCallCases = [
  createComplexConditionInvalidCase(`
    return (
      <div>
        {checkUserAccess() && validateData() && !hasErrors() && <SecureContent />}
      </div>
    );
  `),
  createComplexConditionInvalidCase(`
    return (
      <div>
        {user?.profile?.isComplete && data?.items?.length > 0 && !error && <Dashboard />}
      </div>
    );
  `),
];

// Test cases for multiple complex conditions in same component
const multipleComplexConditionCases = [
  createComplexConditionInvalidCase(
    `
    return (
      <div>
        <Modal open={user && data && !isLoading && !error}>
          <Content />
        </Modal>
        <Button disabled={user && data && !isLoading && !error}>
          Save
        </Button>
      </div>
    );
  `,
    2
  ),
];

// Test cases for complex conditions in fragments and special syntax
const fragmentAndSpecialSyntaxCases = [
  createComplexConditionInvalidCase(`
    return (
      <>
        {user && user.preferences && user.preferences.showAdvanced && !isMobile && (
          <AdvancedSettings />
        )}
      </>
    );
  `),
  createComplexConditionInvalidCase(`
    return <div>{(user ||= defaultUser) && isActive && <Component />}</div>;
  `),
];

// Test cases for simple boolean variables and single conditions
const simpleBooleanCases = [
  createValidCase(`
    const isReady = true;
    return <div>{isReady && <Component />}</div>;
  `),
  createValidCase(`
    return <div>{!isLoading && <Component />}</div>;
  `),
  createValidCase(`
    return <div>{user.isActive && <Component />}</div>;
  `),
  createValidCase(`
    return <div>{hasPermission() && <Component />}</div>;
  `),
];

// Test cases for extracted complex conditions
const extractedConditionCases = [
  createValidCase(`
    const _canEdit = user && user.permissions && user.permissions.includes('edit');
    return <div>{_canEdit && <EditButton />}</div>;
  `),
  createValidCase(`
    const _shouldShow = user && !error;
    const _isEmpty = !data || data.length === 0;
    return (
      <div>
        {_shouldShow && <Component />}
        <button disabled={!_shouldShow}>Click</button>
        <Modal open={_isEmpty}>No data</Modal>
      </div>
    );
  `),
];

// Test cases for simple ternary and comparison operations
const simpleTernaryAndComparisonCases = [
  createValidCase(`
    return <div>{isLoading ? <Spinner /> : <Content />}</div>;
  `),
  createValidCase(`
    return <div>{count > 0 && <Counter value={count} />}</div>;
  `),
  createValidCase(`
    return <div>{items.length && <List items={items} />}</div>;
  `),
];

// Test cases for simple boolean props and edge cases
const simpleBooleanPropCases = [
  createValidCase(`
    const isEnabled = true;
    return <Button disabled={!isEnabled} />;
  `),
  createValidCase(`
    return <div>{(isLoading) && <Spinner />}</div>;
  `),
  createValidCase(`
    return <div>{user && isActive && <Component />}</div>;
  `),
];

// Test cases for template literals and className utilities
const templateLiteralAndClassNameCases = [
  createValidCase(`
    const message = \`Hello \${user.name}\`;
    return <div>{user && <Greeting message={message} />}</div>;
  `),
  createValidCase(`
    return <Button className={cn(isInvalid && 'text-red-500')} />;
  `),
  createValidCase(`
    return <Button className={cn(size === 'right' && 'text-left')} />;
  `),
  createValidCase(`
    return <Button className={cva(size === 'right' && 'text-left')} />;
  `),
  createValidCase(`
    return <Button className={clsx(size === 'right' && 'text-left')} />;
  `),
  createValidCase(`
    return <Button className={cx(size === 'right' && 'text-left')} />;
  `),
  createValidCase(`
    return <Button className={cn( { 'text-left' : size === 'right'})} />;
  `),
  createValidCase(`
    return <Button className={cn([size === 'left' && 'text-left'], 'font-bold')} />;
  `),
  createValidCase(`
    return <Button className={cn(size === 'left' ? 'text-left' : 'font-bold')} />;
  `),
  createValidCase(`
   <Content
        className={cn(
          'fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out',
          'data-[state=closed]:duration-300 data-[state=closed]:animate-out data-[state=open]:duration-500 data-[state=open]:animate-in',
          side === 'right' &&
            'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
          side === 'left' &&
            'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
          side === 'top' &&
            'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
          className,
        )}
      >
        {children}
      </Content>
  `),
];

const TEST_CASES = {
  invalid: [
    ...multipleAndConditionCases,
    ...mixedLogicalOperatorCases,
    ...complexTernaryCases,
    ...componentAttributeCases,
    ...complexComparisonCases,
    ...functionCallCases,
    ...multipleComplexConditionCases,
    ...fragmentAndSpecialSyntaxCases,
  ],
  valid: [
    ...simpleBooleanCases,
    ...extractedConditionCases,
    ...simpleTernaryAndComparisonCases,
    ...simpleBooleanPropCases,
    ...templateLiteralAndClassNameCases,
  ],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('no-complex-jsx-conditions', noComplexJsxConditions, TEST_CASES);
