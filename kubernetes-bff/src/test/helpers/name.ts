export function generateName(prefix?: string) {
  return `${prefix || 'autotestbff'}${Math.random().toString(36).substring(7)}`
}
