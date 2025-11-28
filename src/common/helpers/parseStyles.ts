export function parseStyles(input?: Record<string, string> | string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!input) return result;

  if (typeof input !== 'string') return input;

  const declarations = input.split(';');

  for (const declaration of declarations) {
    const colonIndex = declaration.indexOf(':');
    if (colonIndex !== -1) {
      const property = declaration.substring(0, colonIndex).trim();
      const value = declaration.substring(colonIndex + 1).trim();

      if (property && value) {
        const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelCaseProperty] = value;
      }
    }
  }

  return result;
}
