import { StyledRoot } from 'components/App/ClusterManagement/ClusterDetail/Head/Overview/Usage/style'
import QuotaCard from 'components/Common/QuotaCard'
import { USAGE_TYPES } from 'constants/tenantDetail'
import { IGetProjectMetricsResponse } from 'swagger-api/models'

interface IUsageProps {
  metrics?: IGetProjectMetricsResponse
  isLoading: boolean
}
const Usage: React.FC<IUsageProps> = ({ metrics, isLoading }) => (
  <StyledRoot>
    {USAGE_TYPES.map((usageType) => (
      <QuotaCard
        key={usageType.title}
        metrics={metrics}
        usageType={usageType}
        isLoading={isLoading}
        isShowTotal
      />
    ))}
  </StyledRoot>
)

export default Usage
