import React from 'react'
import {
  ContentWrapper,
  DeploymentWrapper,
  Header,
  DeploymentItem,
  HpaDetailWrapper,
  RulesWrapper,
  Title,
  ThresholdWrapper,
  ScaleDirectionWrapper,
  StatusWrapper,
  StyledSwitch
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/CopyRuleModal/Preview/style'
import {
  ScaleDirectionCard,
  SCALE_TYPE
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/ScaleDirectionCard'
import AutoscalingRulesTable from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/AutoscalingRulesTable'
import CronRulesTable from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/CronRulesTable'
import { VerticalDivider } from 'common-styles/divider'
import { IAzSdu, IHpaSpec, IHpaMeta, IDeploymentHpa } from 'swagger-api/v1/models'
import { Typography } from 'infrad'

const { Text } = Typography
interface IPreviewProps {
  selectedAzSdus: IAzSdu[]
  deploymentsHpas: IDeploymentHpa[]
}

const Preview: React.FC<IPreviewProps> = ({ selectedAzSdus, deploymentsHpas }) => {
  const [selectedDeployment, setSelectedDeployment] = React.useState<IHpaMeta>({
    az: selectedAzSdus[0]?.azName,
    sdu: selectedAzSdus[0]?.sdus[0]?.sduName
  })
  const [selectedDeploymentHpaSpec, setSelectedDeploymentHpaSpec] = React.useState<IHpaSpec>()

  const handleSelectDeployment = (az: string, sdu: string) => {
    setSelectedDeployment({ az, sdu })
  }

  const extractSelectedDeploymentHpaSpec = React.useCallback(
    (selectedDeployment: IHpaMeta): IHpaSpec => {
      const selectedDeploymentHpa = deploymentsHpas.find(item => {
        return item.meta.az === selectedDeployment.az && item.meta.sdu === selectedDeployment.sdu
      })
      return selectedDeploymentHpa.spec
    },
    [deploymentsHpas]
  )

  React.useEffect(() => {
    const deploymentHpaSpec = extractSelectedDeploymentHpaSpec(selectedDeployment)
    setSelectedDeploymentHpaSpec(deploymentHpaSpec)
  }, [extractSelectedDeploymentHpaSpec, selectedDeployment])

  return (
    <ContentWrapper>
      <DeploymentWrapper>
        <Header>Deployment</Header>
        {selectedAzSdus.map(azSdus => {
          const { azName, sdus } = azSdus
          return sdus.map(sdu => {
            const isSelectedDeployment = selectedDeployment.az === azName && selectedDeployment.sdu === sdu.sduName
            return (
              <DeploymentItem
                isSelectedDeployment={isSelectedDeployment}
                key={`${sdu.sduName}|${azName}`}
                onClick={() => handleSelectDeployment(azName, sdu.sduName)}
              >{`${sdu.sduName} | ${azName}`}</DeploymentItem>
            )
          })
        })}
      </DeploymentWrapper>
      <HpaDetailWrapper>
        <RulesWrapper>
          <Title>Rules</Title>
          <VerticalDivider size='24px' />
          <div style={{ marginLeft: '64px' }}>
            <AutoscalingRulesTable
              autoscalingRules={selectedDeploymentHpaSpec?.rules.autoscalingRules}
              autoscalingLogic={selectedDeploymentHpaSpec?.autoscalingLogic}
            />
          </div>
          <VerticalDivider size='24px' />
          <div style={{ marginLeft: '64px' }}>
            <CronRulesTable cronRules={selectedDeploymentHpaSpec?.rules.cronRules} style={{ width: '428px' }} />
          </div>
        </RulesWrapper>
        <ThresholdWrapper>
          <Title>Threshold</Title>
          <VerticalDivider size='24px' />
          <div style={{ marginLeft: '64px' }}>
            <Text type='secondary' style={{ marginRight: '12px' }}>
              Max Instance{' '}
            </Text>
            {selectedDeploymentHpaSpec?.threshold?.maxReplicaCount}
          </div>
          <VerticalDivider size='24px' />
          <div style={{ marginLeft: '64px' }}>
            <Text type='secondary' style={{ marginRight: '12px' }}>
              Min Instance{' '}
            </Text>
            {selectedDeploymentHpaSpec?.threshold?.minReplicaCount}
          </div>
        </ThresholdWrapper>
        <ScaleDirectionWrapper>
          <Title>Scale Direction</Title>
          <VerticalDivider size='24px' />
          <div style={{ marginLeft: '64px' }}>
            <ScaleDirectionCard
              type={SCALE_TYPE.SCALE_UP}
              scaleUpValues={selectedDeploymentHpaSpec?.scaleDirection?.scaleUp}
            />
          </div>
          <VerticalDivider size='24px' />
          <div style={{ marginLeft: '64px' }}>
            <ScaleDirectionCard
              type={SCALE_TYPE.SCALE_DOWN}
              scaleDownValues={selectedDeploymentHpaSpec?.scaleDirection?.scaleDown}
            />
          </div>
        </ScaleDirectionWrapper>
        <StatusWrapper>
          <Title>Status</Title>
          <StyledSwitch checked={selectedDeploymentHpaSpec?.status} />
        </StatusWrapper>
      </HpaDetailWrapper>
    </ContentWrapper>
  )
}
export default Preview
