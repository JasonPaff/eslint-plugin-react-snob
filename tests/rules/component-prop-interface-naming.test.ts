import { RuleTester } from '@typescript-eslint/rule-tester';

import { componentPropInterfaceNaming } from '../../src/rules/component-prop-interface-naming';

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

// Test cases for basic function components with incorrectly named props interfaces
const basicFunctionComponentCases = [
  createComponentPropInterfaceNamingInvalidCase(
    `
       function Card({ className, ...props }: React.ComponentProps<'div'>) {
           return (<div>...</div>);
       }
      `,
    "React.ComponentProps<'div'>",
    'Card',
    'CardProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface ButtonOptions {
          onClick: () => void;
        }
        function Button({ onClick }: ButtonOptions) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
    'ButtonOptions',
    'Button',
    'ButtonProps'
  ),
];

// Test cases for arrow function components with incorrectly named props interfaces
const arrowFunctionComponentCases = [
  createComponentPropInterfaceNamingInvalidCase(
    `
       const Card = ({ className, ...props }: React.ComponentProps<'div'>) => {
           return (<div>...</div>);
       }
      `,
    "React.ComponentProps<'div'>",
    'Card',
    'CardProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
       const Card = function ({ className, ...props }: React.ComponentProps<'div'>) {
           return (<div>...</div>);
       }
      `,
    "React.ComponentProps<'div'>",
    'Card',
    'CardProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface CardData {
          title: string;
          content: string;
        }
        const Card = ({ title, content }: CardData) => {
          return <div><h3>{title}</h3><p>{content}</p></div>;
        };
      `,
    'CardData',
    'Card',
    'CardProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface HeaderData {
          title: string;
        }
        const Header = function({ title }: HeaderData) {
          return <h1>{title}</h1>;
        };
      `,
    'HeaderData',
    'Header',
    'HeaderProps'
  ),
];

// Test cases for components with generic type declarations
const genericTypeComponentCases = [
  createComponentPropInterfaceNamingInvalidCase(
    `
    import { FunctionComponent } from 'react';

    interface DogPenOptions {
      name: string;
    }

    export const DogPenFunctionComponent: FunctionComponent<DogPenOptions> = ({ name }) => {
      console.log(name);
      return <></>;
    };
  `,
    'DogPenOptions',
    'DogPenFunctionComponent',
    'DogPenFunctionComponentProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        type ArrowFunctionComponentPassedAsFirstGenericOptions<T> = T & {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsFirstGeneric: FunctionComponent<
         ArrowFunctionComponentPassedAsFirstGenericOptions<Children>
        > = ({ children, name }) => {
          console.log(name);
          return <></>;
        };
      `,
    'ArrowFunctionComponentPassedAsFirstGenericOptions',
    'ArrowFunctionComponentPassedAsFirstGeneric',
    'ArrowFunctionComponentPassedAsFirstGenericProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        type ArrowFunctionComponentPassedAsFirstGenericOptions<T> = T & {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsFirstGeneric = ({ children, name }: ArrowFunctionComponentPassedAsFirstGenericOptions<Children>) => {
          console.log(name);
          return <></>;
        };
      `,
    'ArrowFunctionComponentPassedAsFirstGenericOptions',
    'ArrowFunctionComponentPassedAsFirstGeneric',
    'ArrowFunctionComponentPassedAsFirstGenericProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        type ArrowFunctionComponentPassedAsLastGenericOptions = {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsLastGeneric: FunctionComponent<
         Children<ArrowFunctionComponentPassedAsLastGenericOptions>
        > = ({ children, name }) => {
          console.log(name);
          return <></>;
        };
      `,
    'ArrowFunctionComponentPassedAsLastGenericOptions',
    'ArrowFunctionComponentPassedAsLastGeneric',
    'ArrowFunctionComponentPassedAsLastGenericProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        type ButtonConfig<T> = {
          onClick: () => void;
          data: T;
        }
        function Button<T>({ onClick, data }: ButtonConfig<T>) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
    'ButtonConfig',
    'Button',
    'ButtonProps'
  ),
];

