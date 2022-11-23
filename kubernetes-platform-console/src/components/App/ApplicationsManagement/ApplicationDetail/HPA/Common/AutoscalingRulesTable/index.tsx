import React from 'react'
import { Table, TableColumnType } from 'infrad'
import {
  ContentWrapper,
  AutoscalingRulesWrapper,
  Title,
  TriggerLogicWrapper,
  TriggerLogicItem
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/AutoscalingRulesTable/style'
import { HorizontalDivider } from 'common-styles/divider'
import { IHpaAutoscalingRule } from 'swagger-api/v1/models'
import { RULE_METRICS } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/RulesItem/AutoscalingRulesItems'

const autoscalingRuleMetricTitleMap = {
  [RULE_METRICS.AVERAGE_CPU_USAGE]: 'Average CPU Usage',
  [RULE_METRICS.AVERAGE_MEM_USAGE]: 'Average MEM Usage',
  [RULE_METRICS.INSTANT_CPU_USAGE]: 'Instant CPU Usage',
  [RULE_METRICS.INSTANT_MEM_USAGE]: 'Instant MEM Usage'
}

interface IAutoscalingRulesTableProps {
  autoscalingRules: IHpaAutoscalingRule[]
  autoscalingLogic: 'or' | 'and'
}

const AutoscalingRulesTable: React.FC<IAutoscalingRulesTableProps> = ({ autoscalingRules = [], autoscalingLogic }) => {
  const AutoscalingRulesColumn: TableColumnType<IHpaAutoscalingRule>[] = [
    {
      title: 'Metrics',
      dataIndex: 'metrics',
      key: 'metrics',
      width: '200px',
      render: metrics => <span>{autoscalingRuleMetricTitleMap[metrics]}</span>
    },
    {
      title: 'Threshold',
      dataIndex: 'threshold',
      key: 'threshold',
      width: '180px',
      render: threshold => <span>{threshold}%</span>
    }
  ]

  return (
    <ContentWrapper>
      <AutoscalingRulesWrapper>
        <Title>AutoscalingRules</Title>
        <Table
          columns={AutoscalingRulesColumn}
          dataSource={autoscalingRules}
          bordered
          pagination={false}
          style={{ marginTop: '16px' }}
          rowKey='metrics'
        />
      </AutoscalingRulesWrapper>
      {autoscalingRules.length >= 2 && (
        <TriggerLogicWrapper>
          <TriggerLogicItem isSelected={false}>Logic</TriggerLogicItem>
          <HorizontalDivider size='16px' />
          <TriggerLogicItem isSelected={true} style={{ textTransform: 'capitalize' }}>
            {autoscalingLogic}
          </TriggerLogicItem>
        </TriggerLogicWrapper>
      )}
    </ContentWrapper>
  )
}

export default AutoscalingRulesTable
