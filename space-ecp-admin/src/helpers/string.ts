export function convertCamelcaseToPascalCase(sourceString: string) {
  return sourceString.charAt(0).toUpperCase() + sourceString.slice(1)
}