// Test cases for forwardRef and memo wrapped components
const wrappedComponentCases = [
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface InputConfig {
          placeholder: string;
        }
        const Input = forwardRef<HTMLInputElement, InputConfig>(({ placeholder }, ref) => {
          return <input ref={ref} placeholder={placeholder} />;
        });
      `,
    'InputConfig',
    'Input',
    'InputProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface MemoSettings {
          value: string;
        }
        const MemoComponent = memo(({ value }: MemoSettings) => {
          return <div>{value}</div>;
        });
      `,
    'MemoSettings',
    'MemoComponent',
    'MemoComponentProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface CustomInputSettings {
          value: string;
        }
        const CustomInput = forwardRef<HTMLInputElement, CustomInputSettings>(
          ({ value }, ref) => <input ref={ref} value={value} />
        );
      `,
    'CustomInputSettings',
    'CustomInput',
    'CustomInputProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface InputSettings {
          placeholder: string;
        }
        const Input = memo(forwardRef<HTMLInputElement, InputSettings>(
          ({ placeholder }, ref) => <input ref={ref} placeholder={placeholder} />
        ));
      `,
    'InputSettings',
    'Input',
    'InputProps'
  ),
];

// Test cases for type aliases instead of interfaces
const typeAliasCases = [
  createComponentPropInterfaceNamingInvalidCase(
    `
        type ButtonOptions = {
          onClick: () => void;
        }
        function Button({ onClick }: ButtonOptions) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
    'ButtonOptions',
    'Button',
    'ButtonProps'
  ),
];

// Test cases for components with Props suffix but wrong base name
const wrongPropsSuffixCases = [
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface ComponentProps {
          value: string;
        }
        function MyButton({ value }: ComponentProps) {
          return <button>{value}</button>;
        }
      `,
    'ComponentProps',
    'MyButton',
    'MyButtonProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface RandomProps {
          value: string;
        }
        function SpecificButton({ value }: RandomProps) {
          return <button>{value}</button>;
        }
      `,
    'RandomProps',
    'SpecificButton',
    'SpecificButtonProps'
  ),
];

// Test cases for exported components
const exportedComponentCases = [
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface FileDrawerSettings {
          isOpen: boolean;
          onClose: () => void;
        }
        function FileDrawer({ isOpen, onClose }: FileDrawerSettings) {
          return isOpen ? <div onClick={onClose}>Drawer</div> : null;
        }
      `,
    'FileDrawerSettings',
    'FileDrawer',
    'FileDrawerProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface UserOptions {
          id: number;
        }
        function UserComponent({ id }: UserOptions) {
          return <div>User {id}</div>;
        }
      `,
    'UserOptions',
    'UserComponent',
    'UserComponentProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface ButtonConfig {
          label: string;
        }
        export function Button({ label }: ButtonConfig) {
          return <button>{label}</button>;
        }
      `,
    'ButtonConfig',
    'Button',
    'ButtonProps'
  ),
  createComponentPropInterfaceNamingInvalidCase(
    `
        interface HeaderData {
          title: string;
        }
        export default function Header({ title }: HeaderData) {
          return <h1>{title}</h1>;
        }
      `,
    'HeaderData',
    'Header',
    'HeaderProps'
  ),
];

// Test cases for components with correctly named props interfaces
const correctlyNamedCases = [
  createValidCase(`
        interface ButtonProps {
          onClick: () => void;
        }
        function Button({ onClick }: ButtonProps) {
          return <button onClick={onClick}>Click me</button>;
        }
      `),
  createValidCase(`
    import { FunctionComponent } from 'react';

    interface DogPenProps {
      name: string;
    }

    export const DogPenFunctionComponent: FunctionComponent<DogPenProps> = ({ name }) => {
      console.log(name);
      return <></>;
    };
  `),
  createValidCase(`
        interface CardProps {
          title: string;
          content: string;
        }
        const Card = ({ title, content }: CardProps) => {
          return <div><h3>{title}</h3><p>{content}</p></div>;
        };
      `),
  createValidCase(`
        interface InputProps {
          placeholder: string;
        }
        const Input = forwardRef<HTMLInputElement, InputProps>(({ placeholder }, ref) => {
          return <input ref={ref} placeholder={placeholder} />;
        });
      `),
  createValidCase(`
        interface MemoComponentProps {
          value: string;
        }
        const MemoComponent = memo(({ value }: MemoComponentProps) => {
          return <div>{value}</div>;
        });
      `),
  createValidCase(`
        type ArrowFunctionComponentPassedAsFirstGenericProps<T> = T & {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsFirstGeneric: FunctionComponent<
         ArrowFunctionComponentPassedAsFirstGenericProps<Children>
        > = ({ children, name }) => {
          console.log(name);
          return <></>;
        };
      `),
  createValidCase(`
        type ArrowFunctionComponentPassedAsFirstGenericProps<T> = T & {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsFirstGeneric = ({ children, name }: ArrowFunctionComponentPassedAsFirstGenericProps<Children>) => {
          console.log(name);
          return <></>;
        };
      `),
  createValidCase(`
        type ArrowFunctionComponentPassedAsLastGenericProps = {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsLastGeneric: FunctionComponent<
         Children<ArrowFunctionComponentPassedAsLastGenericProps>
        > = ({ children, name }) => {
          console.log(name);
          return <></>;
        };
      `),
  createValidCase(`
        type ButtonProps = {
          onClick: () => void;
        }
        function Button({ onClick }: ButtonProps) {
          return <button onClick={onClick}>Click me</button>;
        }
      `),
  createValidCase(`
        interface UserProps {
          id: number;
        }
        function UserComponent({ id }: UserProps) {
          return <div>User {id}</div>;
        }
      `),
  createValidCase(`
        interface ButtonProps {
          label: string;
        }
        export function Button({ label }: ButtonProps) {
          return <button>{label}</button>;
        }
      `),
  createValidCase(`
        interface HeaderProps {
          title: string;
        }
        export default function Header({ title }: HeaderProps) {
          return <h1>{title}</h1>;
        }
      `),
];

