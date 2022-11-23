import React, { useState, useEffect, useCallback } from 'react'
import { Menu, Empty } from 'infrad'
import { RightOutlined } from 'infra-design-icons'

import {
  directoryControllerListDirectoryProjects,
  directoryControllerListDirectoryApplications
} from 'swagger-api/v1/apis/Directory'

import { IDirectoryProject, IDirectoryApplication } from 'swagger-api/v1/models'

import { useRecoilValue } from 'recoil'
import { switchedTenant as switchedTenantState } from 'states/tenantSwitcher'

import history from 'helpers/history'
import { buildApplicationName, buildProjectName } from 'constants/routes/name'
import { APPLICATIONS } from 'constants/routes/routes'
import { Link } from 'react-router-dom'

import useMountedState from 'hooks/useMountedState'

import { Wrapper, Title, Content, MenuWrapper, StyledMenu } from './style'

const { Item } = Menu

const ApplicationMenu: React.FC = () => {
  const [projects, setProjects] = useState<IDirectoryProject[]>([])
  const [applications, setApplications] = useState<IDirectoryApplication[]>([])
  const [selectedProject, setSelectedProject] = useState<string>()

  const switchedTenant = useRecoilValue(switchedTenantState)
  const { id: switchedTenantId } = switchedTenant || {}

  const getMounted = useMountedState()
  const isMounted = getMounted()

  const getProjectsFn = useCallback(async () => {
    if (switchedTenantId) {
      // reset applications if tenant change
      setApplications([])

      const tenantProjects = await directoryControllerListDirectoryProjects({
        tenantId: switchedTenantId
      })
      const { projects } = tenantProjects
      setProjects(projects)
    }
  }, [switchedTenantId])

  const handleMouseEnter = e => {
    setApplications([])
    e?.key && setSelectedProject(e.key)
  }

  const handleApplicationSelect = ({ key }) => {
    const selectedAppRoute = buildApplicationName(switchedTenantId, selectedProject, key)
    history.push(`${APPLICATIONS}/${selectedAppRoute}`)
  }

  const getApplicationsFn = useCallback(async () => {
    if (selectedProject) {
      const tenantProjects = await directoryControllerListDirectoryApplications({
        tenantId: switchedTenantId,
        projectName: selectedProject
      })
      const { applications } = tenantProjects
      setApplications(applications)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject])

  useEffect(() => {
    isMounted && getProjectsFn()
  }, [getProjectsFn, isMounted])

  useEffect(() => {
    isMounted && getApplicationsFn()
  }, [getApplicationsFn, isMounted])

  return (
    <Wrapper>
      <Title>App Management</Title>
      <Content>
        <MenuWrapper>
          {projects.length === 0 ? (
            <Empty />
          ) : (
            <StyledMenu mode='inline' inlineCollapsed={false}>
              {projects.map(({ name }) => (
                <Item key={name} onMouseEnter={handleMouseEnter}>
                  <Link to={`${APPLICATIONS}/${buildProjectName(switchedTenantId, name)}`}>
                    {name}&nbsp;&nbsp;
                    <RightOutlined style={{ float: 'right', marginTop: 14, fontSize: '12px' }} />
                  </Link>
                </Item>
              ))}
            </StyledMenu>
          )}
        </MenuWrapper>
        <MenuWrapper>
          {applications.length === 0 ? (
            <Empty />
          ) : (
            <StyledMenu mode='inline' inlineCollapsed={false} onSelect={handleApplicationSelect}>
              {applications.map(({ name }) => (
                <Item key={name}>{name}</Item>
              ))}
            </StyledMenu>
          )}
        </MenuWrapper>
      </Content>
    </Wrapper>
  )
}

export default ApplicationMenu
