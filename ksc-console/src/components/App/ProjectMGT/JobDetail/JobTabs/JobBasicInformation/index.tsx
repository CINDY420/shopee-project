import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDeepCompareEffect } from 'react-use'
import BasicInfo from './BasicInfo'
import TaskInfo from './TaskInfo'
import { useRecoilValue } from 'recoil'
import { selectedJob } from 'states'
import { useRemoteRecoil } from 'hooks/useRecoil'
import { IJobListItem } from 'swagger-api/models'
import { jobControllerGetJob } from 'swagger-api/apis/Job'
import { StyledContainer, StyledTitle } from './style'

interface IJobBasicInformationProps {
  params?: IJobListItem
}

const JobBasicInformation = ({ params }: IJobBasicInformationProps) => {
  const { tenantId, projectId } = useParams()
  const { jobId } = params ?? {}
  const [, selectJobFn] = useRemoteRecoil(jobControllerGetJob, selectedJob)
  const jobDetails = useRecoilValue(selectedJob)

  const getJobDetails = useCallback(async () => {
    if (tenantId && projectId && jobId)
      await selectJobFn({
        tenantId,
        projectId,
        jobId,
      })
  }, [selectJobFn, tenantId, projectId, jobId])

  useDeepCompareEffect(() => {
    if (params?.jobId) getJobDetails()
  }, [params])

  return (
    <StyledContainer>
      <div>
        <StyledTitle>Basic Information</StyledTitle>
        <BasicInfo jobDetails={jobDetails} />
      </div>
      <div>
        <StyledTitle>Task Information</StyledTitle>
        <TaskInfo jobDetails={jobDetails} />
      </div>
    </StyledContainer>
  )
}

export default JobBasicInformation
