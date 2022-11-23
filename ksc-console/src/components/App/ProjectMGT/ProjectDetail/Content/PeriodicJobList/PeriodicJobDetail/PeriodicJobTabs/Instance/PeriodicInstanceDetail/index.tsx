import DetailLayout from 'components/Common/DetailLayout'
import Breadcrumbs, { CRUMB_TYPE } from 'components/App/ProjectMGT/Common/BreadCrumb'
import { StyledRoot } from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/style'
import InstanceOverview from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/PeriodicJobTabs/Instance/PeriodicInstanceDetail/Overview'
import PodList from 'components/App/ProjectMGT/JobDetail/PodList'
import { useRecoilValue } from 'recoil'
import { selectedPeriodicJobInstance } from 'states'

const PeriodicInstanceDetail = () => {
  const { jobName = '', clusterName = '', env = '' } = useRecoilValue(selectedPeriodicJobInstance)
  return (
    <DetailLayout
      title="Instance:"
      resource={jobName}
      tags={[`Env: ${env}`, `Cluster: ${clusterName}`]}
      isHeaderWithBottomLine
      isHeaderWithBreadcrumbs
      body={
        <StyledRoot>
          <InstanceOverview />
          <br />
          <PodList clusterName={clusterName} />
        </StyledRoot>
      }
      breadcrumbs={<Breadcrumbs crumbName={CRUMB_TYPE.INSTANCE} displayName={jobName} />}
    />
  )
}
export default PeriodicInstanceDetail
