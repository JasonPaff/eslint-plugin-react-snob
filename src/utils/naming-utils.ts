/**
 * Converts a variable name to its suggested underscore prefixed version
 */
export function suggestUnderscorePrefix(name: string): string {
  if (name.startsWith('_')) return name;
  return `_${name}`;
}

/**
 * Checks if a name already starts with underscore
 */
export function hasUnderscorePrefix(name: string): boolean {
  return name.startsWith('_');
}

/**
 * Converts a variable name to its suggested prefixed version based on allowed prefixes
 */
export function suggestPrefixedName(name: string, allowedPrefixes: string[]): string {
  // Check if name already starts with any allowed prefix
  for (const prefix of allowedPrefixes) {
    if (hasValidPrefix(name, prefix)) return name;
  }

  // Use the first allowed prefix as the suggested prefix
  const prefix = allowedPrefixes[0];

  // If the name is all uppercase (constants), suggest UPPER_CASE prefix
  if (/^[A-Z_0-9]+$/.test(name)) {
    return `${prefix.toUpperCase()}_${name}`;
  }

  // Handle underscore prefix case
  if (name.startsWith('_')) {
    const nameWithoutUnderscore = name.slice(1);
    const capitalized = nameWithoutUnderscore.charAt(0).toUpperCase() + nameWithoutUnderscore.slice(1);
    return `_${prefix}${capitalized}`;
  }

  // Handle common patterns and capitalize appropriately
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return `${prefix}${capitalized}`;
}

/**
 * Checks if a name already starts with a valid prefix (including underscore prefix)
 */
export function hasValidPrefix(name: string, prefix: string): boolean {
  const lowerPrefix = prefix.toLowerCase();
  const upperPrefix = prefix.toUpperCase();

  // Check for camelCase prefix (e.g., "is", "has", "should")
  const camelCaseRegex = new RegExp(`^${lowerPrefix}[A-Z]`);

  // Check for UPPER_CASE prefix (e.g., "IS_", "HAS_", "SHOULD_")
  const upperCaseRegex = new RegExp(`^${upperPrefix}_`);

  // Check for underscore prefix case (e.g., "_is", "_has", "_should")
  const underscoreRegex = new RegExp(`^_${lowerPrefix}[A-Z]`);

  return camelCaseRegex.test(name) || upperCaseRegex.test(name) || underscoreRegex.test(name);
}

/**
 * Checks if a name starts with any of the allowed prefixes
 */
export function hasAnyValidPrefix(name: string, allowedPrefixes: string[]): boolean {
  return allowedPrefixes.some((prefix) => hasValidPrefix(name, prefix));
}
