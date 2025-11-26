import { RuleTester } from '@typescript-eslint/rule-tester';

import { noReactNamespace } from '../../src/rules/no-react-namespace';
import { createValidCase, PARSER_CONFIG } from '../../src/utils/test-utils';

// Helper function to create invalid test cases for this rule with auto-fix output
function createNoReactNamespaceInvalidCase(
  code: string,
  member: string,
  output: string,
  messageId: 'noReactNamespace' | 'noReactNamespaceType' = 'noReactNamespace'
) {
  return {
    code,
    errors: [
      {
        data: { member },
        messageId,
      },
    ],
    output,
  };
}

// ============================================
// INVALID CASES - React.* runtime values
// ============================================

// Test cases for React hooks accessed via namespace
const hookNamespaceCases = [
  createNoReactNamespaceInvalidCase(
    'const [count, setCount] = React.useState(0);',
    'useState',
    "import { useState } from 'react';\nconst [count, setCount] = useState(0);"
  ),
  createNoReactNamespaceInvalidCase(
    'React.useEffect(() => {}, []);',
    'useEffect',
    "import { useEffect } from 'react';\nuseEffect(() => {}, []);"
  ),
  createNoReactNamespaceInvalidCase(
    'const ref = React.useRef(null);',
    'useRef',
    "import { useRef } from 'react';\nconst ref = useRef(null);"
  ),
  createNoReactNamespaceInvalidCase(
    'const value = React.useContext(MyContext);',
    'useContext',
    "import { useContext } from 'react';\nconst value = useContext(MyContext);"
  ),
  createNoReactNamespaceInvalidCase(
    'const [state, dispatch] = React.useReducer(reducer, initialState);',
    'useReducer',
    "import { useReducer } from 'react';\nconst [state, dispatch] = useReducer(reducer, initialState);"
  ),
  createNoReactNamespaceInvalidCase(
    'const memoized = React.useMemo(() => compute(), []);',
    'useMemo',
    "import { useMemo } from 'react';\nconst memoized = useMemo(() => compute(), []);"
  ),
  createNoReactNamespaceInvalidCase(
    'const callback = React.useCallback(() => {}, []);',
    'useCallback',
    "import { useCallback } from 'react';\nconst callback = useCallback(() => {}, []);"
  ),
  createNoReactNamespaceInvalidCase(
    'React.useLayoutEffect(() => {}, []);',
    'useLayoutEffect',
    "import { useLayoutEffect } from 'react';\nuseLayoutEffect(() => {}, []);"
  ),
  createNoReactNamespaceInvalidCase(
    'React.useImperativeHandle(ref, () => ({}));',
    'useImperativeHandle',
    "import { useImperativeHandle } from 'react';\nuseImperativeHandle(ref, () => ({}));"
  ),
  createNoReactNamespaceInvalidCase(
    'React.useDebugValue(value);',
    'useDebugValue',
    "import { useDebugValue } from 'react';\nuseDebugValue(value);"
  ),
];

