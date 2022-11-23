import * as React from 'react'
import DetailLayout from 'components/Common/DetailLayout'
import { Card, Typography, Tabs, Button } from 'infrad'
import { HeaderWrapper, StyledTabs } from 'components/App/ResourceManagement/style'
import Stock from 'components/App/ResourceManagement/Stock'
import Incremental from 'components/App/ResourceManagement/Incremental'
import Summary from 'components/App/ResourceManagement/Summary'
import {
  ResourceContext,
  getDispatchers,
  initialState,
  reducer
} from 'components/App/ResourceManagement/useResourceContext'
import {
  sduResourceControllerGetLabelTree,
  sduResourceControllerListAzs,
  sduResourceControllerListBigSales,
  sduResourceControllerListCids,
  sduResourceControllerListClusters,
  sduResourceControllerListEnvs,
  sduResourceControllerListMachineModels,
  sduResourceControllerListSegments,
  sduResourceControllerListVersion
} from 'swagger-api/v1/apis/SduResource'

import { IBigSale, ILabelNode } from 'swagger-api/v1/models'
import { StringParam, useQueryParam, withDefault } from 'use-query-params'
import accessControl from 'hocs/accessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE } from 'constants/accessControl'
import { GlobalContext } from 'hocs/useGlobalContext'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'
import { SettingOutlined } from 'infra-design-icons'
import VersionManagementModal from 'components/App/ResourceManagement/Incremental/VersionManagementModal'

const { Title } = Typography
const { TabPane } = Tabs

const TABS = {
  STOCK: {
    title: 'Stock',
    Component: Stock
  },
  INCREMENTAL: {
    title: 'New',
    Component: Incremental
  },
  SUMMARY: {
    title: 'Summary',
    Component: Summary
  }
}
export enum RESOURCE_MANAGEMENT_TYPE {
  STOCK,
  INCREMENTAL
}

const Resource: React.FC = () => {
  const { state: globalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = globalContextState || {}
  const isPlatformAdmin = userRoles.some(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [])

  const [selectedTab, setSelectedTab] = useQueryParam('selectedTab', withDefault(StringParam, TABS.STOCK.title))
  const tabs = Object.values(TABS)

  const [isVersionManagementModalVisible, setVersionManagementModalVisible] = React.useState(false)
  const getLabelTree = React.useCallback(async () => {
    const labelTree = await sduResourceControllerGetLabelTree()
    const convertLabelTree = (tree: ILabelNode[] = labelTree) => {
      if (!tree) return []
      return tree.map(item => {
        const { displayName, childNodes } = item
        return {
          ...item,
          displayName: displayName || '-',
          childNodes: convertLabelTree(childNodes)
        }
      })
    }
    dispatchers.updateLabelTree(convertLabelTree())
  }, [dispatchers])

  const getVersionList = React.useCallback(async () => {
    const { versions = [] } = await sduResourceControllerListVersion()
    dispatchers.updateVersions(versions)
  }, [dispatchers])

  const getCidList = React.useCallback(async () => {
    const { cids } = await sduResourceControllerListCids()
    dispatchers.updateCids(cids)
  }, [dispatchers])

  const getEnvList = React.useCallback(async () => {
    const { envs } = await sduResourceControllerListEnvs()
    dispatchers.updateEnvs(envs)
  }, [dispatchers])

  const getAzList = React.useCallback(async () => {
    const { availableZones } = await sduResourceControllerListAzs()
    dispatchers.updateAzs(availableZones)
  }, [dispatchers])

  const getClusterList = React.useCallback(async () => {
    const { clusters } = await sduResourceControllerListClusters({ az: 'all' })
    dispatchers.updateClusters(clusters)
  }, [dispatchers])

  const getSegmentList = React.useCallback(async () => {
    const { segments } = await sduResourceControllerListSegments({ az: 'all' })
    dispatchers.updateSegments(segments)
  }, [dispatchers])

  const getMachineModelList = React.useCallback(async () => {
    const { machineModels } = await sduResourceControllerListMachineModels()
    dispatchers.updateMachineModels(machineModels)
  }, [dispatchers])

  const getBigSaleList = React.useCallback(async () => {
    const { bigSales = [] } = await sduResourceControllerListBigSales()
    const formattedBigSales = bigSales.reduce((acc: Record<number, IBigSale[]>, curr) => {
      const { year } = curr
      if (acc[year]) {
        acc[year].push(curr)
      } else {
        Object.assign(acc, { [year]: [curr] })
      }
      return acc
    }, {})
    dispatchers.updateBigSales(formattedBigSales)
  }, [dispatchers])

  React.useEffect(() => {
    getLabelTree()
    getVersionList()
    getCidList()
    getEnvList()
    getAzList()
    getClusterList()
    getSegmentList()
    getMachineModelList()
    getBigSaleList()
  }, [
    getAzList,
    getBigSaleList,
    getCidList,
    getClusterList,
    getSegmentList,
    getEnvList,
    getLabelTree,
    getMachineModelList,
    getVersionList
  ])

  return (
    <DetailLayout
      title='Resource'
      tags={[]}
      body={
        <Card style={{ marginTop: '16px', height: '100%', overflow: 'scroll' }}>
          <HeaderWrapper>
            <Title level={4}>Usage & Growth</Title>
            {isPlatformAdmin ? (
              <Button icon={<SettingOutlined />} onClick={() => setVersionManagementModalVisible(true)}>
                Version Management
              </Button>
            ) : null}
          </HeaderWrapper>
          <StyledTabs activeKey={selectedTab} onChange={setSelectedTab} tabPosition='top' type='card'>
            {tabs.map(tab => {
              const { title, Component } = tab
              return (
                <TabPane key={title} tab={title}>
                  <ResourceContext.Provider value={{ state, dispatch }}>
                    {selectedTab === title && <Component />}
                    <VersionManagementModal
                      isVisible={isVersionManagementModalVisible}
                      onCancel={() => setVersionManagementModalVisible(false)}
                      onOk={() => setVersionManagementModalVisible(false)}
                    />
                  </ResourceContext.Provider>
                </TabPane>
              )
            })}
          </StyledTabs>
        </Card>
      }
    />
  )
}

export default accessControl(Resource, PERMISSION_SCOPE.GLOBAL, [RESOURCE_TYPE.OPS])
