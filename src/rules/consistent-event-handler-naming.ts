import { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils';

export const consistentEventHandlerNaming = createRule({
  create(context) {
    // Track functions that are used as event handlers in JSX
    const usedAsEventHandlers = new Set<string>();

    // Store all function/variable nodes for later checking
    const allFunctions = new Map<string, TSESTree.Node>();

    // Common event handler patterns
    const eventHandlerAttributes = new Set([
      'onClick',
      'onDoubleClick',
      'onMouseDown',
      'onMouseUp',
      'onMouseOver',
      'onMouseOut',
      'onMouseEnter',
      'onMouseLeave',
      'onMouseMove',
      'onContextMenu',
      'onSubmit',
      'onReset',
      'onInput',
      'onChange',
      'onFocus',
      'onBlur',
      'onSelect',
      'onKeyDown',
      'onKeyUp',
      'onKeyPress',
      'onLoad',
      'onError',
      'onAbort',
      'onCanPlay',
      'onCanPlayThrough',
      'onDurationChange',
      'onEmptied',
      'onEnded',
      'onLoadedData',
      'onLoadedMetadata',
      'onLoadStart',
      'onPause',
      'onPlay',
      'onPlaying',
      'onProgress',
      'onRateChange',
      'onSeeked',
      'onSeeking',
      'onStalled',
      'onSuspend',
      'onTimeUpdate',
      'onVolumeChange',
      'onWaiting',
      'onDrag',
      'onDragEnd',
      'onDragEnter',
      'onDragExit',
      'onDragLeave',
      'onDragOver',
      'onDragStart',
      'onDrop',
      'onScroll',
      'onWheel',
      'onTouchStart',
      'onTouchMove',
      'onTouchEnd',
      'onTouchCancel',
      'onPointerDown',
      'onPointerMove',
      'onPointerUp',
      'onPointerCancel',
      'onPointerEnter',
      'onPointerLeave',
      'onPointerOver',
      'onPointerOut',
      'onAnimationStart',
      'onAnimationEnd',
      'onAnimationIteration',
      'onTransitionEnd',
    ]);

    function extractEventFromHandlerName(handlerName: string): string {
      // Remove common prefixes/suffixes
      let eventName = handlerName
        .replace(/^(handle|on)/, '') // Remove handle or on prefix
        .replace(/(Handler|Callback|Fn|Function)$/, ''); // Remove non-semantic suffixes

      // Handle special cases for past-tense event names
      eventName = eventName.replace(/Changed$/, 'Change');
      eventName = eventName.replace(/Clicked$/, 'Click');
      eventName = eventName.replace(/Pressed$/, 'Press');

      // Convert first letter to lowercase for the event name
      return eventName.charAt(0).toLowerCase() + eventName.slice(1);
    }

    function generateHandleEventName(eventName: string): string {
      // Convert first letter to uppercase after "handle"
      return 'handle' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
    }

    function generateOnEventName(eventName: string): string {
      // Convert first letter to uppercase after "on"
      return 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
    }

    function isEventHandlerName(name: string): boolean {
      // Check if name looks like an event handler
      return (
        /^(on|handle)[A-Z]/.test(name) ||
        /^[a-z]+Handler$/.test(name) ||
        /^[a-z]+Callback$/.test(name) ||
        /^[a-z]+Fn$/.test(name)
      );
    }

    function isEventHandlerParameter(param: TSESTree.Parameter): boolean {
      if (param.type !== 'Identifier') return false;

      // Check if parameter name suggests it's an event
      return /^(e|event|evt)$/.test(param.name);
    }

    function hasEventHandlerParameters(
      node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression
    ): boolean {
      return node.params.length > 0 && isEventHandlerParameter(node.params[0]);
    }

    function checkInternalEventHandler(node: TSESTree.Node, name: string): void {
      // Skip if name already has correct "handle" prefix
      if (name.startsWith('handle') && /^handle[A-Z]/.test(name)) {
        return;
      }

      // Check if this looks like an event handler name that should use "handle" prefix
      if (isEventHandlerName(name) || usedAsEventHandlers.has(name)) {
        const eventName = extractEventFromHandlerName(name);
        const expectedName = generateHandleEventName(eventName);

        context.report({
          data: {
            actual: name,
            context: 'internal',
            expected: expectedName,
          },
          messageId: 'incorrectHandlerNaming',
          node,
        });
      }
    }

    function checkEventHandlerProp(node: TSESTree.Node, name: string): void {
      // Skip if name already has correct "on" prefix
      if (name.startsWith('on') && /^on[A-Z]/.test(name)) {
        return;
      }

      // Check if this looks like an event handler prop that should use "on" prefix
      // This includes both explicit patterns and names that end with common event patterns
      const isHandlerProp =
        isEventHandlerName(name) ||
        /Changed$/.test(name) ||
        /Clicked$/.test(name) ||
        /Pressed$/.test(name) ||
        /Entered$/.test(name) ||
        /Left$/.test(name);

      if (isHandlerProp) {
        const eventName = extractEventFromHandlerName(name);
        const expectedName = generateOnEventName(eventName);

        context.report({
          data: {
            actual: name,
            context: 'prop',
            expected: expectedName,
          },
          messageId: 'incorrectHandlerNaming',
          node,
        });
      }
    }

    function isFunctionType(node: TSESTree.TypeNode): boolean {
      return (
        node.type === 'TSFunctionType' ||
        (node.type === 'TSTypeReference' &&
          node.typeName.type === 'Identifier' &&
          /^(Function|Callback|Handler)/.test(node.typeName.name))
      );
    }

    function looksLikeFunctionType(propertyName: string, node: TSESTree.TypeNode | undefined): boolean {
      if (!node) return false;

      // Check if it's a function type
      if (isFunctionType(node)) return true;

      // Check if property name suggests it's a function/handler
      return (
        /^(on|handle)[A-Z]/.test(propertyName) ||
        /Handler$/.test(propertyName) ||
        /Callback$/.test(propertyName) ||
        /Changed$/.test(propertyName)
      );
    }

    return {
      // Store function declarations for later checking
      FunctionDeclaration(node) {
        if (node.id?.name) {
          allFunctions.set(node.id.name, node);
        }
      },

      // Track JSX attributes to identify functions used as event handlers
      JSXAttribute(node) {
        if (
          node.name.type === 'JSXIdentifier' &&
          eventHandlerAttributes.has(node.name.name) &&
          node.value?.type === 'JSXExpressionContainer' &&
          node.value.expression.type === 'Identifier'
        ) {
          usedAsEventHandlers.add(node.value.expression.name);
        }
      },

      // After processing JSX, check all stored functions
      'Program:exit'() {
        // Check all stored functions
        allFunctions.forEach((node) => {
          if (node.type === 'FunctionDeclaration' && node.id?.name) {
            // Check if this looks like an event handler
            if (
              isEventHandlerName(node.id.name) ||
              hasEventHandlerParameters(node) ||
              usedAsEventHandlers.has(node.id.name)
            ) {
              checkInternalEventHandler(node.id, node.id.name);
            }
          } else if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && node.init) {
            const name = node.id.name;
            let shouldCheck = false;

            // Check arrow functions
            if (node.init.type === 'ArrowFunctionExpression') {
              shouldCheck =
                isEventHandlerName(name) || hasEventHandlerParameters(node.init) || usedAsEventHandlers.has(name);
            }
            // Check useCallback calls
            else if (
              node.init.type === 'CallExpression' &&
              node.init.callee.type === 'Identifier' &&
              node.init.callee.name === 'useCallback'
            ) {
              const callbackArg = node.init.arguments[0];
              if (
                callbackArg &&
                (callbackArg.type === 'ArrowFunctionExpression' || callbackArg.type === 'FunctionExpression')
              ) {
                shouldCheck =
                  isEventHandlerName(name) || hasEventHandlerParameters(callbackArg) || usedAsEventHandlers.has(name);
              }
            }
            // Check function expressions
            else if (node.init.type === 'FunctionExpression') {
              shouldCheck =
                isEventHandlerName(name) || hasEventHandlerParameters(node.init) || usedAsEventHandlers.has(name);
            }

            if (shouldCheck) {
              checkInternalEventHandler(node.id, name);
            }
          }
        });
      },

      // Check type alias properties (method signatures)
      TSMethodSignature(node) {
        if (node.key.type === 'Identifier') {
          const methodName = node.key.name;
          checkEventHandlerProp(node.key, methodName);
        }
      },

      // Check interface and type properties for event handler props
      TSPropertySignature(node) {
        if (node.key.type === 'Identifier') {
          const propertyName = node.key.name;

          // Check if this property looks like an event handler prop
          if (looksLikeFunctionType(propertyName, node.typeAnnotation?.typeAnnotation)) {
            checkEventHandlerProp(node.key, propertyName);
          }
        }
      },

      // Store variable declarations for later checking
      VariableDeclarator(node) {
        if (node.id.type === 'Identifier' && node.init) {
          const name = node.id.name;

          // Only store functions
          if (
            node.init.type === 'ArrowFunctionExpression' ||
            node.init.type === 'FunctionExpression' ||
            (node.init.type === 'CallExpression' &&
              node.init.callee.type === 'Identifier' &&
              node.init.callee.name === 'useCallback')
          ) {
            allFunctions.set(name, node);
          }
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Enforce consistent naming patterns for event handlers based on their context',
    },
    fixable: undefined,
    messages: {
      incorrectHandlerNaming:
        'Event handler "{{actual}}" should be named "{{expected}}" ({{context}} handlers require proper prefix)',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'consistent-event-handler-naming',
});
