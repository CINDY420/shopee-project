import * as React from 'react'
import { ICrumbTreeProps } from 'components/Common/Breadcrumbs'
import { CLUSTER, CLUSTER_MANAGEMENT } from 'constants/routes/route'
import { CLUSTER_ID } from 'constants/routes/identifier'
import { IClusterListItem } from 'swagger-api/models'
import { clusterControllerListClusters } from 'swagger-api/apis/Cluster'
import CustomBreadcrumbs, {
  IBreadcrumbProps,
  IGetOverlayMapParams,
  IOverlayDropdownList,
} from 'components/Common/CustomBreadcrumbs'

function formatOverlayDropdownList(
  originData: Array<IClusterListItem>,
  crumbParamsKey: string,
): IOverlayDropdownList[] {
  return originData.map((item) => ({
    id: item[crumbParamsKey],
    name: item.displayName,
  }))
}

export enum CRUMB_TYPE {
  CLUSTER_MANAGEMENT = 'Cluster Management',
  CLUSTER = 'Cluster',
}

const DEFAULT_LIMIT = '10000'

const getOverlayMap = {
  [CRUMB_TYPE.CLUSTER]: async ({ crumb }: IGetOverlayMapParams) => {
    if (crumb.overlayDropdownLists.length > 0) return []

    const { items = [] } = await clusterControllerListClusters({ limit: DEFAULT_LIMIT })
    return formatOverlayDropdownList(items, CLUSTER_ID)
  },
}

const routeCrumbs: Array<ICrumbTreeProps> = [
  {
    crumbName: CRUMB_TYPE.CLUSTER_MANAGEMENT,
    route: CLUSTER_MANAGEMENT,
    paramsKey: '',
    overlayDropdownLists: [],
    overlay: false,
  },
  {
    crumbName: CRUMB_TYPE.CLUSTER,
    route: CLUSTER,
    paramsKey: CLUSTER_ID,
    overlayDropdownLists: [],
    overlay: true,
  },
]

const Breadcrumb: React.FC<IBreadcrumbProps<CRUMB_TYPE>> = (props) => (
  <CustomBreadcrumbs routeCrumbs={routeCrumbs} getOverlayMap={getOverlayMap} {...props} />
)

export default Breadcrumb
