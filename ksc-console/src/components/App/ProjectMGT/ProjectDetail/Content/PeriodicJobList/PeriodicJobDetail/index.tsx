import DetailLayout from 'components/Common/DetailLayout'
import Breadcrumbs, { CRUMB_TYPE } from 'components/App/ProjectMGT/Common/BreadCrumb'
import { StyledRoot } from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/style'
import PeriodicJobTabs from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/PeriodicJobTabs'
import { useRecoilValue } from 'recoil'
import { selectedPeriodicJob } from 'states'

const PeriodicJobDetail = () => {
  const { jobTemplate, periodicJobName } = useRecoilValue(selectedPeriodicJob)
  const { env } = jobTemplate || {}
  return (
    <DetailLayout
      title="Job:"
      resource={periodicJobName}
      tags={[`Env: ${env}`]}
      isHeaderWithBottomLine
      isHeaderWithBreadcrumbs
      body={
        <StyledRoot>
          <PeriodicJobTabs />
        </StyledRoot>
      }
      breadcrumbs={
        <Breadcrumbs crumbName={CRUMB_TYPE.PERIODIC_JOB} displayName={periodicJobName} />
      }
    />
  )
}
export default PeriodicJobDetail
