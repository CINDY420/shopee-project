import React, { useState, useEffect, useCallback } from 'react'
import { Menu, Dropdown, message } from 'infrad'
import { DownOutlined, UpOutlined } from 'infra-design-icons'

import { directoryControllerGroupDirectoryGetGroups } from 'swagger-api/v3/apis/Directory'
import { IITenant } from 'swagger-api/v3/models'
import history from 'helpers/history'
import { APPLICATIONS, PIPELINES } from 'constants/routes/routes'
import { TENANT_ID } from 'constants/routes/identifier'

import { TENANT } from 'constants/routes/name'
import { useRouteMatch } from 'react-router-dom'

import { switchedTenant } from 'states/tenantSwitcher'
import { useSetRecoilState } from 'recoil'

const { Item } = Menu

const applicationsTenantRoute = `${APPLICATIONS}/${TENANT}`
const pipelinesTenantRoute = `${PIPELINES}/${TENANT}`

const TenantSwitcher: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [tenantList, setTenantList] = useState<IITenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<IITenant>()

  const applicationsMatch = useRouteMatch(APPLICATIONS)
  const applicationsTenantMatch = useRouteMatch(applicationsTenantRoute)
  const pipelinesTenantMatch = useRouteMatch(pipelinesTenantRoute)

  const pipelinesMatch = useRouteMatch(PIPELINES)

  const setSwitchedTenant = useSetRecoilState(switchedTenant)

  const getVisibleTenantsFn = useCallback(async () => {
    try {
      const visibleTenants = await directoryControllerGroupDirectoryGetGroups({})
      const { tenants } = visibleTenants
      setTenantList(tenants)
    } catch (err) {
      err?.message && message.error(err.message)
    }
  }, [])

  // init tenants
  useEffect(() => {
    getVisibleTenantsFn()
  }, [getVisibleTenantsFn])

  // handle default tenant
  useEffect(() => {
    // when view Applications Management
    const SelectedMatch = applicationsMatch || pipelinesMatch
    if (SelectedMatch) {
      const SelectedTenantMatch = applicationsTenantMatch || pipelinesTenantMatch
      if (SelectedTenantMatch) {
        // get tenantId from url
        const { params = {} } = SelectedTenantMatch || {}
        const { [TENANT_ID]: matchedTenantId } = (params as any) || {}

        const matchedTenant = tenantList.find(({ id }) => id === Number(matchedTenantId))
        if (matchedTenant) {
          setSelectedTenant(matchedTenant)
        } else {
          const defaultTenant = tenantList[0]
          setSelectedTenant(defaultTenant)
        }
      } else {
        // when can't get tenantId from url
        if (selectedTenant) {
          history.replace(`${SelectedMatch.path}/tenants/${selectedTenant.id}`)
        } else if (tenantList.length) {
          const defaultTenant = tenantList[0]
          setSelectedTenant(defaultTenant)
          history.replace(`${SelectedMatch.path}/tenants/${defaultTenant.id}`)
        }
      }
    } else {
      // when view by a link
      if (!selectedTenant && tenantList.length) {
        const defaultTenant = tenantList[0]
        setSelectedTenant(defaultTenant)
      }
    }
  }, [tenantList, applicationsMatch, applicationsTenantMatch, pipelinesMatch, pipelinesTenantMatch, selectedTenant])

  // used for Gateway Management
  useEffect(() => {
    setSwitchedTenant(selectedTenant)
  }, [selectedTenant, setSwitchedTenant])

  const handleTenantSelect = ({ key: tenantId }) => {
    const selectedTenant = tenantList.find(({ id }) => id === Number(tenantId))
    setSelectedTenant(selectedTenant)
    setVisible(false)
    if (applicationsMatch) {
      history.push(`${APPLICATIONS}/tenants/${selectedTenant.id}`)
    } else if (pipelinesMatch) {
      history.push(`${PIPELINES}/tenants/${selectedTenant.id}`)
    }
  }

  const menu = (
    <Menu
      onClick={handleTenantSelect}
      style={{ maxHeight: 700, overflow: 'auto' }}
      selectedKeys={selectedTenant ? [`${selectedTenant.id}`] : []}
    >
      {tenantList.map(({ id, name }) => (
        <Item style={{ padding: '12px 16px' }} key={id}>
          {name}
        </Item>
      ))}
    </Menu>
  )
  const handleVisibleChange = (visible: boolean) => setVisible(visible)

  return (
    <Dropdown overlay={menu} onVisibleChange={handleVisibleChange} trigger={['click']}>
      <div style={{ whiteSpace: 'nowrap', margin: '0 24px', cursor: 'pointer' }}>
        <span style={{ opacity: selectedTenant ? 1 : 0.64 }}>
          {selectedTenant ? `Tenant: ${selectedTenant.name}` : 'Tenant Switcher'}{' '}
          {visible ? <UpOutlined style={{ fontSize: 12 }} /> : <DownOutlined style={{ fontSize: 12 }} />}
        </span>
      </div>
    </Dropdown>
  )
}

export default TenantSwitcher
