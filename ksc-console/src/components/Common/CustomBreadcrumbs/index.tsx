import * as React from 'react'
import { useParams, Params } from 'react-router-dom'
import Breadcrumbs, { ICrumbTreeProps } from 'components/Common/Breadcrumbs'
import { listRoutes } from 'components/App/routes'

export interface IBreadcrumbProps<TCrumbName extends string> {
  crumbName: TCrumbName
  displayName?: string
  customRoute?: string
}

export interface IGetOverlayMapParams {
  crumb: ICrumbTreeProps
  queryParams: Params<string>
  oldQueryParams: Params<string>
}

export interface IOverlayDropdownList {
  id: string
  name: string
}

interface ICustomBreadcrumbsProps extends IBreadcrumbProps<string> {
  routeCrumbs: ICrumbTreeProps[]
  getOverlayMap: Record<string, (params: IGetOverlayMapParams) => Promise<IOverlayDropdownList[]>>
}

const CustomBreadcrumbs: React.FC<ICustomBreadcrumbsProps> = ({
  routeCrumbs,
  getOverlayMap,
  crumbName,
  displayName,
}) => {
  const index = routeCrumbs.findIndex((routeCrumb) => routeCrumb.crumbName === crumbName)
  const [crumbs, setCrumbs] = React.useState(routeCrumbs.slice(0, index + 1))
  const [oldQueryParams, setOldQueryParams] = React.useState<Params<string>>({})
  const queryParams = useParams()

  const generateCrumbs = async () => {
    await Promise.all(
      crumbs.map(async (crumb) => {
        if (crumb.crumbName === crumbName && !crumb.overlay && displayName)
          crumb.currentDisplayName = displayName

        if (crumb.overlay && getOverlayMap[crumb.crumbName]) {
          const items: IOverlayDropdownList[] = await getOverlayMap[crumb.crumbName]({
            crumb,
            queryParams,
            oldQueryParams,
          })
          if (items?.length > 0) {
            crumb.overlayDropdownLists = items
            setCrumbs([...crumbs])
          }
        }
        return crumb
      }),
    )
    setOldQueryParams(queryParams)
  }
  generateCrumbs()
  return <Breadcrumbs crumbTree={crumbs} routes={listRoutes({})} />
}

export default CustomBreadcrumbs
