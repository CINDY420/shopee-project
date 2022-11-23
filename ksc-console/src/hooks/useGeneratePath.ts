import React from 'react'
import { matchRoutes, useLocation, generatePath, RouteObject, Params } from 'react-router-dom'
import * as ramda from 'ramda'
import { listRoutes } from 'components/App/routes'

/**
 * useGeneratePath 用来处理带有params的路由，生成完成的path
 * @param routes 项目的路由配置数据
 * @returns generate函数，接受to和params两个参数，用来最后生成完成的path
 */
export default function useGeneratePath(routes?: RouteObject[]) {
  const location = useLocation()
  const [queryParams, setQueryParams] = React.useState<Params>()

  React.useEffect(() => {
    const matchResults = matchRoutes(routes || listRoutes({}), location) || []
    const route = matchResults[matchResults.length - 1]
    if (!ramda.equals(route.params, queryParams)) setQueryParams(route.params)
  }, [location, routes, queryParams])

  function generate(to: string, params?: Params): string {
    const query = { ...queryParams, ...params }
    return generatePath(to, query)
  }
  return generate
}