// Test cases for React HOCs and utilities accessed via namespace
const utilityNamespaceCases = [
  createNoReactNamespaceInvalidCase(
    'const MemoComponent = React.memo(Component);',
    'memo',
    "import { memo } from 'react';\nconst MemoComponent = memo(Component);"
  ),
  createNoReactNamespaceInvalidCase(
    'const ForwardRefComponent = React.forwardRef((props, ref) => <div ref={ref} />);',
    'forwardRef',
    "import { forwardRef } from 'react';\nconst ForwardRefComponent = forwardRef((props, ref) => <div ref={ref} />);"
  ),
  createNoReactNamespaceInvalidCase(
    'const context = React.createContext(null);',
    'createContext',
    "import { createContext } from 'react';\nconst context = createContext(null);"
  ),
  createNoReactNamespaceInvalidCase(
    'const element = React.createElement("div", null, "Hello");',
    'createElement',
    'import { createElement } from \'react\';\nconst element = createElement("div", null, "Hello");'
  ),
  createNoReactNamespaceInvalidCase(
    'const cloned = React.cloneElement(element, { prop: "value" });',
    'cloneElement',
    'import { cloneElement } from \'react\';\nconst cloned = cloneElement(element, { prop: "value" });'
  ),
  createNoReactNamespaceInvalidCase(
    'const isValid = React.isValidElement(element);',
    'isValidElement',
    "import { isValidElement } from 'react';\nconst isValid = isValidElement(element);"
  ),
  createNoReactNamespaceInvalidCase(
    'const children = React.Children.map(props.children, child => child);',
    'Children',
    "import { Children } from 'react';\nconst children = Children.map(props.children, child => child);"
  ),
  createNoReactNamespaceInvalidCase(
    'const fragment = React.Fragment;',
    'Fragment',
    "import { Fragment } from 'react';\nconst fragment = Fragment;"
  ),
  createNoReactNamespaceInvalidCase(
    'const Suspense = React.Suspense;',
    'Suspense',
    "import { Suspense } from 'react';\nconst Suspense = Suspense;"
  ),
  createNoReactNamespaceInvalidCase(
    'const lazy = React.lazy(() => import("./Component"));',
    'lazy',
    'import { lazy } from \'react\';\nconst lazy = lazy(() => import("./Component"));'
  ),
];

// ============================================
// INVALID CASES - React.* type references
// ============================================

// Test cases for React event types accessed via namespace
const eventTypeNamespaceCases = [
  createNoReactNamespaceInvalidCase(
    'const handleSubmit = (event: React.FormEvent) => {};',
    'FormEvent',
    "import type { FormEvent } from 'react';\nconst handleSubmit = (event: FormEvent) => {};",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {};',
    'ChangeEvent',
    "import type { ChangeEvent } from 'react';\nconst handleChange = (event: ChangeEvent<HTMLInputElement>) => {};",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const handleClick = (event: React.MouseEvent) => {};',
    'MouseEvent',
    "import type { MouseEvent } from 'react';\nconst handleClick = (event: MouseEvent) => {};",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const handleKeyDown = (event: React.KeyboardEvent) => {};',
    'KeyboardEvent',
    "import type { KeyboardEvent } from 'react';\nconst handleKeyDown = (event: KeyboardEvent) => {};",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const handleFocus = (event: React.FocusEvent) => {};',
    'FocusEvent',
    "import type { FocusEvent } from 'react';\nconst handleFocus = (event: FocusEvent) => {};",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const handleDrag = (event: React.DragEvent) => {};',
    'DragEvent',
    "import type { DragEvent } from 'react';\nconst handleDrag = (event: DragEvent) => {};",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const handleTouch = (event: React.TouchEvent) => {};',
    'TouchEvent',
    "import type { TouchEvent } from 'react';\nconst handleTouch = (event: TouchEvent) => {};",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const handlePointer = (event: React.PointerEvent) => {};',
    'PointerEvent',
    "import type { PointerEvent } from 'react';\nconst handlePointer = (event: PointerEvent) => {};",
    'noReactNamespaceType'
  ),
];

// Test cases for React component types accessed via namespace
const componentTypeNamespaceCases = [
  createNoReactNamespaceInvalidCase(
    'const Component: React.FC = () => <div />;',
    'FC',
    "import type { FC } from 'react';\nconst Component: FC = () => <div />;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const Component: React.FunctionComponent = () => <div />;',
    'FunctionComponent',
    "import type { FunctionComponent } from 'react';\nconst Component: FunctionComponent = () => <div />;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'function Component(): React.ReactNode { return <div />; }',
    'ReactNode',
    "import type { ReactNode } from 'react';\nfunction Component(): ReactNode { return <div />; }",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'function Component(): React.ReactElement { return <div />; }',
    'ReactElement',
    "import type { ReactElement } from 'react';\nfunction Component(): ReactElement { return <div />; }",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const children: React.ReactNode = props.children;',
    'ReactNode',
    "import type { ReactNode } from 'react';\nconst children: ReactNode = props.children;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type Props = { ref: React.Ref<HTMLDivElement> };',
    'Ref',
    "import type { Ref } from 'react';\ntype Props = { ref: Ref<HTMLDivElement> };",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type Props = { ref: React.RefObject<HTMLDivElement> };',
    'RefObject',
    "import type { RefObject } from 'react';\ntype Props = { ref: RefObject<HTMLDivElement> };",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type Props = { ref: React.MutableRefObject<HTMLDivElement> };',
    'MutableRefObject',
    "import type { MutableRefObject } from 'react';\ntype Props = { ref: MutableRefObject<HTMLDivElement> };",
    'noReactNamespaceType'
  ),
];

