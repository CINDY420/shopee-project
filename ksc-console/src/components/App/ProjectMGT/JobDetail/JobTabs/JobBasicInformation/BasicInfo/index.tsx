import InformationCommonList from 'components/Common/InformationCommonList'
import { IGetJobResponse } from 'swagger-api/models'

interface IBasicInfoProps {
  jobDetails: IGetJobResponse | Record<string, unknown>
}

function isJobResponse(item: IGetJobResponse | Record<string, unknown>): item is IGetJobResponse {
  return 'tasks' in item
}

const INFO_CONFIG_LIST = [
  {
    name: 'Job Name',
    key: 'jobName',
  },
  {
    name: 'Job ID',
    key: 'jobId',
  },
  {
    name: 'Creator',
    key: 'creator',
  },
  {
    name: 'Type',
    key: 'jobType',
  },
  {
    name: 'Priority',
    key: 'priority',
  },
  {
    name: 'Volume',
    key: 'shareDir',
  },
]
const BasicInfo = ({ jobDetails }: IBasicInfoProps) => {
  const data = isJobResponse(jobDetails) ? jobDetails : {}
  return <InformationCommonList nameMaps={INFO_CONFIG_LIST} data={data} />
}

export default BasicInfo
