import { RuleTester } from '@typescript-eslint/rule-tester';

import { noComplexJsxConditions } from '../../src/rules/no-complex-jsx-conditions';

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

ruleTester.run('no-complex-jsx-conditions', noComplexJsxConditions, {
  invalid: [
    // 1. Multiple AND conditions (original example)
    {
      code: `
        return (
          <div>
            <Conditional condition={user && data && !isLoading && !error}>
              <DataDisplay data={data} />
            </Conditional>
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 2. Complex OR with AND (original example)
    {
      code: `
        return (
          <div>
            <Conditional condition={(!isLoading && !error) || data?.length === 0}>
              <EmptyState />
            </Conditional>
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 3. Complex condition in JSX expression
    {
      code: `
        return (
          <div>
            {user && user.permissions && user.permissions.length > 0 && <AdminPanel />}
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 4. Complex ternary condition
    {
      code: `
        return (
          <div>
            {user && data && !isLoading ? <Success /> : <Loading />}
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 5. Complex condition in component prop
    {
      code: `
        return (
          <Button 
            disabled={!user || !user.isActive || user.role !== 'admin'} 
          >
            Submit
          </Button>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 6. Nested property access with multiple conditions
    {
      code: `
        return (
          <div>
            {user?.profile?.settings?.notifications && !isDisabled && hasPermission() && <NotificationBell />}
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 7. Multiple comparisons
    {
      code: `
        return (
          <div>
            {count > 0 && count < 100 && isValid && <Progress value={count} />}
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 8. Complex array/object checks
    {
      code: `
        return (
          <div>
            {items && items.length > 0 && !items.some(item => item.error) && <ItemList items={items} />}
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 9. Mixed operators
    {
      code: `
        return (
          <div>
            {(user && user.isActive) || (guest && allowGuests) && !maintenanceMode && <Content />}
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 10. Complex condition in multiple places - first instance
    {
      code: `
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
      errors: [
        {
          messageId: 'complexCondition',
        },
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 11. Function calls with multiple conditions
    {
      code: `
        return (
          <div>
            {checkUserAccess() && validateData() && !hasErrors() && <SecureContent />}
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 12. Complex condition with optional chaining
    {
      code: `
        return (
          <div>
            {user?.profile?.isComplete && data?.items?.length > 0 && !error && <Dashboard />}
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 13. Complex ternary with nested conditions
    {
      code: `
        return (
          <div>
            {user && isAuthenticated && hasPermission() ? 
              <AdminContent /> : 
              (isGuest && allowGuests ? <GuestContent /> : <LoginPrompt />)
            }
          </div>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 14. Multiple boolean attributes
    {
      code: `
        return (
          <Form
            disabled={!user || !user.isActive || user.role !== 'admin'}
            visible={data && data.length > 0 && !isLoading}
            required={user && user.settings && user.settings.strictMode}
          />
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
        {
          messageId: 'complexCondition',
        },
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 15. Complex condition in fragment
    {
      code: `
        return (
          <>
            {user && user.preferences && user.preferences.showAdvanced && !isMobile && (
              <AdvancedSettings />
            )}
          </>
        );
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 16. String/number operations
    {
      code: `
        return <div>{user.name && user.name.length > 3 && <Welcome />}</div>;
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
    // 18. Logical assignment operators
    {
      code: `
        return <div>{(user ||= defaultUser) && isActive && <Component />}</div>;
      `,
      errors: [
        {
          messageId: 'complexCondition',
        },
      ],
    },
  ],

  valid: [
    // 1. Simple boolean variables
    {
      code: `
        const isReady = true;
        return <div>{isReady && <Component />}</div>;
      `,
    },
    // 2. Single negation
    {
      code: `
        return <div>{!isLoading && <Component />}</div>;
      `,
    },
    // 3. Single property access
    {
      code: `
        return <div>{user.isActive && <Component />}</div>;
      `,
    },
    // 4. Single method call
    {
      code: `
        return <div>{hasPermission() && <Component />}</div>;
      `,
    },
    // 5. Extracted complex conditions
    {
      code: `
        const _canEdit = user && user.permissions && user.permissions.includes('edit');
        return <div>{_canEdit && <EditButton />}</div>;
      `,
    },
    // 6. Simple ternary with single variables
    {
      code: `
        return <div>{isLoading ? <Spinner /> : <Content />}</div>;
      `,
    },
    // 7. Simple comparison
    {
      code: `
        return <div>{count > 0 && <Counter value={count} />}</div>;
      `,
    },
    // 8. Single array/object check
    {
      code: `
        return <div>{items.length && <List items={items} />}</div>;
      `,
    },
    // 9. Extracted conditions in different JSX patterns
    {
      code: `
        const _shouldShow = user && !error;
        const _isEmpty = !data || data.length === 0;
        return (
          <div>
            {_shouldShow && <Component />}
            <button disabled={!_shouldShow}>Click</button>
            <Modal open={_isEmpty}>No data</Modal>
          </div>
        );
      `,
    },
    // 10. Simple boolean in component props
    {
      code: `
        const isEnabled = true;
        return <Button disabled={!isEnabled} />;
      `,
    },
    // Edge case: Parentheses that don't add complexity
    {
      code: `
        return <div>{(isLoading) && <Spinner />}</div>;
      `,
    },
    // Simple logical with simple operands
    {
      code: `
        return <div>{user && isActive && <Component />}</div>;
      `,
    },
    // Template literals are acceptable when not overly complex
    {
      code: `
        const message = \`Hello \${user.name}\`;
        return <div>{user && <Greeting message={message} />}</div>;
      `,
    },
    // Conditions in CSS class names or className utility functions
    {
      code: `
        return <Button className={cn(isInvalid && 'text-red-500')} />;
      `,
    },
    {
      code: `
        return <Button className={cn(size === 'right' && 'text-left')} />;
      `,
    },
    {
      code: `
        return <Button className={cva(size === 'right' && 'text-left')} />;
      `,
    },
    {
      code: `
        return <Button className={clsx(size === 'right' && 'text-left')} />;
      `,
    },
    {
      code: `
        return <Button className={cx(size === 'right' && 'text-left')} />;
      `,
    },
    {
      code: `
        return <Button className={cn( { 'text-left' : size === 'right'})} />;
      `,
    },
    {
      code: `
        return <Button className={cn([size === 'left' && 'text-left'], 'font-bold')} />;
      `,
    },
    {
      code: `
        return <Button className={cn(size === 'left' ? 'text-left' : 'font-bold')} />;
      `,
    },
    {
      code: `
       <Content
        className={cn(
          'fixed z-50 flex',
          side === 'right' && 'inset-y-0 right-0',
          className,
        )}
      >
      `,
    },
  ],
});
