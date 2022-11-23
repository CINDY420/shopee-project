import { RESOURCE_MANAGEMENT_TYPE } from 'components/App/ResourceManagement'
import {
  EVALUATION_METRICS_TYPE,
  GPU_RELATED_ITEM_LABELS
} from 'components/App/ResourceManagement/common/ResourceTable/columnGroups'
import { FormItemType, IGroupFormItem } from 'components/App/ResourceManagement/common/ResourceTableExpand'
import {
  StyledFormItem,
  StyledInput,
  StyledInputNumber,
  StyledSelect,
  StyledTitle
} from 'components/App/ResourceManagement/common/ResourceTableExpand/ExpandGroupForm/style'
import { Col, Row, Form, FormInstance, InputRef } from 'infrad'
import * as React from 'react'
interface IOptionProps {
  key: string
  label: string
  value: string | number
}
interface IExpandGroupFormProps {
  resourceType: RESOURCE_MANAGEMENT_TYPE
  form: FormInstance
  title: string
  items: IGroupFormItem[]
  dataSource: Record<string, string | number>
  isEditing: boolean
  height?: string
  flexValue?: string
}

const ExpandGroupForm: React.FC<IExpandGroupFormProps> = ({
  resourceType,
  title,
  items,
  dataSource,
  isEditing,
  height,
  form,
  flexValue
}) => {
  const estimatedInstanceCountRef = React.useRef<InputRef>(null)
  const getIncrementalCalculatedFormItem = (props: IGroupFormItem) => {
    const { label, name, dependency, colon = false, ...restProps } = props
    if (name === 'estimatedInsCountTotal') {
      return (
        <Form.Item key={name} noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const evaluationMetrics = getFieldValue('evaluationMetrics')
            const minInsCount = getFieldValue('minInsCount')

            const estimatedCpuIncrementTotal = getFieldValue('estimatedCpuIncrementTotal')
            const cpuLimitOneInsPeak = getFieldValue('cpuLimitOneInsPeak')

            const estimatedMemIncrementTotal = getFieldValue('estimatedMemIncrementTotal')
            const memLimitOneInsPeak = getFieldValue('memLimitOneInsPeak')

            const estimatedQpsTotal = getFieldValue('estimatedQpsTotal')
            const qpsMaxOneIns = getFieldValue('qpsMaxOneIns')

            let estimatedInstanceCount
            switch (evaluationMetrics) {
              case EVALUATION_METRICS_TYPE.CPU:
                estimatedInstanceCount = Math.max(
                  minInsCount,
                  Math.ceil(estimatedCpuIncrementTotal / cpuLimitOneInsPeak) || -Infinity
                )
                break
              case EVALUATION_METRICS_TYPE.MEM:
                estimatedInstanceCount = Math.max(
                  minInsCount,
                  Math.ceil(estimatedMemIncrementTotal / memLimitOneInsPeak) || -Infinity
                )
                break
              case EVALUATION_METRICS_TYPE.QPS:
                estimatedInstanceCount = Math.max(minInsCount, Math.ceil(estimatedQpsTotal / qpsMaxOneIns) || -Infinity)
                break
              default:
                break
            }
            return (
              <StyledFormItem label={<div>{label}:</div>} {...restProps} colon={colon}>
                <StyledInput ref={estimatedInstanceCountRef} disabled={true} value={estimatedInstanceCount} />
              </StyledFormItem>
            )
          }}
        </Form.Item>
      )
    } else {
      return (
        <Form.Item noStyle key={name} shouldUpdate hidden={GPU_RELATED_ITEM_LABELS.includes(label)}>
          {({ getFieldValue }) => {
            const formValue = getFieldValue(dependency)
            const estimatedValue = formValue * Number(estimatedInstanceCountRef?.current?.input?.value) || undefined
            return (
              <StyledFormItem label={<div>{label}:</div>} colon={colon} {...restProps}>
                <StyledInput disabled={true} value={estimatedValue?.toFixed(2)} />
              </StyledFormItem>
            )
          }}
        </Form.Item>
      )
    }
  }

  const getStockCalculatedFormItem = (props: IGroupFormItem) => {
    const { label, name, dependency, colon = false, ...restProps } = props
    if (name === 'estimatedInsCountTotal') {
      return (
        <Form.Item key={name} noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const inUse = getFieldValue('inUse')
            const evaluationMetrics = getFieldValue('evaluationMetrics')
            const minInsCount = getFieldValue('minInsCount')

            const cpuLimitOneInsPeak = getFieldValue('cpuLimitOneInsPeak')
            const memLimitOneInsPeak = getFieldValue('memLimitOneInsPeak')
            const qpsMaxOneIns = getFieldValue('qpsMaxOneIns')

            const cpuUsedTotalPeak = getFieldValue('cpuUsedTotalPeak')
            const growthRatio = getFieldValue('growthRatio')
            const safetyThreshold = parseFloat(getFieldValue('safetyThreshold')) / 100

            const memUsedTotalPeak = getFieldValue('memUsedTotalPeak')

            const qpsTotalPeak = getFieldValue('qpsTotalPeak')

            let estimatedInstanceCount: number
            switch (evaluationMetrics) {
              case EVALUATION_METRICS_TYPE.CPU:
                estimatedInstanceCount =
                  inUse *
                  Math.max(
                    minInsCount,
                    Math.ceil((cpuUsedTotalPeak * growthRatio) / safetyThreshold / cpuLimitOneInsPeak) || -Infinity
                  )
                break
              case EVALUATION_METRICS_TYPE.MEM:
                estimatedInstanceCount =
                  inUse *
                  Math.max(
                    minInsCount,
                    Math.ceil((memUsedTotalPeak * growthRatio) / safetyThreshold / memLimitOneInsPeak) || -Infinity
                  )
                break
              case EVALUATION_METRICS_TYPE.QPS:
                estimatedInstanceCount =
                  inUse * Math.max(minInsCount, Math.ceil((qpsTotalPeak * growthRatio) / qpsMaxOneIns) || -Infinity)
                break
              default:
                break
            }

            return (
              <StyledFormItem label={<div>{label}:</div>} colon={colon} {...restProps}>
                <StyledInput ref={estimatedInstanceCountRef} disabled={true} value={estimatedInstanceCount} />
              </StyledFormItem>
            )
          }}
        </Form.Item>
      )
    } else {
      return (
        <Form.Item noStyle key={name} shouldUpdate hidden={GPU_RELATED_ITEM_LABELS.includes(label)}>
          {({ getFieldValue }) => {
            const insCountPeak = getFieldValue('insCountPeak')
            const gpuCardLimitOneInsPeak = getFieldValue('gpuCardLimitOneInsPeak')
            const dependencyValue = getFieldValue(dependency)
            let allocatedResource: number
            switch (name) {
              case 'estimatedCpuIncrement':
                allocatedResource = getFieldValue('cpuAllocatedTotalPeak')
                break
              case 'estimatedMemIncrement':
                allocatedResource = getFieldValue('memAllocatedTotalPeak')
                break
              case 'estimatedGpuCardIncrement':
                allocatedResource = gpuCardLimitOneInsPeak * insCountPeak
                break
              default:
                break
            }
            let estimatedValue: number
            switch (name) {
              case 'estimatedInsCountIncrement':
                estimatedValue = Number(estimatedInstanceCountRef?.current?.input?.value) - insCountPeak
                break
              case 'gpuCardAllocatedTotalPeak':
                estimatedValue = gpuCardLimitOneInsPeak * insCountPeak
                break
              default:
                estimatedValue =
                  dependencyValue * Number(estimatedInstanceCountRef?.current?.input?.value) - allocatedResource
                break
            }
            return (
              <StyledFormItem label={<div>{label}:</div>} colon={colon} {...restProps}>
                <StyledInput disabled={true} value={estimatedValue?.toFixed(2)} />
              </StyledFormItem>
            )
          }}
        </Form.Item>
      )
    }
  }
  const getConditionalFormItem = (props: IGroupFormItem) => {
    const { name, label, rules, conditions, colon = false, ...restProps } = props
    return (
      <Form.Item
        key={name}
        noStyle
        shouldUpdate={(prevValues, curValues) => prevValues.evaluationMetrics !== curValues.evaluationMetrics}
        hidden={GPU_RELATED_ITEM_LABELS.includes(label)}
      >
        {({ getFieldValue }) => {
          const evaluationMetrics = getFieldValue('evaluationMetrics')
          const isEnable = conditions?.includes(evaluationMetrics)
          return (
            <StyledFormItem
              label={<div>{label}:</div>}
              name={name}
              {...restProps}
              colon={colon}
              rules={isEnable ? rules : null}
            >
              <StyledInputNumber disabled={!isEnable} controls={false} />
            </StyledFormItem>
          )
        }}
      </Form.Item>
    )
  }

  const getInputComponent = (type: FormItemType, isItemEditing: boolean, options: IOptionProps[]) => {
    if (type === FormItemType.SELECT) {
      return <StyledSelect disabled={!isItemEditing} options={options} />
    } else if (type === FormItemType.INPUT_NUMBER) {
      return <StyledInputNumber disabled={!isItemEditing} controls={false} />
    }
    return <StyledInput disabled={!isItemEditing} />
  }

  React.useEffect(() => {
    form.setFieldsValue(dataSource)
  }, [dataSource, form, isEditing])

  return (
    <Row>
      <StyledTitle span={24}>{title}</StyledTitle>
      <Col span={24}>
        <Form
          form={form}
          name={title}
          size='small'
          labelWrap
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            height: height || 'unset',
            gap: '0 160px'
          }}
          requiredMark={false}
        >
          {items.map(item => {
            const {
              options = [],
              type = FormItemType.INPUT,
              editable = false,
              visible = true,
              component = undefined,
              ...restProps
            } = item

            const isItemEditing = editable && isEditing
            const formItemLayout = {
              labelCol: { style: { flex: '1 1 0', width: '210px' } },
              wrapperCol: {
                style: {
                  flex: flexValue ? (isItemEditing ? flexValue : '0 0 140px') : 'unset',
                  width: isItemEditing ? '100px' : '30px'
                }
              }
            }
            const itemProps = {
              label: <div>{restProps.label}:</div>,
              key: restProps.name,
              ...formItemLayout,
              ...restProps
            }
            if (!visible) return null
            if (!isEditing) {
              return (
                <StyledFormItem
                  {...itemProps}
                  labelAlign='left'
                  hidden={GPU_RELATED_ITEM_LABELS.includes(restProps.label)}
                >
                  <StyledInput disabled={!isItemEditing} />
                </StyledFormItem>
              )
            }
            if (component) {
              return (
                <StyledFormItem
                  {...itemProps}
                  labelAlign='left'
                  hidden={GPU_RELATED_ITEM_LABELS.includes(restProps.label)}
                >
                  {component({ isItemEditing })}
                </StyledFormItem>
              )
            }
            switch (type) {
              case FormItemType.CALCULATED:
                return resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL
                  ? getIncrementalCalculatedFormItem({ labelAlign: 'left', ...formItemLayout, ...restProps })
                  : getStockCalculatedFormItem({ labelAlign: 'left', ...formItemLayout, ...restProps })
              case FormItemType.CONDITIONAL_EVALUATION_METRICS_RENDER:
                return getConditionalFormItem({ labelAlign: 'left', ...formItemLayout, ...restProps })
              default:
                return (
                  <StyledFormItem
                    labelAlign='left'
                    {...itemProps}
                    hidden={GPU_RELATED_ITEM_LABELS.includes(restProps?.label)}
                  >
                    {getInputComponent(type, isItemEditing, options)}
                  </StyledFormItem>
                )
            }
          })}
        </Form>
      </Col>
    </Row>
  )
}

export default ExpandGroupForm
