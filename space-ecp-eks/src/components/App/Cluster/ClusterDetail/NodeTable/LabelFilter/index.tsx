import React from 'react'
import { Popover, Button, Form, Space, Input } from 'infrad'
import { DeleteOutlined, PlusOutlined } from 'infra-design-icons'
import {
  StyledDivider,
  StyledForm,
  StyledLabelFilterControl,
  StyledResetButton,
  StyledTitle,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/LabelFilter/style'
import { IFilterByItem } from '@infra/utils/dist/list-query'
interface ILabelFilterProps {
  labelFilters: IFilterByItem[]
  onLabelFiltersChange: (filters: IFilterByItem[]) => void
}

const LabelFilter: React.FC<ILabelFilterProps> = ({ labelFilters, onLabelFiltersChange }) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    form.setFieldsValue({
      filters: labelFilters,
    })
  }, [form, labelFilters])

  const handleSearch = async () => {
    const { filters } = await form.validateFields()
    onLabelFiltersChange(filters)
    setVisible(false)
  }

  const handleReset = () => {
    form.resetFields()
    onLabelFiltersChange([])
  }

  const filtersFrom = (
    <StyledForm form={form} style={{ width: 448 }}>
      <Form.List name="filters">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align="baseline"
                size={8}
              >
                <Form.Item
                  {...restField}
                  name={[name, 'keyPath']}
                  rules={[{ required: true, message: 'Key is required.' }]}
                >
                  <Input placeholder="key" style={{ width: 196 }} />
                </Form.Item>
                <Form.Item style={{ fontSize: 16 }} name={[name, 'operator']} initialValue="=">
                  =
                </Form.Item>
                <Form.Item {...restField} name={[name, 'value']} initialValue="">
                  <Input placeholder="value" style={{ width: 196 }} />
                </Form.Item>
                <DeleteOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                disabled={fields.length >= 30}
              >
                Add More
              </Button>
            </Form.Item>
            <StyledDivider />
            <StyledLabelFilterControl>
              <StyledResetButton onClick={handleReset}>Reset</StyledResetButton>
              <Space size={8}>
                <Button onClick={() => setVisible(false)}>Cancel</Button>
                <Button type="primary" onClick={handleSearch}>
                  Search
                </Button>
              </Space>
            </StyledLabelFilterControl>
          </>
        )}
      </Form.List>
    </StyledForm>
  )

  return (
    <Popover
      title={<StyledTitle>Labels Filters</StyledTitle>}
      trigger="click"
      placement="bottom"
      visible={visible}
      content={filtersFrom}
      onVisibleChange={(visible) => setVisible(visible)}
      getPopupContainer={() => document.body}
    >
      <Button>Label Filters</Button>
    </Popover>
  )
}

export default LabelFilter
