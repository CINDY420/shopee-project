import * as React from 'react'
import { Spin, Tree } from 'infrad'
import { useRecoilValue, useRecoilState } from 'recoil'

import history from 'helpers/history'
import useAsyncFn from 'hooks/useAsyncFn'
import { treesControllerGetTenantProjectTree } from 'swagger-api/v3/apis/Tree'
import { APPLICATIONS } from 'constants/routes/routes'
import { tenantId } from 'helpers/applicationId'
import useUpdateApplicationToTree from 'hooks/tree/useUpdateApplicationToTree'
import { selectedTreeNodes, selectedExpandedNodes, tree } from 'states/applicationState/tree'

import { VerticalDivider } from 'common-styles/divider'
import { DirectoryTreeWrapper } from 'common-styles/directoryWrapper'

import { SpinWrapper } from './style'

const { DirectoryTree } = Tree

const generateTree = (rawData: any) => {
  const keys = ['tenants', 'projects', 'applications']

  const generateTreeNode = (data, deep = 0, prefix?: string) => {
    const currentKey = keys[deep]
    const resources = data[currentKey] || []

    return resources.map(resource => {
      const { name, id, tenantId: tenantid } = resource
      const key = prefix ? `${prefix}/${currentKey}/${name}` : tenantId({ tenantId: tenantid || id })
      const isLeaf = deep === keys.length - 1

      return {
        title: name,
        key,
        children: isLeaf ? null : generateTreeNode(resource, deep + 1, key),
        isLeaf,
        resourceType: currentKey,
        data: resource
      }
    })
  }

  return generateTreeNode(rawData)
}

const ApplicationTree: React.FC = () => {
  const [tenants, setTenants] = useRecoilState(tree)

  const [loadedKeys, setLoadedKeys] = React.useState([])
  const [selectedKeys, setSelectedKeys] = React.useState([])
  const [expandedKeys, setExpandedKeys] = React.useState([])

  const defaultSelectedKeys = useRecoilValue(selectedTreeNodes)
  const defaultExpandedKeys = useRecoilValue(selectedExpandedNodes)

  const updateApplicationToTreeFn = useUpdateApplicationToTree()
  const [projectsTreeFnState, projectsTreeFn] = useAsyncFn(treesControllerGetTenantProjectTree)

  React.useEffect(() => {
    projectsTreeFn()
  }, [projectsTreeFn])

  React.useEffect(() => {
    if (projectsTreeFnState.value) {
      const { tenants } = projectsTreeFnState.value

      setTenants(tenants)

      if (history.location.pathname === APPLICATIONS && tenants.length) {
        const defaultTenant = tenants[0]
        history.replace(`${APPLICATIONS}/tenants/${defaultTenant.id}`)
      }
    }
  }, [projectsTreeFnState.value, setTenants])

  React.useEffect(() => {
    setExpandedKeys(Array.from(new Set([...expandedKeys, ...defaultExpandedKeys])))
    setSelectedKeys(defaultSelectedKeys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelectedKeys, defaultExpandedKeys])

  const treeData = React.useMemo(() => {
    if (tenants) {
      return generateTree({ tenants })
    }
  }, [tenants])

  const handleLoadData = React.useCallback(
    async node => {
      const { key, data, resourceType } = node

      if (!loadedKeys.includes(key)) {
        setLoadedKeys([key].concat(loadedKeys))
      }

      if (resourceType === 'projects') {
        const { name, tenantId } = data
        try {
          await updateApplicationToTreeFn(tenantId, name)
        } catch (e) {
          console.error(e)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateApplicationToTreeFn]
  )

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
        loadedKeys={loadedKeys}
        selectedKeys={[...selectedKeys]}
        expandedKeys={[...expandedKeys]}
        onExpand={keys => {
          setExpandedKeys(keys)
        }}
        onSelect={selectedKeys => {
          const resource = selectedKeys[0]

          if (resource) {
            history.push(`${APPLICATIONS}/${resource}`)
          }
        }}
        expandAction='doubleClick'
        loadData={handleLoadData}
      />
    </DirectoryTreeWrapper>
  )
}

export default ApplicationTree
