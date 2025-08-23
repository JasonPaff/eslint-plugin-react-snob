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
        type ArrowFunctionComponentPassedAsLastGenericOptions {
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
        type ArrowFunctionComponentPassedAsLastGenericProps {
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
  ],
});
