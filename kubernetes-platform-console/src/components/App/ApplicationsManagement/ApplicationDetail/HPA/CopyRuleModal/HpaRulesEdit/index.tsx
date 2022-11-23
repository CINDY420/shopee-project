import React from 'react'
import { FormInstance } from 'infrad/lib/form'
import {
  Wrapper,
  DeploymentWrapper,
  Header,
  DeploymentItem,
  HpaDetailWrapper,
  RulesWrapper,
  Title,
  AutoscalingRulesWrapper,
  CronRulesWrapper,
  StyledDivider,
  ThresholdWrapper,
  ScaleDirectionWrapper,
  StatusWrapper,
  StyledSwitch
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/CopyRuleModal/HpaRulesEdit/style'
import AutoscalingRulesItems from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/RulesItem/AutoscalingRulesItems'
import CronRulesItems from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/RulesItem/CronRulesItems'
import ScaleDirectionItem from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/ScaleDirectionItem'
import { IAzSdu, IHpaMeta, IDeploymentHpa } from 'swagger-api/v1/models'
import { ICopyRuleFormValues } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/CopyRuleModal'
import { formatCronRulesToForm } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/helper/cronRules'
import Threshold from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/Threshold'

import { Form, FormProps } from 'infrad'
interface IHpaRulesEditProps {
  form: FormInstance
  selectedAzSdus: IAzSdu[]
  deploymentsHpas: IDeploymentHpa[]
  onDeploymentHpaRulesChange: (azSdu: IHpaMeta) => void
  getCurrentEditSelectedDeployment: (azSdu: IHpaMeta) => void
}

const formatCurrentSelectedDeploymentHpaToFormValues = (
  deploymentsHpas: IDeploymentHpa[],
  selectedDeployment: IHpaMeta
): ICopyRuleFormValues => {
  const selectedDeploymentHpaRule = deploymentsHpas.find(item => {
    return item.meta.az === selectedDeployment.az && item.meta.sdu === selectedDeployment.sdu
  })
  const { spec } = selectedDeploymentHpaRule || {}
  const { notifyChannels, rules, scaleDirection, autoscalingLogic, threshold, status } = spec || {}
  const { autoscalingRules, cronRules = [] } = rules || {}
  const formCronRules = formatCronRulesToForm(cronRules)

  const deploymentFormValues: ICopyRuleFormValues = {
    notifyChannels,
    rules: {
      autoscalingRulesSelected: !!autoscalingRules,
      cronRulesSelected: !!cronRules,
      autoscalingRules,
      cronRules: formCronRules
    },
    scaleDirection,
    autoscalingLogic,
    threshold,
    status
  }
  return deploymentFormValues
}

const HpaRulesEdit: React.FC<IHpaRulesEditProps> = ({
  form,
  selectedAzSdus,
  deploymentsHpas,
  onDeploymentHpaRulesChange: handleDeploymentHpaRulesChange,
  getCurrentEditSelectedDeployment
}) => {
  const [selectedDeployment, setSelectedDeployment] = React.useState<IHpaMeta>({
    az: selectedAzSdus[0]?.azName,
    sdu: selectedAzSdus[0]?.sdus[0]?.sduName
  })

  const [selectedDeploymentFormValues, setSelectedDeploymentFormValues] = React.useState<ICopyRuleFormValues>(
    formatCurrentSelectedDeploymentHpaToFormValues(deploymentsHpas, {
      az: selectedAzSdus[0]?.azName,
      sdu: selectedAzSdus[0]?.sdus[0]?.sduName
    })
  )

  const handleDeploymentChange = (az: string, sdu: string) => {
    handleDeploymentHpaRulesChange(selectedDeployment)
    setSelectedDeployment({ az, sdu })
  }

  React.useEffect(() => {
    getCurrentEditSelectedDeployment(selectedDeployment)
  }, [getCurrentEditSelectedDeployment, selectedDeployment])

  React.useEffect(() => {
    const deploymentFormValues = formatCurrentSelectedDeploymentHpaToFormValues(deploymentsHpas, selectedDeployment)
    form.setFieldsValue(deploymentFormValues)
    setSelectedDeploymentFormValues(deploymentFormValues)
  }, [form, deploymentsHpas, selectedDeployment])

  const handleValuesChange: FormProps['onValuesChange'] = (_, values) => {
    setSelectedDeploymentFormValues(values)
  }

  return (
    <Form form={form} name='hpaRule' initialValues={selectedDeploymentFormValues} onValuesChange={handleValuesChange}>
      <Wrapper>
        <DeploymentWrapper>
          <Header>Deployment</Header>
          {selectedAzSdus.map(azSdus => {
            const azName = azSdus.azName
            return azSdus.sdus.map(sdu => {
              const isSelectedDeployment = selectedDeployment.az === azName && selectedDeployment.sdu === sdu.sduName
              return (
                <DeploymentItem
                  isSelectedDeployment={isSelectedDeployment}
                  key={`${sdu.sduName}|${azName}`}
                  onClick={() => handleDeploymentChange(azName, sdu.sduName)}
                >{`${sdu.sduName} | ${azName}`}</DeploymentItem>
              )
            })
          })}
        </DeploymentWrapper>
        <HpaDetailWrapper>
          <RulesWrapper>
            <Title>Rules</Title>
            <AutoscalingRulesWrapper>
              <AutoscalingRulesItems
                form={form}
                autoscalingRules={selectedDeploymentFormValues?.rules?.autoscalingRules}
                fatherNamePath={['rules']}
              />
            </AutoscalingRulesWrapper>
            <CronRulesWrapper>
              <CronRulesItems
                form={form}
                cronRules={selectedDeploymentFormValues?.rules?.cronRules}
                fatherNamePath={['rules']}
              />
            </CronRulesWrapper>
          </RulesWrapper>
          <StyledDivider />
          <ThresholdWrapper>
            <Title>Threshold</Title>
            <Threshold
              form={form}
              fatherNamePath={['threshold']}
              style={{ margin: '24px 0px 0px 64px', width: '480px' }}
            />
          </ThresholdWrapper>
          <ScaleDirectionWrapper>
            <Title>Scale Direction</Title>
            <ScaleDirectionItem
              form={form}
              style={{ margin: '24px 0px 0px 64px', width: '480px' }}
              fatherNamePath={['scaleDirection']}
              triggerRules={selectedDeploymentFormValues?.scaleDirection}
            />
          </ScaleDirectionWrapper>
          <StatusWrapper>
            <Title style={{ marginLeft: 0 }}>Status</Title>
            <Form.Item name='status' valuePropName='checked'>
              <StyledSwitch />
            </Form.Item>
          </StatusWrapper>
        </HpaDetailWrapper>
      </Wrapper>
    </Form>
  )
}
export default HpaRulesEdit
