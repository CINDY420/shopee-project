import React, { useState, useEffect } from 'react'
import { Select, InputNumber, Radio, Form, Checkbox, FormInstance } from 'infrad'

import InfoToolTip from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/InfoToolTip'
import {
  IndexWrapper,
  Logic,
  LogicTitle,
  MemUsageDescription
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/RulesItem/style'
import TableFormList from 'components/Common/TableFormList'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { ColumnsType } from 'infrad/lib/table'
import { IHpaAutoscalingRule } from 'swagger-api/v1/models'

const { Item } = Form

enum RULES_LOGIC {
  OR = 'or',
  AND = 'and'
}

export enum RULE_METRICS {
  AVERAGE_CPU_USAGE = 'averageCpu',
  AVERAGE_MEM_USAGE = 'averageMemory',
  INSTANT_CPU_USAGE = 'instantCpu',
  INSTANT_MEM_USAGE = 'instantMemory'
}

const metricsTextMap = {
  [RULE_METRICS.AVERAGE_CPU_USAGE]: 'Average CPU Usage',
  [RULE_METRICS.AVERAGE_MEM_USAGE]: 'Average MEM Usage',
  [RULE_METRICS.INSTANT_CPU_USAGE]: 'Instant CPU Usage',
  [RULE_METRICS.INSTANT_MEM_USAGE]: 'Instant MEM Usage'
}

const metricsInfoMap = {
  [RULE_METRICS.AVERAGE_CPU_USAGE]:
    'avg_over_time(container_cpu_usage_seconds_total{}/kube_pod_container_resource_requests{resource="cpu"}[2m:15s])',
  [RULE_METRICS.AVERAGE_MEM_USAGE]:
    'avg_over_time(container_memory_working_set_bytes/kube_pod_container_resource_requests{resource="memory"}[2m:15s])',
  [RULE_METRICS.INSTANT_CPU_USAGE]:
    'container_cpu_usage_seconds_total{}/kube_pod_container_resource_requests{resource="cpu"}',
  [RULE_METRICS.INSTANT_MEM_USAGE]:
    'container_memory_working_set_bytes/kube_pod_container_resource_requests{resource="memory"}'
}

// Infrad Form List and Item name
const AUTOSCALING_RULES_SELECTED_ITEM_NAME = 'autoscalingRulesSelected'
const AUTOSCALING_RULES_LIST_NAME = 'autoscalingRules'
const AUTOSCALING_LOGIC = 'autoscalingLogic'
enum AUTOSCALING_RULE_ITEM_NAME {
  METRICS = 'metrics',
  THRESHOLD = 'threshold'
}

interface IAutoscalingRulesItemsProps {
  form: FormInstance
  fatherNamePath: string[]
  autoscalingRules: IHpaAutoscalingRule[]
}
const AutoscalingRulesItems: React.FC<IAutoscalingRulesItemsProps> = ({ form, fatherNamePath, autoscalingRules }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [showLogic, setShowLogic] = useState(false)
  const [addNewVisible, setAddNewVisible] = useState(true)

  const handleValuesChange = (autoscalingRules: IHpaAutoscalingRule[]) => {
    const selectedMetrics = autoscalingRules?.filter(rule => !!rule?.metrics).map(({ metrics }) => metrics)
    selectedMetrics && setSelectedMetrics(selectedMetrics)
    setShowLogic(autoscalingRules?.length >= 2)
    autoscalingRules && setAddNewVisible(autoscalingRules.length < 4)
  }
  useEffect(() => {
    handleValuesChange(autoscalingRules)
  }, [autoscalingRules])

  const autoscalingRulesSelected = form.getFieldValue([...fatherNamePath, AUTOSCALING_RULES_SELECTED_ITEM_NAME])

  const columns: ColumnsType<FormListFieldData> = [
    {
      title: 'No.',
      key: 'index',
      render: (_, __, index) => {
        return <IndexWrapper>{index + 1}</IndexWrapper>
      }
    },
    {
      title: 'Metrics',
      key: 'metrics',
      width: 240,
      render: (_, { name, ...restField }) => {
        return (
          <Item
            {...restField}
            name={[name, AUTOSCALING_RULE_ITEM_NAME.METRICS]}
            rules={[{ required: true, message: 'Please enter Metrics!' }]}
          >
            <Select style={{ width: 240 }}>
              {Object.entries(metricsTextMap).map(([metric, text]) => (
                <Select.Option key={metric} value={metric} disabled={selectedMetrics.includes(metric)}>
                  {text}
                  <MemUsageDescription>{metricsInfoMap[metric]}</MemUsageDescription>
                </Select.Option>
              ))}
            </Select>
          </Item>
        )
      }
    },
    {
      title: 'Threshold',
      key: 'threshold',
      width: 128,
      render: (_, { name, ...restField }) => {
        return (
          <Item
            {...restField}
            name={[name, AUTOSCALING_RULE_ITEM_NAME.THRESHOLD]}
            rules={[
              {
                required: true,
                type: 'number',
                min: 0,
                max: 100,
                message: 'Please enter a positive number less than or equal to 100'
              },
              ({}) => ({
                validator(_, value) {
                  if (value === 0) {
                    return Promise.reject(new Error('Please enter a positive number less than or equal to 100'))
                  } else {
                    return Promise.resolve()
                  }
                }
              })
            ]}
          >
            <InputNumber style={{ width: 128 }} addonAfter='%' />
          </Item>
        )
      }
    }
  ]

  const handleBeforeAddNew = async () => {
    const autoscalingRules = form.getFieldValue([...fatherNamePath, AUTOSCALING_RULES_LIST_NAME])
    if (!autoscalingRules || autoscalingRules?.length <= 0) return
    const lastRuleIndex = autoscalingRules.length - 1
    const autoscalingRuleItemFormNames = Object.values(AUTOSCALING_RULE_ITEM_NAME).map(formItemName => [
      ...fatherNamePath,
      AUTOSCALING_RULES_LIST_NAME,
      lastRuleIndex,
      formItemName
    ])
    await form.validateFields(autoscalingRuleItemFormNames)
  }

  return (
    <>
      <Item name={[...fatherNamePath, AUTOSCALING_RULES_SELECTED_ITEM_NAME]} valuePropName='checked'>
        <Checkbox>
          <InfoToolTip
            title='Autoscaling Rules'
            info='Configure a HorizontalPodAutoscaler to scale based on a custom metric.'
            placement='topLeft'
          />
        </Checkbox>
      </Item>
      {autoscalingRulesSelected && (
        <Item>
          <TableFormList
            name={[...fatherNamePath, AUTOSCALING_RULES_LIST_NAME]}
            columns={columns}
            rules={[
              {
                validator: async (_, autoscalingRules) => {
                  if (!autoscalingRules || autoscalingRules.length < 1) {
                    return Promise.reject(new Error('At least 1 rule!'))
                  }
                }
              }
            ]}
            addNewColSpanKeys={[AUTOSCALING_RULE_ITEM_NAME.METRICS, AUTOSCALING_RULE_ITEM_NAME.THRESHOLD]}
            addNewVisible={addNewVisible}
            beforeAddNew={handleBeforeAddNew}
          />
          {showLogic && (
            <Logic>
              <Item>
                <LogicTitle>Logic</LogicTitle>
              </Item>
              <Item name={AUTOSCALING_LOGIC}>
                <Radio.Group>
                  {Object.values(RULES_LOGIC).map(value => (
                    <Radio
                      key={value}
                      value={value}
                      disabled={value === RULES_LOGIC.AND}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {value}
                    </Radio>
                  ))}
                </Radio.Group>
              </Item>
            </Logic>
          )}
        </Item>
      )}
    </>
  )
}

export default AutoscalingRulesItems
