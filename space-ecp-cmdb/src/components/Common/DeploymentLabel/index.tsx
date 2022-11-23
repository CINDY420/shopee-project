import * as React from 'react'
import { IModels } from 'src/rapper/request'
import { StyledDescriptions, StyledExtraContent } from 'src/components/Common/DeploymentLabel/style'
import { Descriptions } from 'infrad'

type Deployment =
  IModels['GET/api/ecp-cmdb/services/{serviceName}/sdus']['Res']['items'][0]['deployments'][0]
interface IDeploymentLabelProps {
  deployment: Deployment
  style?: React.CSSProperties
  extraContent?: Record<string, string[]>
}

const EMPTY_PLACEHOLDER = '-'

const DeploymentLabel: React.FC<IDeploymentLabelProps> = ({ deployment, style, extraContent }) => {
  const {
    azV1,
    cluster,
    componentType,
    status: { orchestrator },
  } = deployment

  return (
    <StyledDescriptions column={1} style={style}>
      <Descriptions.Item label="AZ">{azV1 || EMPTY_PLACEHOLDER}</Descriptions.Item>
      <Descriptions.Item label="Workload">{componentType || EMPTY_PLACEHOLDER}</Descriptions.Item>
      <Descriptions.Item label="Cluster">{cluster || EMPTY_PLACEHOLDER}</Descriptions.Item>
      <Descriptions.Item label="Orchestrator">
        {orchestrator || EMPTY_PLACEHOLDER}
      </Descriptions.Item>
      {extraContent &&
        Object.entries(extraContent).map(([key, value]) => (
          <Descriptions.Item key={key} label={key}>
            <StyledExtraContent>
              {value.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </StyledExtraContent>
          </Descriptions.Item>
        ))}
    </StyledDescriptions>
  )
}

export default DeploymentLabel
