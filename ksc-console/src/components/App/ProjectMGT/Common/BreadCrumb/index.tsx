import * as React from 'react'
import { ICrumbTreeProps } from 'components/Common/Breadcrumbs'
import { PROJECT, TENANT, JOB, PERIODIC_INSTANCE, PERIODIC_JOB } from 'constants/routes/route'
import { PROJECT_ID, TENANT_ID, JOB_ID, PERIODIC_JOB_ID } from 'constants/routes/identifier'
import { tenantControllerListTenants } from 'swagger-api/apis/Tenant'
import { projectControllerListProjects } from 'swagger-api/apis/Project'
import { ITenantListItem, IProjectListItem } from 'swagger-api/models'
import CustomBreadcrumbs, {
  IBreadcrumbProps,
  IGetOverlayMapParams,
  IOverlayDropdownList,
} from 'components/Common/CustomBreadcrumbs'

type DropdownList = ITenantListItem | IProjectListItem

function isTenantList(item: DropdownList): item is ITenantListItem {
  return 'tenantCmdbName' in item
}

function formatOverlayDropdownList(
  originData: Array<DropdownList>,
  crumbParamsKey: string,
): IOverlayDropdownList[] {
  return originData.map((item) => ({
    id: item[crumbParamsKey],
    name: isTenantList(item) ? item.tenantCmdbName || item.displayName : item.displayName,
  }))
}

export enum CRUMB_TYPE {
  TENANT = 'Tenant',
  PROJECT = 'Project',
  JOB = 'Job',
  PERIODIC_JOB = 'PeriodicJob',
  INSTANCE = 'Instance',
}

const DEFAULT_LIMIT = '10000'

const getOverlayMap = {
  [CRUMB_TYPE.TENANT]: async ({ crumb }: IGetOverlayMapParams) => {
    if (crumb.overlayDropdownLists.length > 0) return []

    const { items = [] } = await tenantControllerListTenants({ limit: DEFAULT_LIMIT })
    return formatOverlayDropdownList(items, TENANT_ID)
  },
  [CRUMB_TYPE.PROJECT]: async ({ queryParams, oldQueryParams }: IGetOverlayMapParams) => {
    const tenantId = queryParams[TENANT_ID] || ''
    if (tenantId && tenantId !== oldQueryParams?.[TENANT_ID]) {
      const { items = [] } = await projectControllerListProjects({ tenantId, limit: DEFAULT_LIMIT })
      return formatOverlayDropdownList(items, PROJECT_ID)
    }
    return []
  },
}

const routeCrumbs: Array<ICrumbTreeProps> = [
  {
    crumbName: CRUMB_TYPE.TENANT,
    route: TENANT,
    paramsKey: TENANT_ID,
    overlayDropdownLists: [],
    overlay: true,
  },
  {
    crumbName: CRUMB_TYPE.PROJECT,
    route: PROJECT,
    paramsKey: PROJECT_ID,
    overlayDropdownLists: [],
    overlay: true,
  },
  {
    crumbName: CRUMB_TYPE.JOB,
    route: JOB,
    paramsKey: JOB_ID,
    overlayDropdownLists: [],
    overlay: false,
  },
  {
    crumbName: CRUMB_TYPE.PERIODIC_JOB,
    route: PERIODIC_JOB,
    paramsKey: PERIODIC_JOB_ID,
    overlayDropdownLists: [],
    overlay: false,
  },
  {
    crumbName: CRUMB_TYPE.INSTANCE,
    route: PERIODIC_INSTANCE,
    paramsKey: JOB_ID,
    overlayDropdownLists: [],
    overlay: false,
  },
]
const periodicCrumbNames = [CRUMB_TYPE.PERIODIC_JOB, CRUMB_TYPE.INSTANCE]

const Breadcrumb: React.FC<IBreadcrumbProps<CRUMB_TYPE>> = (props) => {
  const { crumbName } = props
  const newRouteCrumbs = [...routeCrumbs]
  if (periodicCrumbNames.includes(crumbName)) {
    // remove CRUMB_TYPE.JOB. There is only one CRUMB_TYPE.PERIODIC_JOB and CRUMB_TYPE.JOB
    newRouteCrumbs.splice(2, 1)
  }
  return <CustomBreadcrumbs routeCrumbs={newRouteCrumbs} getOverlayMap={getOverlayMap} {...props} />
}

export default Breadcrumb
