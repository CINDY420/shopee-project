import React from 'react'
import { Button, Cascader, Col, Form, Row, Select } from 'infrad'
import { StyledFormItem } from 'components/App/ResourceManagement/Summary/ActionBar/style'
import { ISearchValues, TAB } from 'components/App/ResourceManagement/Summary'
import { ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import { ILabelNode } from 'swagger-api/v1/models'
import { GlobalContext } from 'hocs/useGlobalContext'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'

interface IActionBarProps {
  isBatchOperating: boolean
  tab: TAB
  getSearchValues: (serchValues: Omit<ISearchValues, 'groupBy'>) => void
}

const ActionBar: React.FC<IActionBarProps> = ({ isBatchOperating, tab, getSearchValues, children }) => {
  const { state: globalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = globalContextState || {}
  const isPlatformAdmin = userRoles.some(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)

  const [form] = Form.useForm()

  const { state } = React.useContext(ResourceContext)
  const { labelTree, envs, azs, versions, machineModels } = state

  const searchDepthMapping = {
    [TAB.LEVEL_1_PROJECT]: 1,
    [TAB.LEVEL_2_PROJECT]: 2,
    [TAB.LEVEL_3_PROJECT]: 3,
    [TAB.DETAILED_SUMMARY]: 3
  }

  const handleFinish = (
    values: Omit<ISearchValues, 'level1' | 'level2' | 'level3' | 'groupBy'> & { label: string[] }
  ) => {
    const { label = [], ...restValues } = values
    const [level1, level2, level3] = label
    const searchvalues = {
      ...restValues,
      level1,
      level2,
      level3
    }
    getSearchValues?.(searchvalues)
  }

  const handleReset = () => {
    form.resetFields()
    getSearchValues?.(undefined)
  }

  const getLabelTree = (tree: ILabelNode[] = labelTree) => {
    const depth = searchDepthMapping[tab]
    const labelTreeOptions = tree.map(item => {
      return {
        ...item,
        childNodes: item.depth === depth ? [] : getLabelTree(item.childNodes)
      }
    })
    return labelTreeOptions
  }

  return (
    <Form form={form} onFinish={handleFinish} style={{ marginTop: '16px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <StyledFormItem name='label' label='Label'>
            <Cascader
              options={getLabelTree()}
              placeholder='Select'
              changeOnSelect
              fieldNames={{ value: 'labelNodeId', label: 'displayName', children: 'childNodes' }}
            />
          </StyledFormItem>
        </Col>
        <Col span={5}>
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
        {tab === TAB.DETAILED_SUMMARY && (
          <>
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
            {isPlatformAdmin ? (
              <Col span={6}>
                <StyledFormItem name='machineModel' label='Machine Model'>
                  <Select placeholder='Select' allowClear>
                    {machineModels.map(item => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </StyledFormItem>
              </Col>
            ) : null}
          </>
        )}
        <Col span={4}>
          <Button type='primary' htmlType='submit' disabled={isBatchOperating}>
            Search
          </Button>
          <Button style={{ marginLeft: 12 }} onClick={handleReset} disabled={isBatchOperating}>
            Reset
          </Button>
        </Col>
        <Col style={{ marginLeft: 'auto', marginBottom: '16px' }}>{children}</Col>
      </Row>
    </Form>
  )
}

export default ActionBar
