import React from 'react'
import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Tooltip
} from 'infrad'
import { CheckboxChangeEvent } from 'infrad/lib/checkbox'
import {
  StyledTitle,
  StyledForm,
  StyledTable,
  StyledDescriptions
} from 'components/App/ResourceManagement/common/BatchOperation/BatchEdit/style'
import { IQuestionMark } from 'infra-design-icons'
import { ColumnsType } from 'infrad/lib/table'
import { Rule } from 'infrad/lib/form'
import { GetRowKey } from 'infrad/lib/table/interface'

export enum CONTROL_TYPE {
  INPUT_NUMBER = 'InputNumber',
  INPUT = 'Input',
  SELECT = 'Select'
}

enum EDIT_STEPS {
  FORM_FILL = 'FormFill',
  DOUBLE_CONFIRM = 'DoubleConfirm'
}

export interface IFormItemData {
  name: string
  label: string
  controlType?: CONTROL_TYPE
  options?: (string | number)[]
  tooltip?: string
  defaultValue?: string | number
  component?: React.ReactElement
  visible?: boolean
  rules?: Rule[]
}

interface IBatchOperationProps<DataType = any> {
  selectedTableRows: DataType[]
  columns: ColumnsType<DataType>
  rowKey: string | GetRowKey<DataType>
  modalVisible: boolean
  onVisibleChange: (visible: boolean) => void
  formItemDataList: IFormItemData[]
  onSubmit: (...argument: unknown[]) => void
  cancelBatchOperation: () => void
}