// Test cases for React utility types accessed via namespace
const utilityTypeNamespaceCases = [
  createNoReactNamespaceInvalidCase(
    'type ButtonProps = React.ComponentProps<typeof Button>;',
    'ComponentProps',
    "import type { ComponentProps } from 'react';\ntype ButtonProps = ComponentProps<typeof Button>;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type DivProps = React.HTMLAttributes<HTMLDivElement>;',
    'HTMLAttributes',
    "import type { HTMLAttributes } from 'react';\ntype DivProps = HTMLAttributes<HTMLDivElement>;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type InputProps = React.InputHTMLAttributes<HTMLInputElement>;',
    'InputHTMLAttributes',
    "import type { InputHTMLAttributes } from 'react';\ntype InputProps = InputHTMLAttributes<HTMLInputElement>;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;',
    'ButtonHTMLAttributes',
    "import type { ButtonHTMLAttributes } from 'react';\ntype ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type FormProps = React.FormHTMLAttributes<HTMLFormElement>;',
    'FormHTMLAttributes',
    "import type { FormHTMLAttributes } from 'react';\ntype FormProps = FormHTMLAttributes<HTMLFormElement>;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type Props = React.PropsWithChildren<BaseProps>;',
    'PropsWithChildren',
    "import type { PropsWithChildren } from 'react';\ntype Props = PropsWithChildren<BaseProps>;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type Props = React.PropsWithoutRef<BaseProps>;',
    'PropsWithoutRef',
    "import type { PropsWithoutRef } from 'react';\ntype Props = PropsWithoutRef<BaseProps>;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type State = React.SetStateAction<number>;',
    'SetStateAction',
    "import type { SetStateAction } from 'react';\ntype State = SetStateAction<number>;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'type DispatchType = React.Dispatch<Action>;',
    'Dispatch',
    "import type { Dispatch } from 'react';\ntype DispatchType = Dispatch<Action>;",
    'noReactNamespaceType'
  ),
  createNoReactNamespaceInvalidCase(
    'const MyContext: React.Context<Value> = createContext(null);',
    'Context',
    "import type { Context } from 'react';\nconst MyContext: Context<Value> = createContext(null);",
    'noReactNamespaceType'
  ),
];

// Test cases for function declarations with React.* types
const functionDeclarationCases = [
  createNoReactNamespaceInvalidCase(
    'function handleSubmit(event: React.FormEvent): void {}',
    'FormEvent',
    "import type { FormEvent } from 'react';\nfunction handleSubmit(event: FormEvent): void {}",
    'noReactNamespaceType'
  ),
];

