export const buildRoute = (pathTemplate: string, configs: { [id: string]: string }): string => {
  let result = pathTemplate
  Object.entries(configs).forEach(([id, str]) => {
    result = result.replace(`:${id}`, str)
  })

  return result
}
