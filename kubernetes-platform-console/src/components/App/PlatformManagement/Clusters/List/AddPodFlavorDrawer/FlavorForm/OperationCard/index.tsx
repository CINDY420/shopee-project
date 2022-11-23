import React, { useState, useContext } from 'react'
import { Form, Select, Button, Card, InputNumber, Divider } from 'infrad'
import Icon, { PlusOutlined } from 'infra-design-icons'
import deleteSvg from 'assets/delete.antd.svg?component'

import { FormContext, IFormContext } from 'components/App/PlatformManagement/Clusters/List/AddPodFlavorDrawer/context'

import { TableWrapper, StyledTable, StyledTHead, StyledTr, StyledFormItem, ErrorInfo, StyledSelect } from './style'
import { FormInstance } from 'infrad/lib/form/hooks/useForm'

interface IOperationCard {
  clusterList: string[]
  form: FormInstance
  index: number
  fieldKey?: number // infrad@4.18.5 no need
  disableDelete: boolean
  fatherFieldName: number
  onDelete: () => void
}
type FormListAddFn = (initialValue?: any) => void

const OperationCard: React.FC<IOperationCard> = ({
  clusterList,
  form,
  index,
  fieldKey,
  disableDelete,
  fatherFieldName,
  onDelete
}) => {
  const Title = (
    <div>
      <span>Operation {index + 1}</span>
      {!disableDelete && <Icon style={{ float: 'right' }} component={deleteSvg} onClick={onDelete} />}
    </div>
  )

  const [hasSameFlavor, setSameFlavor] = useState(false)
  const formStatus = useContext<IFormContext>(FormContext)
  const { updateFormValid } = formStatus

  const handleFlavorAdd = async (callback: FormListAddFn) => {
    try {
      const currentFlavors = form.getFieldValue(['clustersFlavors', index, 'flavors'])
      const latestFlavorIndex = currentFlavors.length - 1
      await form.validateFields([
        ['clustersFlavors', index, 'flavors', latestFlavorIndex, 'cpu'],
        ['clustersFlavors', index, 'flavors', latestFlavorIndex, 'memory']
      ])
      // Only the added flavors are different can new flavor be added
      !hasSameFlavor && callback()
    } catch (err) {
      // ignore validate err
    }
  }

  const sameFlavorValidateFn = () => {
    setSameFlavor(false)
    const currentFlavors = form.getFieldValue(['clustersFlavors', index, 'flavors'])
    const flavorsSet = new Set()
    currentFlavors.forEach(({ cpu, memory }) => flavorsSet.add(`${cpu}-${memory}`))
    const hasSameFlavors = flavorsSet.size !== currentFlavors.length
    setSameFlavor(hasSameFlavors)
    updateFormValid(!hasSameFlavors)
  }

  const handleClearClusters = () => {
    const values = form.getFieldsValue()
    const { clustersFlavors } = values
    clustersFlavors[index].clusters = []
    form.setFieldsValue({ clustersFlavors })
  }

  const handleSelectAll = async () => {
    const values = form.getFieldsValue()
    const { clustersFlavors } = values
    clustersFlavors[index].clusters = [...clusterList]
    form.setFieldsValue({ clustersFlavors })
    await form.validateFields()
  }

  const hasSelectAll = () => {
    const selectedClusters = form.getFieldValue(['clustersFlavors', index, 'clusters'])
    return selectedClusters && clusterList.length === selectedClusters.length
  }

  return (
    <Card headStyle={{ backgroundColor: '#FAFAFA' }} title={Title} style={{ marginBottom: 24 }}>
      <Form.Item label='CPU & Memory' fieldKey={[fieldKey, 'cpuMem']}>
        {/* Important: name must use name path that contains fieldName */}
        <Form.List name={[fatherFieldName, 'flavors']}>
          {(fields, { add, remove }) => (
            <TableWrapper>
              <StyledTable>
                <StyledTHead>
                  <tr style={{ height: '36px' }}>
                    <td style={{ width: '36px' }}>No.</td>
                    <td>CPU (Cores)</td>
                    <td>Memory (GiB)</td>
                    <td></td>
                  </tr>
                </StyledTHead>
                <tbody>
                  {fields.map((field, index) => (
                    <StyledTr key={field.key}>
                      <td>{index + 1}</td>
                      <td>
                        <StyledFormItem
                          validateStatus={hasSameFlavor && index === fields.length - 1 ? 'error' : undefined}
                          name={[field.name, 'cpu']}
                          rules={[
                            { required: true, message: 'required!' },
                            { type: 'integer', message: 'Please enter a positive integer!' }
                          ]}
                          required={false}
                        >
                          <InputNumber onChange={sameFlavorValidateFn} min={1} />
                        </StyledFormItem>
                      </td>
                      <td>
                        <StyledFormItem
                          validateStatus={hasSameFlavor && index === fields.length - 1 ? 'error' : undefined}
                          name={[field.name, 'memory']}
                          rules={[
                            { required: true, message: 'required!' },
                            { type: 'integer', message: 'Please enter a positive integer!' }
                          ]}
                          required={false}
                        >
                          <InputNumber onChange={sameFlavorValidateFn} min={1} />
                        </StyledFormItem>
                      </td>
                      <td>
                        {fields.length > 1 ? (
                          <Icon
                            component={deleteSvg}
                            style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                            onClick={() => {
                              remove(field.name)
                              sameFlavorValidateFn()
                            }}
                          />
                        ) : (
                          <Icon component={deleteSvg} style={{ color: '#888888' }} />
                        )}
                      </td>
                    </StyledTr>
                  ))}
                  {hasSameFlavor && (
                    <ErrorInfo>
                      <td></td>
                      <td colSpan={2}>The configuration already exits</td>
                    </ErrorInfo>
                  )}
                </tbody>
              </StyledTable>
              <div style={{ margin: '4px 0 0 46px' }}>
                <Button type='link' onClick={() => handleFlavorAdd(add)}>
                  <PlusOutlined />
                  Add new pod flavor
                </Button>
              </div>
            </TableWrapper>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item
        name={[fatherFieldName, 'clusters']}
        style={{ width: 380, marginBottom: 0, float: 'right' }}
        label='Cluster'
        rules={[{ required: true, message: 'required!' }]}
        required={false}
        fieldKey={[fieldKey, 'clusters']}
      >
        <StyledSelect
          allowClear
          mode='multiple'
          placeholder='Select affected clusters'
          optionFilterProp='children'
          showSearch
          dropdownRender={menu => (
            <div>
              {menu}
              <Divider style={{ margin: '4px 0' }} />
              <div>
                {hasSelectAll() ? (
                  <Button onClick={handleClearClusters} type='link'>
                    Clear
                  </Button>
                ) : (
                  <Button onClick={handleSelectAll} type='link'>
                    Select All
                  </Button>
                )}
              </div>
            </div>
          )}
        >
          {clusterList.map(cluster => (
            <Select.Option key={cluster} value={cluster}>
              {cluster}
            </Select.Option>
          ))}
        </StyledSelect>
      </Form.Item>
    </Card>
  )
}

export default OperationCard