// Test cases with multiple React.* usages (multiple fix passes required)
const multipleUsageCases = [
  {
    code: 'const [count, setCount] = React.useState(0); React.useEffect(() => {}, []);',
    errors: [
      { data: { member: 'useState' }, messageId: 'noReactNamespace' as const },
      { data: { member: 'useEffect' }, messageId: 'noReactNamespace' as const },
    ],
    // Array format for multiple fix passes
    output: [
      "import { useState } from 'react';\nconst [count, setCount] = useState(0); React.useEffect(() => {}, []);",
      "import { useState, useEffect } from 'react';\nconst [count, setCount] = useState(0); useEffect(() => {}, []);",
    ],
  },
  {
    code: `const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const [value, setValue] = React.useState(event.target.value);
    };`,
    errors: [
      { data: { member: 'ChangeEvent' }, messageId: 'noReactNamespaceType' as const },
      { data: { member: 'useState' }, messageId: 'noReactNamespace' as const },
    ],
    // Array format for multiple fix passes
    output: [
      `import type { ChangeEvent } from 'react';
const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const [value, setValue] = React.useState(event.target.value);
    };`,
      `import type { ChangeEvent, useState } from 'react';
const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const [value, setValue] = useState(event.target.value);
    };`,
    ],
  },
];

// ============================================
// VALID CASES - Proper direct imports
// ============================================

// Test cases for properly imported hooks
const validHookCases = [
  createValidCase("import { useState } from 'react'; const [count, setCount] = useState(0);"),
  createValidCase("import { useEffect } from 'react'; useEffect(() => {}, []);"),
  createValidCase("import { useRef } from 'react'; const ref = useRef(null);"),
  createValidCase("import { useContext } from 'react'; const value = useContext(MyContext);"),
  createValidCase("import { useMemo } from 'react'; const memoized = useMemo(() => compute(), []);"),
  createValidCase("import { useCallback } from 'react'; const callback = useCallback(() => {}, []);"),
];

// Test cases for properly imported types
const validTypeCases = [
  createValidCase("import type { FormEvent } from 'react'; const handleSubmit = (event: FormEvent) => {};"),
  createValidCase(
    "import type { ChangeEvent } from 'react'; const handleChange = (event: ChangeEvent<HTMLInputElement>) => {};"
  ),
  createValidCase("import type { MouseEvent } from 'react'; const handleClick = (event: MouseEvent) => {};"),
  createValidCase("import type { FC } from 'react'; const Component: FC = () => <div />;"),
  createValidCase("import type { ReactNode } from 'react'; function Component(): ReactNode { return <div />; }"),
  createValidCase("import type { ComponentProps } from 'react'; type ButtonProps = ComponentProps<typeof Button>;"),
];

// Test cases for properly imported utilities
const validUtilityCases = [
  createValidCase("import { memo } from 'react'; const MemoComponent = memo(Component);"),
  createValidCase(
    "import { forwardRef } from 'react'; const ForwardRefComponent = forwardRef((props, ref) => <div ref={ref} />);"
  ),
  createValidCase("import { createContext } from 'react'; const context = createContext(null);"),
  createValidCase("import { Fragment } from 'react'; const fragment = <Fragment>content</Fragment>;"),
  createValidCase("import { lazy, Suspense } from 'react'; const LazyComponent = lazy(() => import('./Component'));"),
];

// Test cases for non-React member expressions (should not flag)
const nonReactMemberExpressionCases = [
  createValidCase('const value = SomeOther.useState(0);'),
  createValidCase('const result = Library.useEffect(() => {});'),
  createValidCase('const event: CustomLib.FormEvent = {};'),
  createValidCase('const type: MyTypes.FC = Component;'),
  createValidCase('const value = window.React;'),
  createValidCase('const data = api.fetch();'),
];

// Test cases for React default import usage that doesn't use namespace (edge case)
const defaultImportCases = [
  createValidCase("import React from 'react'; const element = <div />;"),
  createValidCase("import React from 'react'; const children = props.children;"),
];

const TEST_CASES = {
  invalid: [
    ...hookNamespaceCases,
    ...utilityNamespaceCases,
    ...eventTypeNamespaceCases,
    ...componentTypeNamespaceCases,
    ...utilityTypeNamespaceCases,
    ...functionDeclarationCases,
    ...multipleUsageCases,
  ],
  valid: [
    ...validHookCases,
    ...validTypeCases,
    ...validUtilityCases,
    ...nonReactMemberExpressionCases,
    ...defaultImportCases,
  ],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('no-react-namespace', noReactNamespace, TEST_CASES);