// Test cases for components that should be ignored by the rule
const ignoredComponentCases = [
  createValidCase(`
        function SimpleComponent() {
          return <div>No props</div>;
        }
      `),
  createValidCase(`
        const SimpleArrowComponent = () => {
          return <div>No props</div>;
        };
      `),
  createValidCase(`
        interface UtilOptions {
          debug: boolean;
        }
        function utilFunction({ debug }: UtilOptions) {
          return debug;
        }
      `),
  createValidCase(`
        function ComponentWithoutTypes({ title }) {
          return <div>{title}</div>;
        }
      `),
  createValidCase(`
        function Button({ onClick }: { onClick: () => void }) {
          return <button onClick={onClick}>Click me</button>;
        }
      `),
];

// Test cases for complex component scenarios
const complexComponentCases = [
  createValidCase(`
        interface ButtonProps {
          variant: 'primary' | 'secondary';
        }
        function Button({ variant }: ButtonProps) {
          return <button className={variant}>Click me</button>;
        }
      `),
  createValidCase(`
        interface ListProps<T> {
          items: T[];
        }
        function List<T>({ items }: ListProps<T>) {
          return <ul>{items.map(item => <li key={String(item)}>{String(item)}</li>)}</ul>;
        }
      `),
  createValidCase(`
        interface BaseProps {
          id: string;
        }
        interface ButtonProps extends BaseProps {
          onClick: () => void;
        }
        function Button({ id, onClick }: ButtonProps) {
          return <button id={id} onClick={onClick}>Click me</button>;
        }
      `),
  createValidCase(`
        interface ModalProps {
          isOpen: boolean;
          onClose: () => void;
          children: React.ReactNode;
        }
        function Modal({ isOpen, onClose, children }: ModalProps) {
          return isOpen ? <div onClick={onClose}>{children}</div> : null;
        }
      `),
  createValidCase(`
        type CardProps = {
          title: string;
          description: string;
        }
        const Card = ({ title, description }: CardProps) => (
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        );
      `),
  createValidCase(`
        interface PropsProps {
          value: string;
        }
        function Props({ value }: PropsProps) {
          return <div>{value}</div>;
        }
      `),
  createValidCase(`
        type ListProps<T> = {
          items: T[];
          onSelect: (item: T) => void;
        }
        function List<T>({ items, onSelect }: ListProps<T>) {
          return <ul>{items.map(item => <li onClick={() => onSelect(item)}>{String(item)}</li>)}</ul>;
        }
      `),
  createValidCase(`
        interface Button2Props {
          label: string;
        }
        function Button2({ label }: Button2Props) {
          return <button>{label}</button>;
        }
      `),
  createValidCase(`
        interface InputProps {
          placeholder: string;
        }
        const Input = memo(forwardRef<HTMLInputElement, InputProps>(
          ({ placeholder }, ref) => <input ref={ref} placeholder={placeholder} />
        ));
      `),
];

const TEST_CASES = {
  invalid: [
    ...basicFunctionComponentCases,
    ...arrowFunctionComponentCases,
    ...genericTypeComponentCases,
    ...wrappedComponentCases,
    ...typeAliasCases,
    ...wrongPropsSuffixCases,
    ...exportedComponentCases,
  ],
  valid: [
    ...correctlyNamedCases,
    ...ignoredComponentCases,
    ...complexComponentCases,
  ],
};

const ruleTester = new RuleTester(PARSER_CONFIG);
ruleTester.run('component-prop-interface-naming', componentPropInterfaceNaming, TEST_CASES);
