/**
 * parse a npm package name into a {name, version, path} object
 * @param packageName
 * @param fillVersion
 */
export const parsePackageName = (packageName: string, fillVersion = false) => {
  const RE_SCOPED = /^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/
  const RE_NON_SCOPED = /^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/
  const result = RE_SCOPED.exec(packageName) || RE_NON_SCOPED.exec(packageName)
  if (!result) {
    throw new Error(`[parse-package-name] invalid package name: ${packageName}`)
  }
  const name = result[1] ?? ''
  const fallbackVersion = fillVersion ? 'latest' : ''
  const version = result[2] ?? fallbackVersion
  const path = result[3] ?? ''

  return {
    name,
    version,
    path,
  }
}
