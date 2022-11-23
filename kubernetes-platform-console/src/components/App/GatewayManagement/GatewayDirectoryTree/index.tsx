import * as React from 'react'
import { Spin, Tree } from 'infrad'
import { matchPath } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import history from 'helpers/history'
import useAsyncFn from 'hooks/useAsyncFn'
import { treesControllerGetTenantProjectTree } from 'swagger-api/v3/apis/Tree'
import { ingressesControllerGetIngressesTree } from 'swagger-api/v3/apis/Ingresses'
import { IITenantTreeItem } from 'swagger-api/v3/models'

import { gatewaySelectedExpandedNodes, gatewaySelectedTreeNodes } from 'states/gatewayState/tree'
import { switchedTenant as switchedTenantState } from 'states/tenantSwitcher'

import { GATEWAYS } from 'constants/routes/routes'
import { LOAD_BALANCE, INGRESS, GIT_TEMPLATE_RENDER } from 'constants/routes/gateway/name'
import { GATEWAY_SERVICES_GROUP_DETAIL } from 'constants/routes/gateway/routes'

import { VerticalDivider } from 'common-styles/divider'
import { DirectoryTreeWrapper } from 'common-styles/directoryWrapper'

import { SpinWrapper } from './style'

const { DirectoryTree } = Tree

const paths = ['gateways', 'tenants', 'projects']

const generateServicesTree = (rawData: any) => {
  const generateTreeNode = (data, deep = 0, prefix?: string) => {
    const currentKey = paths[deep]
    const resources = data[currentKey]

    return resources.map(resource => {
      const { name, id } = resource
      const currentKey = paths[deep]
      const resourceName = currentKey === 'tenants' ? `${currentKey}/${id}` : `${currentKey}/${name}`

      const key = prefix ? `${prefix}/${resourceName}` : resourceName
      const isLeaf = deep === paths.length - 1

      return {
        key,
        isLeaf,
        title: name,
        id,
        selectable: isLeaf,
        children: isLeaf ? null : generateTreeNode(resource, deep + 1, key)
      }
    })
  }

  return generateTreeNode(rawData)
}

const getDefaultTreeData = (treeData, paths?: string[]) => {
  let treeNodeData

  if (paths.length) {
    const path = paths.shift()
    treeNodeData = treeData.find(item => item.title === path || item.id === Number(path))
  } else {
    treeNodeData = treeData[0]
  }

  const { children } = treeNodeData || {}

  if (children) {
    return getDefaultTreeData(children, paths)
  }

  const { key } = treeNodeData || {}

  return key
}

interface IGateway {
  name: string
  tenants: IITenantTreeItem[]
}

interface ITree {
  gateways: IGateway[]
}

const GatewayDirectoryTree: React.FC = () => {
  const [nestedServicesTreeData, setNestedServicesTreeData] = React.useState<ITree>()

  const [selectedKeys, setSelectedKeys] = React.useState([])
  const [expandedKeys, setExpandedKeys] = React.useState([])
  const [ingressTree, setIngressTree] = React.useState([])

  const defaultSelectedKeys = useRecoilValue(gatewaySelectedTreeNodes)
  const defaultExpandedKeys = useRecoilValue(gatewaySelectedExpandedNodes)
  const switchedTenant = useRecoilValue(switchedTenantState)
  const [projectsTreeFnState, projectsTreeFn] = useAsyncFn(treesControllerGetTenantProjectTree)
  const [ingressTreeFnState, ingressTreeFn] = useAsyncFn(ingressesControllerGetIngressesTree)

  React.useEffect(() => {
    projectsTreeFn()
  }, [projectsTreeFn])

  React.useEffect(() => {
    ingressTreeFn()
  }, [ingressTreeFn])

  React.useEffect(() => {
    if (projectsTreeFnState.value) {
      const { tenants } = projectsTreeFnState.value

      setNestedServicesTreeData({
        gateways: [
          {
            name: 'Services',
            tenants: tenants
              .filter(item => item.projects.length !== 0)
              .concat(tenants.filter(item => item.projects.length === 0))
          }
        ]
      })
    }
  }, [projectsTreeFnState.value])

  React.useEffect(() => {
    if (ingressTreeFnState.value) {
      const clusters = ingressTreeFnState.value

      setIngressTree([
        {
          title: 'Ingress',
          key: `${INGRESS}`,
          children: clusters.map(item => {
            return {
              title: item,
              key: `${INGRESS}/clusters/${item}`,
              children: null,
              selectable: true,
              isLeaf: true
            }
          }),
          selectable: false,
          isLeaf: false
        }
      ])
    }
  }, [ingressTreeFnState.value])

  React.useEffect(() => {
    setExpandedKeys(Array.from(new Set([...expandedKeys, ...defaultExpandedKeys])))
    setSelectedKeys(defaultSelectedKeys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultExpandedKeys, defaultSelectedKeys])

  const treeData = React.useMemo(() => {
    if (nestedServicesTreeData) {
      return [].concat(
        generateServicesTree(nestedServicesTreeData),
        {
          key: LOAD_BALANCE,
          title: 'Load Balance',
          children: [
            {
              key: GIT_TEMPLATE_RENDER,
              title: 'Git Template Render',
              children: null,
              selectable: true,
              isLeaf: true
            }
          ],
          selectable: false,
          isLeaf: false
        },
        ingressTree
      )
    }
  }, [nestedServicesTreeData, ingressTree])

  const location = useLocation()

  React.useEffect(() => {
    if (!treeData) return
    const paths = [GATEWAY_SERVICES_GROUP_DETAIL, GATEWAYS]

    paths.forEach(path => {
      const match = matchPath(location.pathname, { path })
      if (match && match.isExact) {
        const { params } = match
        const { gatewayName = 'Services', tenantId } = params as any
        const { id: switchedTenantId } = switchedTenant || {}
        const { tenants } = projectsTreeFnState.value
        // ignore switched tenant without services
        const isSwitchedTenantValid = tenants.find(item => item.projects.length !== 0 && item.id === switchedTenantId)
        const gateWayPaths = isSwitchedTenantValid ? [gatewayName, switchedTenantId] : [gatewayName]
        const paths = tenantId ? [gatewayName, tenantId] : gateWayPaths

        history.push(`/${getDefaultTreeData(treeData, paths)}`)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, treeData])

  return projectsTreeFnState.loading ? (
    <SpinWrapper>
      <VerticalDivider size='100px' />
      <Spin />
    </SpinWrapper>
  ) : (
    <DirectoryTreeWrapper>
      <DirectoryTree
        style={{ width: '100%' }}
        showIcon={false}
        treeData={treeData}
        selectedKeys={[...selectedKeys]}
        expandedKeys={[...expandedKeys]}
        onExpand={keys => {
          setExpandedKeys(keys)
        }}
        onSelect={selectedKeys => {
          const resource = selectedKeys[0]

          if (resource) {
            history.push(`/${resource}`)
          }
        }}
        expandAction='doubleClick'
      />
    </DirectoryTreeWrapper>
  )
}

export default GatewayDirectoryTree
