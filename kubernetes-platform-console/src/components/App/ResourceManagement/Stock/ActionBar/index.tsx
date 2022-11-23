import React from 'react'
import { Button, Cascader, Checkbox, Col, Form, Input, Row, Select } from 'infrad'
import { StyledFormItem } from 'components/App/ResourceManagement/Stock/ActionBar/style'
import { ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import { ISearchValues } from 'components/App/ResourceManagement/Stock'

interface IActionBarProps {
  isBatchOperating: boolean
  getSearchValues: (serchValues: ISearchValues) => void
  isViewAllDetails: boolean
  onViewAllDetailsChange: (isViewAllDetails: boolean) => void
}

const ActionBar: React.FC<IActionBarProps> = ({
  isBatchOperating,
  getSearchValues,
  isViewAllDetails,
  onViewAllDetailsChange,
  children
}) => {
  const { state } = React.useContext(ResourceContext)
  const { labelTree, versions, cids, envs, azs, clusters, segments } = state
  const [form] = Form.useForm()

  const handleFinish = (values: Omit<ISearchValues, 'level1' | 'level2' | 'level3'> & { label: string[] }) => {
    const { label = [], ...restValues } = values
    const [level1, level2, level3] = label
    const searchValues = {
      ...restValues,
      level1,
      level2,
      level3
    }
    getSearchValues?.(searchValues)
  }

  const handleReset = () => {
    form.resetFields()
    getSearchValues?.(undefined)
  }

  return (
    <Form form={form} onFinish={handleFinish} style={{ marginBottom: '16px' }}>
      <Row gutter={16}>
        <Col span={7}>
          <StyledFormItem name='grepKey' label='SDU'>
            <Input placeholder='Input' allowClear />
          </StyledFormItem>
        </Col>
        <Col span={7}>
          <StyledFormItem name='label' label='Label'>
            <Cascader
              options={labelTree}
              placeholder='Select'
              changeOnSelect
              fieldNames={{ value: 'labelNodeId', label: 'displayName', children: 'childNodes' }}
            />
          </StyledFormItem>
        </Col>
        <Col span={6}>
          <StyledFormItem name='versionId' label='Version'>
            <Select placeholder='Select' allowClear>
              {versions.map(item => (
                <Select.Option key={item.versionId} value={item.versionId}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </StyledFormItem>
        </Col>
        <Col span={4}>
          <StyledFormItem name='cid' label='CID'>
            <Select placeholder='Select' allowClear>
              {cids.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </StyledFormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={4}>
          <StyledFormItem name='env' label='ENV'>
            <Select placeholder='Select' allowClear>
              {envs.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </StyledFormItem>
        </Col>
        <Col span={4}>
          <StyledFormItem name='az' label='AZ'>
            <Select placeholder='Select' allowClear>
              {azs.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </StyledFormItem>
        </Col>
        <Col span={6}>
          <StyledFormItem name='cluster' label='Cluster'>
            <Select placeholder='Select' allowClear>
              {clusters.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </StyledFormItem>
        </Col>
        <Col span={6}>
          <StyledFormItem name='segment' label='Segment'>
            <Select placeholder='Select' allowClear>
              {segments.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </StyledFormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={4}>
          <Button type='primary' htmlType='submit' disabled={isBatchOperating}>
            Search
          </Button>
          <Button style={{ marginLeft: 12 }} onClick={handleReset} disabled={isBatchOperating}>
            Reset
          </Button>
        </Col>
        <Col style={{ marginLeft: 'auto' }}>
          <Checkbox checked={isViewAllDetails} onChange={e => onViewAllDetailsChange(e.target.checked)}>
            View All Details
          </Checkbox>
          {children}
        </Col>
      </Row>
    </Form>
  )
}

export default ActionBar
