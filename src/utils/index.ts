// Rule creation utilities
export { createRule } from './rule-creator';

// Component detection and analysis
export { extractComponentName, isComponentFunction } from './component-utils';

// AST traversal and expression analysis
export { countLogicalOperators, hasTemplateLiteral, hasLogicalAssignment, isComplexOperand } from './ast-traversal';

// TypeScript-specific utilities
export { findInterfaceNamesInTypeReference } from './typescript-utils';
