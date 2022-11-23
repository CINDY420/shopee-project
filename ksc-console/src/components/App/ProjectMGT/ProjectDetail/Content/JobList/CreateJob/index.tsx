import { Space } from 'infrad'
import { LeftCircleOutlined } from 'infra-design-icons'
import DetailLayout from 'components/Common/DetailLayout'
import { useNavigate, useParams } from 'react-router'
import useGeneratePath from 'hooks/useGeneratePath'
import { PROJECT } from 'constants/routes/route'
import { StyledRoot } from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/style'
import CreateJobContent from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content'

const CreateJob = () => {
  const params = useParams()
  const { tenantId, projectId, jobId } = params
  const navigate = useNavigate()
  const getPath = useGeneratePath()

  const handleBackToLastPage = () => {
    document.referrer
      ? navigate(-1)
      : navigate(`${getPath(PROJECT, { tenantId, projectId })}?selectedTab=realtimeJob`)
  }
  return (
    <>
      <DetailLayout
        title={
          <Space>
            <LeftCircleOutlined onClick={handleBackToLastPage} />
            {jobId ? 'Edit Job' : 'Create Job'}
          </Space>
        }
        body={
          <StyledRoot>
            <CreateJobContent />
          </StyledRoot>
        }
        isHeaderWithBottomLine
        isHeaderWithBreadcrumbs={false}
      />
    </>
  )
}
export default CreateJob
