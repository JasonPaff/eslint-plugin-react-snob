export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce brackets around string values in JSX attributes',
            category: 'Stylistic Issues',
            recommended: false,
        },
        fixable: 'code',
        messages: {
            stringAttributeNeedsBrackets:
                'String attribute "{attributeName}" should use curly braces: {attributeName}={{"{{value}}"}}',
        },
        schema: [],
    },

    create(context) {
        return {
            JSXAttribute(node) {
                // Check if the attribute has a value
                if (!node.value) {
                    return;
                }

                // Check if the value is a Literal (string without brackets)
                if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
                    const attributeName = node.name.name;
                    const stringValue = node.value.value;

                    context.report({
                        node: node.value,
                        messageId: 'stringAttributeNeedsBrackets',
                        data: {
                            attributeName,
                            value: stringValue,
                        },
                        fix(fixer) {
                            // Replace the string literal with a JSX expression containing the string
                            const sourceCode = context.getSourceCode();
                            const originalText = sourceCode.getText(node.value);

                            // Convert "string" to {"string"}
                            const fixedText = `{${originalText}}`;

                            return fixer.replaceText(node.value, fixedText);
                        },
                    });
                }
            },
        };
    },
};
