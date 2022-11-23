import * as React from 'react'
import { useRecoilValue } from 'recoil'
import BreadcrumbsBanner from 'components/Common/BreadcrumbsBanner'

import { ticketCenterSelectedTreeNodes } from 'states/requestAndApproval'

import history from 'helpers/history'

import { TICKET_LIST, TICKET_DETAIL, PENDING_MY_ACTION_LIST } from 'constants/routes/routes'

enum CrumbType {
  REQUESTS = 'requests',
  REQUEST = 'request'
}

const DefaultRoute = PENDING_MY_ACTION_LIST

const routeCrumbsTree = [
  {
    route: TICKET_LIST,
    extendedCrumbs: CrumbType.REQUESTS,
    children: [
      {
        route: TICKET_DETAIL,
        extendedCrumbs: CrumbType.REQUEST
      }
    ]
  }
]

const Breadcrumbs: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(DefaultRoute)
  const defaultSelectedKeys = useRecoilValue(ticketCenterSelectedTreeNodes)

  const buildCrumbLookup = () => ({
    [CrumbType.REQUESTS]: {
      onClick: data => {
        history.push(selectedKeys)
      }
    },
    [CrumbType.REQUEST]: {}
  })

  React.useEffect(() => {
    const selectedKey = defaultSelectedKeys[0]
    setSelectedKeys(selectedKey ? `/${selectedKey}` : DefaultRoute)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelectedKeys])

  return (
    <BreadcrumbsBanner
      crumbLookup={buildCrumbLookup()}
      crumbResourceLookup={{
        [CrumbType.REQUESTS]: { name: 'All requests' },
        [CrumbType.REQUEST]: { name: 'Request detail' }
      }}
      routeCrumbsTree={routeCrumbsTree}
    />
  )
}

export default Breadcrumbs
