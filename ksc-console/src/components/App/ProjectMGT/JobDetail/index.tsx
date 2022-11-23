import * as React from 'react'
import DetailLayout from 'components/Common/DetailLayout'
import { StyledRoot } from 'components/Common/DetailLayout/style'
import Breadcrumbs, { CRUMB_TYPE } from 'components/App/ProjectMGT/Common/BreadCrumb'
import JobTabs from 'components/App/ProjectMGT/JobDetail/JobTabs'
import PodList from 'components/App/ProjectMGT/JobDetail/PodList'
import { useRecoilValue } from 'recoil'
import { selectedJob } from 'states'
import { FileTextOutlined, MonitorOutlined } from 'infra-design-icons'
import { generateLogUrl, generateMonitorUrl } from 'helpers/job'
import { tenantControllerGetTenant } from 'swagger-api/apis/Tenant'
import { useParams } from 'react-router'
import { projectControllerGetProject } from 'swagger-api/apis/Project'

const JobDetail: React.FC = () => {
  const params = useParams()
  const { tenantId, projectId } = params
  const { jobName = '', clusterName = '', env = '', status, logStore } = useRecoilValue(selectedJob)
  const { startTime, endTime } = status || {}
  const [tenantName, setTenantName] = React.useState('')
  const [projectName, setProjectName] = React.useState('')

  const handleClickLogButton = () => {
    const dateTime = {
      start: startTime,
      end: endTime,
    }
    const url = generateLogUrl({ jobName, logStore, dateTime })
    if (url) {
      window.open(url)
    }
  }

  const handleClickMonitorButton = () => {
    const url = generateMonitorUrl({
      jobName,
      clusterName,
      tenantName,
      projectName,
    })
    window.open(url)
  }

  const getTenantName = React.useCallback(async () => {
    if (tenantId) {
      const { displayName, tenantCmdbName } = await tenantControllerGetTenant({ tenantId })
      setTenantName(tenantCmdbName || displayName)
    }
  }, [tenantId])

  const getProject = React.useCallback(async () => {
    if (tenantId && projectId) {
      const { displayName } = await projectControllerGetProject({
        tenantId,
        projectId,
      })
      setProjectName(displayName)
    }
  }, [tenantId, projectId])

  React.useEffect(() => {
    getTenantName()
    getProject()
  }, [])

  return (
    <DetailLayout
      title="Job:"
      resource={jobName}
      tags={[`Env: ${env}`, `Cluster: ${clusterName}`]}
      isHeaderWithBottomLine
      isHeaderWithBreadcrumbs
      body={
        <StyledRoot>
          <JobTabs />
          <br />
          <PodList clusterName={clusterName} />
        </StyledRoot>
      }
      breadcrumbs={<Breadcrumbs crumbName={CRUMB_TYPE.JOB} displayName={jobName} />}
      buttons={[
        {
          icon: <FileTextOutlined />,
          text: 'Log',
          onClick: handleClickLogButton,
        },
        {
          icon: <MonitorOutlined />,
          text: 'Mointor',
          onClick: handleClickMonitorButton,
        },
      ]}
    />
  )
}
export default JobDetail
