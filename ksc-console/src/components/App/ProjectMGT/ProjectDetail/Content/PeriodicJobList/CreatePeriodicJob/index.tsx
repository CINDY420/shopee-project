import { Space } from 'infrad'
import { LeftCircleOutlined } from 'infra-design-icons'
import DetailLayout from 'components/Common/DetailLayout'
import CreatePeriodicJobContent from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content'
import { StyledRoot } from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/style'
import { useNavigate, useParams } from 'react-router'
import useGeneratePath from 'hooks/useGeneratePath'
import { PROJECT } from 'constants/routes/route'

const CreatePeriodicJob = () => {
  const params = useParams()
  const { tenantId, projectId, periodicJobId } = params
  const navigate = useNavigate()
  const getPath = useGeneratePath()

  const handleBackToLastPage = () => {
    document.referrer
      ? navigate(-1)
      : navigate(`${getPath(PROJECT, { tenantId, projectId })}?selectedTab=periodicJob`)
  }
  return (
    <>
      <DetailLayout
        title={
          <Space>
            <LeftCircleOutlined onClick={handleBackToLastPage} />
            {periodicJobId ? 'Edit Periodic Job' : 'Create Periodic Job'}
          </Space>
        }
        body={
          <StyledRoot>
            <CreatePeriodicJobContent />
          </StyledRoot>
        }
        isHeaderWithBottomLine
        isHeaderWithBreadcrumbs={false}
      />
    </>
  )
}
export default CreatePeriodicJob
