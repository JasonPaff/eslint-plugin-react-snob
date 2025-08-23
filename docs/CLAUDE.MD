# ESLint Rule Documentation Guidelines

This document provides guidelines for creating consistent and comprehensive documentation for ESLint rules in the `eslint-plugin-react-snob` project.

## File Structure and Naming

### Documentation Location
- Rule documentation goes in `docs/rules/`
- File naming: Use kebab-case matching the rule name (e.g., `no-inline-styles.md`)
- One documentation file per rule

### Documentation Template

```markdown
# rule-name

Brief one-line description of what the rule does.

## Rule Details

This rule aims to [describe the rule's purpose and rationale]. Explain why this rule exists, what problems it solves, and how it improves code quality.

Examples of **incorrect** code for this rule:

```jsx
// ❌ Bad examples with clear explanations
<Component badPattern="example" />
<div style={{ color: 'red' }}>Content</div>
```

Examples of **correct** code for this rule:

```jsx
// ✅ Good examples showing the preferred approach  
<Component goodPattern={"example"} />
<div className="red-text">Content</div>

// ✅ Additional valid patterns when applicable
<Component noAttributes>Content</Component>
```

## Options

This rule has no options.
<!-- OR -->
This rule accepts the following options:
- `option1` (boolean, default: true): Description of what this option controls
- `option2` (string, default: "value"): Description of this option

### Configuration Examples

```json
// Default usage
"react-snob/rule-name": "error"

// With options
"react-snob/rule-name": ["error", {
  "option1": false,
  "option2": "custom-value"
}]
```
```

## Required Documentation Sections

### 1. Rule Title (H1)
- Use exact rule name (kebab-case)
- No additional formatting or quotes

### 2. Brief Description
- One clear sentence explaining what the rule does
- Avoid implementation details
- Focus on the user benefit

### 3. Rule Details Section
- **Purpose**: Explain why this rule exists
- **Rationale**: What problems does it solve?
- **Benefit**: How does it improve code quality?

### 4. Code Examples

#### Incorrect Examples
- Use `❌` emoji prefix for bad examples
- Show realistic scenarios, not contrived ones
- Include variety of violation cases
- Add brief comments explaining why each is wrong
- Ensure examples actually trigger the rule

#### Correct Examples  
- Use `✅` emoji prefix for good examples
- Show the preferred way to write the code
- Include multiple valid patterns when applicable
- Cover edge cases and variations
- Ensure examples would pass the rule

### 5. Options Section
- **No options**: State "This rule has no options."
- **With options**: Document each option with:
  - Parameter name and type
  - Default value
  - Clear description of behavior
  - Configuration examples in JSON format

## Content Guidelines

### Writing Style
- **Concise**: Keep descriptions brief but complete
- **Clear**: Avoid jargon and complex explanations  
- **Consistent**: Use the same terminology throughout
- **Actionable**: Focus on what developers should do

### Code Examples
- **Realistic**: Use examples that developers actually encounter
- **Complete**: Show enough context to understand the issue
- **Variety**: Cover different scenarios and edge cases
- **JSX Focus**: Emphasize React/JSX patterns since this is a React plugin
- **TypeScript**: Include TypeScript examples when relevant

### Formatting
- Use proper markdown code fencing with language hints
- Use consistent emoji: `❌` for incorrect, `✅` for correct
- Indent code examples properly
- Use inline code for short snippets: `className`

## Technical Specifications

### Rule Metadata Integration
Documentation should align with the rule's metadata:

```typescript
// Rule meta.docs.description should match the brief description
meta: {
  docs: {
    description: 'Brief one-line description matching the docs',
  }
}
```

### URL References
- The rule's `RuleCreator` URL should point to the documentation
- URL format: `https://github.com/jasonpaff/eslint-plugin-react-snob/blob/main/docs/rules/${ruleName}.md`

## Examples by Rule Type

### Style Rules (type: 'suggestion')
Focus on consistency and readability improvements:

```markdown
This rule enforces consistent formatting of [specific pattern] to improve code readability and maintainability.

Examples of **incorrect** code for this rule:
```jsx
// ❌ Inconsistent style
<div className="text-center">Content</div>
```

Examples of **correct** code for this rule:
```jsx
// ✅ Consistent style  
<div className={"text-center"}>Content</div>
```
```

### Best Practice Rules (type: 'suggestion')
Emphasize React conventions and maintainability:

```markdown
This rule enforces React best practices by ensuring [specific pattern]. This improves component maintainability and follows established React conventions.
```

### Problem Prevention Rules (type: 'problem')
Focus on potential errors and bugs:

```markdown
This rule prevents potential runtime errors by catching [specific issue] at lint time.
```

## Quality Checklist

Before finalizing rule documentation, verify:

- [ ] Rule name matches the file name exactly
- [ ] Brief description is clear and under 20 words
- [ ] Rule Details explains the "why" not just the "what"
- [ ] Incorrect examples actually violate the rule
- [ ] Correct examples actually pass the rule  
- [ ] Options are documented with types and defaults
- [ ] Configuration examples use proper JSON syntax
- [ ] Code examples use realistic React patterns
- [ ] Markdown formatting is consistent
- [ ] Links and references work correctly

## Integration with Development Workflow

### When Creating Documentation
1. **Create docs first**: Write documentation before implementing the rule to clarify requirements
2. **Test examples**: Verify all code examples work as expected
3. **Review alignment**: Ensure docs match rule behavior exactly
4. **Update configs**: Add the rule to plugin configurations after documenting

### When Updating Rules
1. **Update docs first**: Modify documentation to reflect new behavior
2. **Verify examples**: Ensure all examples still work correctly  
3. **Check options**: Update option documentation if parameters change
4. **Review consistency**: Maintain consistency with other rule docs

## Common Pitfalls to Avoid

- **Implementation details**: Don't explain how the rule works internally
- **Contrived examples**: Avoid unrealistic code examples
- **Missing context**: Include enough code context to understand the problem
- **Inconsistent naming**: Use exact rule names consistently
- **Outdated examples**: Keep examples current with modern React patterns
- **Missing edge cases**: Document behavior for unusual but valid scenarios
- **Unclear benefits**: Always explain why the rule improves code quality

## Documentation Review Process

Before merging documentation:

1. **Grammar and spelling**: Use tools to check for errors
2. **Code verification**: Test all examples with the actual rule
3. **Consistency check**: Compare with existing rule documentation
4. **User perspective**: Read from a developer's point of view
5. **Completeness**: Ensure all sections are filled out appropriately