const BatchEdit: React.FC<IBatchOperationProps> = ({
  selectedTableRows,
  columns,
  rowKey,
  modalVisible,
  onVisibleChange,
  formItemDataList,
  onSubmit,
  cancelBatchOperation
}) => {
  const [form] = Form.useForm()
  const [editStep, setEditStep] = React.useState<EDIT_STEPS>(EDIT_STEPS.FORM_FILL)
  const [checkedValues, setCheckedValues] = React.useState<string[]>([])
  const [availableFormData, setAvailableFormData] = React.useState<Record<string, string>>()
  const checkboxOptions = formItemDataList?.filter(item => item.visible !== false).map(item => item?.name)

  const { checkAll, indeterminate } = React.useMemo(() => {
    if (!checkedValues || !checkboxOptions) {
      return {
        checkAll: false,
        indeterminate: false
      }
    }

    return {
      checkAll: checkedValues.length === checkboxOptions.length,
      indeterminate: !!checkedValues.length && checkedValues.length < checkboxOptions.length
    }
  }, [checkedValues, checkboxOptions])

  const handleCheckboxGroupChange = (checkedValues: string[]) => {
    setCheckedValues(checkedValues)
  }

  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    const selected = e.target.checked ? checkboxOptions : []
    setCheckedValues(selected)
  }

  const handleNext = async () => {
    const formData = await form.validateFields()
    const availableFormData = Object.entries(formData)
      .filter(([key]) => checkedValues.includes(key))
      .reduce((res, [key, value]) => Object.assign(res, { [key]: value }), {})
    setAvailableFormData(availableFormData)
    setEditStep(EDIT_STEPS.DOUBLE_CONFIRM)
  }

  const handleCancel = () => {
    onVisibleChange(false)
    form.resetFields()
    setCheckedValues([])
    setEditStep(EDIT_STEPS.FORM_FILL)
  }

  const handleConfirm = () => {
    onSubmit(availableFormData, () => {
      handleCancel()
      cancelBatchOperation()
    })
  }

  const displayFormItemControl = (formItemData: IFormItemData) => {
    const { controlType, options } = formItemData

    switch (controlType) {
      case CONTROL_TYPE.INPUT:
        return <Input placeholder='Input' />
      case CONTROL_TYPE.SELECT:
        return (
          <Select>
            {options?.map(option => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        )
      case CONTROL_TYPE.INPUT_NUMBER:
      default:
        return <InputNumber placeholder='Input' controls={false} style={{ width: '100%' }} />
    }
  }

  const displayFormFill = () => (
    <>
      <StyledTitle>Affected items</StyledTitle>
      <StyledForm
        form={form}
        labelWrap={true}
        labelAlign='left'
        labelCol={{ flex: '0 0 205px' }}
        wrapperCol={{ flex: '0 0 140px' }}
        requiredMark={false}
      >
        <Checkbox.Group style={{ width: '100%' }} onChange={handleCheckboxGroupChange} value={checkedValues}>
          <Row gutter={12} justify='space-between'>
            {formItemDataList?.map(item => {
              const { name, label, tooltip, defaultValue, component, visible = true, rules = [] } = item
              const required = checkedValues.includes(name)

              return visible ? (
                <Col key={name} span={12}>
                  <Checkbox value={name} />
                  {component || (
                    <Form.Item
                      name={name}
                      label={label}
                      tooltip={tooltip}
                      initialValue={defaultValue}
                      rules={rules.concat([{ required: required, message: 'Required!' }])}
                    >
                      {displayFormItemControl(item)}
                    </Form.Item>
                  )}
                </Col>
              ) : null
            })}
          </Row>
        </Checkbox.Group>
        <Divider style={{ margin: '0 0 12px 0' }} />
        <Checkbox checked={checkAll} indeterminate={indeterminate} onChange={handleCheckAllChange}>
          Select all
        </Checkbox>
      </StyledForm>
    </>
  )

  const displayDoubleConfirm = () => {
    const checkedList = formItemDataList?.filter(item => checkedValues.includes(item.name))

    return (
      <>
        <StyledTitle>Affected SDUs</StyledTitle>
        <StyledTable
          columns={columns}
          dataSource={selectedTableRows}
          pagination={false}
          scroll={{ y: 332 }}
          rowKey={rowKey}
        />
        <StyledDescriptions title='Operation detail' column={1} style={{ marginTop: '24px' }}>
          {checkedList.map(item => (
            <Descriptions.Item
              key={item.name}
              label={
                <Tooltip title={item.tooltip}>
                  {item.label}
                  {item.tooltip && <IQuestionMark style={{ color: '#999999', marginLeft: '6px' }} />}
                </Tooltip>
              }
            >
              {availableFormData[item.name]}
            </Descriptions.Item>
          ))}
        </StyledDescriptions>
      </>
    )
  }

  const modalContentMapping = {
    [EDIT_STEPS.FORM_FILL]: () => displayFormFill(),
    [EDIT_STEPS.DOUBLE_CONFIRM]: () => displayDoubleConfirm()
  }

  const formFillModalButtons = [
    <Button key='cancel' onClick={handleCancel}>
      Cancel
    </Button>,
    <Button key='next' type='primary' onClick={handleNext} disabled={checkedValues.length === 0}>
      Next
    </Button>
  ]

  const doubleCheckModalButtons = [
    <Button key='return' onClick={() => setEditStep(EDIT_STEPS.FORM_FILL)}>
      Return
    </Button>,
    <Button key='cancel' onClick={handleCancel}>
      Cancel
    </Button>,
    <Button key='confirm' type='primary' onClick={handleConfirm}>
      Confirm
    </Button>
  ]

  const modalFooterButtonsMapping = {
    [EDIT_STEPS.FORM_FILL]: formFillModalButtons,
    [EDIT_STEPS.DOUBLE_CONFIRM]: doubleCheckModalButtons
  }

  return (
    <Modal
      title='Batch Edit'
      visible={modalVisible}
      getContainer={() => document.body}
      width={940}
      footer={modalFooterButtonsMapping[editStep]}
      onCancel={handleCancel}
    >
      {modalContentMapping[editStep]()}
    </Modal>
  )
}

export default BatchEdit
