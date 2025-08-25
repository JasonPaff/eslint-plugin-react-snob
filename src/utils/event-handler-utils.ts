import { TSESTree } from '@typescript-eslint/utils';

// Common event handler patterns
export const eventHandlerAttributes = new Set([
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

/**
 * Extracts the event name from a handler name by removing common prefixes/suffixes
 */
export function extractEventFromHandlerName(handlerName: string): string {
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

/**
 * Generates a properly formatted "handle" prefixed event handler name
 */
export function generateHandleEventName(eventName: string): string {
  // Convert first letter to uppercase after "handle"
  return 'handle' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
}

/**
 * Generates a properly formatted "on" prefixed event handler prop name
 */
export function generateOnEventName(eventName: string): string {
  // Convert first letter to uppercase after "on"
  return 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
}

/**
 * Checks if a name looks like an event handler based on common patterns
 */
export function isEventHandlerName(name: string): boolean {
  // Check if name looks like an event handler
  return (
    /^(on|handle)[A-Z]/.test(name) ||
    /^[a-z]+Handler$/.test(name) ||
    /^[a-z]+Callback$/.test(name) ||
    /^[a-z]+Fn$/.test(name)
  );
}

/**
 * Checks if a parameter looks like an event parameter (e, event, evt)
 */
export function isEventHandlerParameter(param: TSESTree.Parameter): boolean {
  if (param.type !== 'Identifier') return false;

  // Check if parameter name suggests it's an event
  return /^(e|event|evt)$/.test(param.name);
}

/**
 * Checks if a function has event handler-style parameters
 */
export function hasEventHandlerParameters(
  node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression
): boolean {
  return node.params.length > 0 && isEventHandlerParameter(node.params[0]);
}

/**
 * Checks if a TypeScript type node represents a function type
 */
export function isFunctionType(node: TSESTree.TypeNode): boolean {
  return (
    node.type === 'TSFunctionType' ||
    (node.type === 'TSTypeReference' &&
      node.typeName.type === 'Identifier' &&
      /^(Function|Callback|Handler)/.test(node.typeName.name))
  );
}

/**
 * Checks if a property looks like a function type based on name or type annotation
 */
export function looksLikeFunctionType(propertyName: string, node: TSESTree.TypeNode | undefined): boolean {
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