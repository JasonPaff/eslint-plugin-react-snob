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

ruleTester.run('component-prop-interface-naming', componentPropInterfaceNaming, {
  invalid: [
    // Function component with incorrectly named props interface
    {
      code: `
       function Card({ className, ...props }: React.ComponentProps<'div'>) {
           return (<div>...</div>);
       }
      `,
      errors: [
        {
          data: {
            actual: "React.ComponentProps<'div'>",
            component: 'Card',
            expected: 'CardProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Arrow component with incorrectly named props interface
    {
      code: `
       const Card = ({ className, ...props }: React.ComponentProps<'div'>) => {
           return (<div>...</div>);
       }
      `,
      errors: [
        {
          data: {
            actual: "React.ComponentProps<'div'>",
            component: 'Card',
            expected: 'CardProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Arrow Function component with incorrectly named props interface
    {
      code: `
       const Card = function ({ className, ...props }: React.ComponentProps<'div'>) {
           return (<div>...</div>);
       }
      `,
      errors: [
        {
          data: {
            actual: "React.ComponentProps<'div'>",
            component: 'Card',
            expected: 'CardProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Function component with incorrectly named props interface
    {
      code: `
        interface ButtonOptions {
          onClick: () => void;
        }
        function Button({ onClick }: ButtonOptions) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'ButtonOptions',
            component: 'Button',
            expected: 'ButtonProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Arrow function component with props declaration as a generic on the function type
    {
      code: `
    import { FunctionComponent } from 'react';

    interface DogPenOptions {
      name: string;
    }

    export const DogPenFunctionComponent: FunctionComponent<DogPenOptions> = ({ name }) => {
      console.log(name);
      return <></>;
    };
  `,
      errors: [
        {
          data: {
            actual: 'DogPenOptions',
            component: 'DogPenFunctionComponent',
            expected: 'DogPenFunctionComponentProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Arrow function component with incorrectly named props interface
    {
      code: `
        interface CardData {
          title: string;
          content: string;
        }
        const Card = ({ title, content }: CardData) => {
          return <div><h3>{title}</h3><p>{content}</p></div>;
        };
      `,
      errors: [
        {
          data: {
            actual: 'CardData',
            component: 'Card',
            expected: 'CardProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // forwardRef with incorrectly named props interface (generic type)
    {
      code: `
        interface InputConfig {
          placeholder: string;
        }
        const Input = forwardRef<HTMLInputElement, InputConfig>(({ placeholder }, ref) => {
          return <input ref={ref} placeholder={placeholder} />;
        });
      `,
      errors: [
        {
          data: {
            actual: 'InputConfig',
            component: 'Input',
            expected: 'InputProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // memo wrapped component with incorrect naming
    {
      code: `
        interface MemoSettings {
          value: string;
        }
        const MemoComponent = memo(({ value }: MemoSettings) => {
          return <div>{value}</div>;
        });
      `,
      errors: [
        {
          data: {
            actual: 'MemoSettings',
            component: 'MemoComponent',
            expected: 'MemoComponentProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Complex component name with incorrect interface naming
    {
      code: `
        interface FileDrawerSettings {
          isOpen: boolean;
          onClose: () => void;
        }
        function FileDrawer({ isOpen, onClose }: FileDrawerSettings) {
          return isOpen ? <div onClick={onClose}>Drawer</div> : null;
        }
      `,
      errors: [
        {
          data: {
            actual: 'FileDrawerSettings',
            component: 'FileDrawer',
            expected: 'FileDrawerProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Component with Props suffix but wrong base name
    {
      code: `
        interface ComponentProps {
          value: string;
        }
        function MyButton({ value }: ComponentProps) {
          return <button>{value}</button>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'ComponentProps',
            component: 'MyButton',
            expected: 'MyButtonProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Arrow function with function expression syntax
    {
      code: `
        interface HeaderData {
          title: string;
        }
        const Header = function({ title }: HeaderData) {
          return <h1>{title}</h1>;
        };
      `,
      errors: [
        {
          data: {
            actual: 'HeaderData',
            component: 'Header',
            expected: 'HeaderProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Arrow function component with generic type declaration as function type generic
    {
      code: `
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
      errors: [
        {
          data: {
            actual: 'ArrowFunctionComponentPassedAsFirstGenericOptions',
            component: 'ArrowFunctionComponentPassedAsFirstGeneric',
            expected: 'ArrowFunctionComponentPassedAsFirstGenericProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Arrow function component with generic type declaration as parameter type
    {
      code: `
        type ArrowFunctionComponentPassedAsFirstGenericOptions<T> = T & {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsFirstGeneric = ({ children, name }: ArrowFunctionComponentPassedAsFirstGenericOptions<Children>) => {
          console.log(name);
          return <></>;
        };
      `,
      errors: [
        {
          data: {
            actual: 'ArrowFunctionComponentPassedAsFirstGenericOptions',
            component: 'ArrowFunctionComponentPassedAsFirstGeneric',
            expected: 'ArrowFunctionComponentPassedAsFirstGenericProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Arrow function component with props type passed as last generic parameter
    {
      code: `
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
      errors: [
        {
          data: {
            actual: 'ArrowFunctionComponentPassedAsLastGenericOptions',
            component: 'ArrowFunctionComponentPassedAsLastGeneric',
            expected: 'ArrowFunctionComponentPassedAsLastGenericProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Type alias instead of interface with incorrect naming
    {
      code: `
        type ButtonOptions = {
          onClick: () => void;
        }
        function Button({ onClick }: ButtonOptions) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'ButtonOptions',
            component: 'Button',
            expected: 'ButtonProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Component ending in "Component" with wrong base name
    {
      code: `
        interface UserOptions {
          id: number;
        }
        function UserComponent({ id }: UserOptions) {
          return <div>User {id}</div>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'UserOptions',
            component: 'UserComponent',
            expected: 'UserComponentProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Exported function component with incorrect naming
    {
      code: `
        interface ButtonConfig {
          label: string;
        }
        export function Button({ label }: ButtonConfig) {
          return <button>{label}</button>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'ButtonConfig',
            component: 'Button',
            expected: 'ButtonProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Default exported component with incorrect naming
    {
      code: `
        interface HeaderData {
          title: string;
        }
        export default function Header({ title }: HeaderData) {
          return <h1>{title}</h1>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'HeaderData',
            component: 'Header',
            expected: 'HeaderProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // forwardRef with multiple type parameters and incorrect naming
    {
      code: `
        interface CustomInputSettings {
          value: string;
        }
        const CustomInput = forwardRef<HTMLInputElement, CustomInputSettings>(
          ({ value }, ref) => <input ref={ref} value={value} />
        );
      `,
      errors: [
        {
          data: {
            actual: 'CustomInputSettings',
            component: 'CustomInput',
            expected: 'CustomInputProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Type alias with generic parameters and incorrect naming
    {
      code: `
        type ButtonConfig<T> = {
          onClick: () => void;
          data: T;
        }
        function Button<T>({ onClick, data }: ButtonConfig<T>) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'ButtonConfig',
            component: 'Button',
            expected: 'ButtonProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Component with Props suffix but completely unrelated name
    {
      code: `
        interface RandomProps {
          value: string;
        }
        function SpecificButton({ value }: RandomProps) {
          return <button>{value}</button>;
        }
      `,
      errors: [
        {
          data: {
            actual: 'RandomProps',
            component: 'SpecificButton',
            expected: 'SpecificButtonProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },

    // Nested forwardRef with memo and incorrect naming
    {
      code: `
        interface InputSettings {
          placeholder: string;
        }
        const Input = memo(forwardRef<HTMLInputElement, InputSettings>(
          ({ placeholder }, ref) => <input ref={ref} placeholder={placeholder} />
        ));
      `,
      errors: [
        {
          data: {
            actual: 'InputSettings',
            component: 'Input',
            expected: 'InputProps',
          },
          messageId: 'incorrectPropsInterfaceName',
        },
      ],
    },
  ],

  valid: [
    // Function component with correctly named props interface
    {
      code: `
        interface ButtonProps {
          onClick: () => void;
        }
        function Button({ onClick }: ButtonProps) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
    },

    // Arrow function component with props declaration as a generic on the function type
    {
      code: `
    import { FunctionComponent } from 'react';

    interface DogPenProps {
      name: string;
    }

    export const DogPenFunctionComponent: FunctionComponent<DogPenProps> = ({ name }) => {
      console.log(name);
      return <></>;
    };
  `,
    },

    // Arrow function component with correctly named props interface
    {
      code: `
        interface CardProps {
          title: string;
          content: string;
        }
        const Card = ({ title, content }: CardProps) => {
          return <div><h3>{title}</h3><p>{content}</p></div>;
        };
      `,
    },

    // forwardRef with correctly named props interface
    {
      code: `
        interface InputProps {
          placeholder: string;
        }
        const Input = forwardRef<HTMLInputElement, InputProps>(({ placeholder }, ref) => {
          return <input ref={ref} placeholder={placeholder} />;
        });
      `,
    },

    // Component with no props (should be ignored)
    {
      code: `
        function SimpleComponent() {
          return <div>No props</div>;
        }
      `,
    },

    // Arrow function component with no props (should be ignored)
    {
      code: `
        const SimpleArrowComponent = () => {
          return <div>No props</div>;
        };
      `,
    },

    // Non-component function (should be ignored)
    {
      code: `
        interface UtilOptions {
          debug: boolean;
        }
        function utilFunction({ debug }: UtilOptions) {
          return debug;
        }
      `,
    },

    // Component with destructured props but no type annotation (should be ignored)
    {
      code: `
        function ComponentWithoutTypes({ title }) {
          return <div>{title}</div>;
        }
      `,
    },

    // Component with inline type annotation (should be ignored as it's not an interface)
    {
      code: `
        function Button({ onClick }: { onClick: () => void }) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
    },

    // memo wrapped component with correct naming
    {
      code: `
        interface MemoComponentProps {
          value: string;
        }
        const MemoComponent = memo(({ value }: MemoComponentProps) => {
          return <div>{value}</div>;
        });
      `,
    },

    // Arrow function component with generic type declaration as function type generic (correct naming)
    {
      code: `
        type ArrowFunctionComponentPassedAsFirstGenericProps<T> = T & {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsFirstGeneric: FunctionComponent<
         ArrowFunctionComponentPassedAsFirstGenericProps<Children>
        > = ({ children, name }) => {
          console.log(name);
          return <></>;
        };
      `,
    },

    // Arrow function component with generic type declaration as parameter type (correct naming)
    {
      code: `
        type ArrowFunctionComponentPassedAsFirstGenericProps<T> = T & {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsFirstGeneric = ({ children, name }: ArrowFunctionComponentPassedAsFirstGenericProps<Children>) => {
          console.log(name);
          return <></>;
        };
      `,
    },

    // Arrow function component with props type passed as last generic parameter (correct naming)
    {
      code: `
        type ArrowFunctionComponentPassedAsLastGenericProps = {
          name: string;
        };

        export const ArrowFunctionComponentPassedAsLastGeneric: FunctionComponent<
         Children<ArrowFunctionComponentPassedAsLastGenericProps>
        > = ({ children, name }) => {
          console.log(name);
          return <></>;
        };
      `,
    },

    // Type alias with correct naming
    {
      code: `
        type ButtonProps = {
          onClick: () => void;
        }
        function Button({ onClick }: ButtonProps) {
          return <button onClick={onClick}>Click me</button>;
        }
      `,
    },

    // Component ending in "Component" with correct base name
    {
      code: `
        interface UserProps {
          id: number;
        }
        function UserComponent({ id }: UserProps) {
          return <div>User {id}</div>;
        }
      `,
    },

    // Exported component with correct naming
    {
      code: `
        interface ButtonProps {
          label: string;
        }
        export function Button({ label }: ButtonProps) {
          return <button>{label}</button>;
        }
      `,
    },

    // Default exported component with correct naming
    {
      code: `
        interface HeaderProps {
          title: string;
        }
        export default function Header({ title }: HeaderProps) {
          return <h1>{title}</h1>;
        }
      `,
    },

    // Component with union types in props
    {
      code: `
        interface ButtonProps {
          variant: 'primary' | 'secondary';
        }
        function Button({ variant }: ButtonProps) {
          return <button className={variant}>Click me</button>;
        }
      `,
    },

    // Component with generic props interface
    {
      code: `
        interface ListProps<T> {
          items: T[];
        }
        function List<T>({ items }: ListProps<T>) {
          return <ul>{items.map(item => <li key={String(item)}>{String(item)}</li>)}</ul>;
        }
      `,
    },

    // Component with intersection types
    {
      code: `
        interface BaseProps {
          id: string;
        }
        interface ButtonProps extends BaseProps {
          onClick: () => void;
        }
        function Button({ id, onClick }: ButtonProps) {
          return <button id={id} onClick={onClick}>Click me</button>;
        }
      `,
    },

    // Component with complex nested props
    {
      code: `
        interface ModalProps {
          isOpen: boolean;
          onClose: () => void;
          children: React.ReactNode;
        }
        function Modal({ isOpen, onClose, children }: ModalProps) {
          return isOpen ? <div onClick={onClose}>{children}</div> : null;
        }
      `,
    },

    // Arrow function with correct type alias naming
    {
      code: `
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
      `,
    },

    // Component with Props suffix that matches exactly (edge case)
    {
      code: `
        interface PropsProps {
          value: string;
        }
        function Props({ value }: PropsProps) {
          return <div>{value}</div>;
        }
      `,
    },

    // Generic type alias with correct naming
    {
      code: `
        type ListProps<T> = {
          items: T[];
          onSelect: (item: T) => void;
        }
        function List<T>({ items, onSelect }: ListProps<T>) {
          return <ul>{items.map(item => <li onClick={() => onSelect(item)}>{String(item)}</li>)}</ul>;
        }
      `,
    },

    // Complex component name with numbers
    {
      code: `
        interface Button2Props {
          label: string;
        }
        function Button2({ label }: Button2Props) {
          return <button>{label}</button>;
        }
      `,
    },

    // Nested forwardRef with memo and correct naming
    {
      code: `
        interface InputProps {
          placeholder: string;
        }
        const Input = memo(forwardRef<HTMLInputElement, InputProps>(
          ({ placeholder }, ref) => <input ref={ref} placeholder={placeholder} />
        ));
      `,
    },
  ],
});
