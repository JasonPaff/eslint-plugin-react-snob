// Rule creation utilities
export { createRule } from './rule-creator';

// Component detection and analysis
export { extractComponentName, isComponentFunction } from './component-utils';

// AST traversal and expression analysis
export { countLogicalOperators, hasTemplateLiteral, hasLogicalAssignment, isComplexOperand } from './ast-traversal';

// TypeScript-specific utilities
export { findInterfaceNamesInTypeReference, getQualifiedTypeName, getFullTypeSignature } from './typescript-utils';

// JSX and context detection utilities
export { containsJSX, isInZodOmitOrPickMethod, isInConstructorCall } from './jsx-utils';

// Naming convention utilities
export { 
  suggestUnderscorePrefix, 
  hasUnderscorePrefix, 
  suggestPrefixedName, 
  hasValidPrefix, 
  hasAnyValidPrefix 
} from './naming-utils';

// Boolean type and expression utilities
export { 
  isBooleanType, 
  isBooleanLiteral, 
  isBooleanExpression, 
  isLikelyBooleanExpression, 
  isDerivedBooleanExpression, 
  isUseStateWithBoolean 
} from './boolean-utils';

// Event handler utilities
export { 
  eventHandlerAttributes,
  extractEventFromHandlerName, 
  generateHandleEventName, 
  generateOnEventName, 
  isEventHandlerName, 
  isEventHandlerParameter, 
  hasEventHandlerParameters, 
  isFunctionType, 
  looksLikeFunctionType 
} from './event-handler-utils';
