import React from 'react'
import { Select, Checkbox, Button, Form, Switch } from 'antd'
import { callVscode } from 'helpers/callVscode'
import { StyledCheckBox } from 'components/App/TableGenerator/style'
import { MESSAGE_CMD } from '../../../../../constants'
import TableFormList from 'components/Common/TableFormList'
import { FormListFieldData } from 'antd/lib/form/FormList'
import { capitalizeString } from 'helpers/formatString'

interface IProps {
  type: string
  disabled: boolean
}
interface IRecursive {
  [key: string]: IProps | IRecursive
}

enum FilterType {
  FIEXED = 'Fixed',
  ENUMERATE = 'Enumerate',
  FROM_PARENT = 'From Props',
  FROM_API = 'From API'
}
const TableGenerator: React.FC = () => {
  const [form] = Form.useForm()
  const [sourceData, setSourceData] = React.useState({})
  const [rowKey, setRowKey] = React.useState<string>()
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([])
  const [selectedApi, setSelectedApi] = React.useState<string>()
  const [selectedApiRequest, setSelectedApiRequest] = React.useState()

  const [selectedActions, setSelectedActions] = React.useState([])
  const [selectedMoreActions, setSelectedMoreActions] = React.useState([])

  const [selectedSearchBy, setSelectedSearchBy] = React.useState([])
  const [filterOptionApi, setFilterOptionApi] = React.useState({})

  const recursiveCheck = React.useCallback(
    (value, name, path) => {
      if (!value || typeof value !== 'object') return
      if (value?.type === 'enum' && value?.disabled === true) {
        if (filterOptionApi[name]) {
          filterOptionApi[name].push(path)
        } else {
          filterOptionApi[name] = [path]
        }
      } else {
        Object.entries(value).forEach(([key, value]) => {
          if (typeof value === 'object') {
            recursiveCheck(value, name, path ? `${path}.${key}` : key)
          }
        })
      }
    },
    [filterOptionApi]
  )
  React.useEffect(() => {
    callVscode(
      {
        cmd: MESSAGE_CMD.GET_SOURCE_DATA
      },
      (result: { response: unknown; functionName: string }[]) => {
        Object.values(result).forEach((each) => {
          if (typeof each.response === 'object') {
            recursiveCheck(each.response, each.functionName, '')
          }
        })
        setFilterOptionApi(filterOptionApi)
        setSourceData(result)
      }
    )
  }, [filterOptionApi, recursiveCheck])

  const handleApiSelected = (value: string) => {
    form.resetFields()
    setSelectedApi(value)
    setSelectedApiRequest(sourceData?.[value]?.request)
  }

  const recursiveRender = (items: IRecursive, preKey?: string) => {
    return (
      <div style={{ width: '0' }}>
        {Object.entries(items).map(([key, value]) => {
          if (value.type) {
            return (
              <StyledCheckBox
                disabled={value.disabled}
                key={preKey ? `${preKey}.${key}` : key}
                value={preKey ? `${preKey}.${key}` : key}
              >
                {key}
              </StyledCheckBox>
            )
          } else {
            return (
              <StyledCheckBox
                disabled
                key={preKey ? `${preKey}.${key}` : key}
                value={preKey ? `${preKey}.${key}` : key}
              >
                {key}
                {recursiveRender(value as IRecursive, preKey ? `${preKey}.${key}` : key)}
              </StyledCheckBox>
            )
          }
        })}
      </div>
    )
  }

  const handleGenerate = async () => {
    await form.validateFields()
    callVscode({
      cmd: MESSAGE_CMD.PREVIEW,
      data: {
        columns: selectedKeys,
        rowKey,
        apiName: selectedApi,
        request: selectedApiRequest,
        actions: selectedActions,
        moreActions: selectedMoreActions,
        formValue: form.getFieldValue(['extraConfig']),
        selectedSearchBy
      }
    })
  }
  const handleSelectActions = (values: string[]) => {
    setSelectedActions(
      values.map((value) => {
        return {
          capital: capitalizeString(value),
          value,
          allCapital: value.toUpperCase()
        }
      })
    )
  }
  const handleSelectMoreActions = (values: string[]) => {
    setSelectedMoreActions(
      values.map((value) => {
        return {
          capital: capitalizeString(value),
          value,
          allCapital: value.toUpperCase()
        }
      })
    )
  }

  const handleFilterByClick = (index) => {
    const arr = form.getFieldsValue(['extraConfig']).extraConfig
    if (arr && arr[index]) {
      arr[index].type = undefined
      arr[index].filterValues = undefined
      form.setFieldsValue({ extraConfig: [...arr] })
    }
  }

  const handleTypeSelected = (index) => {
    const arr = form.getFieldsValue(['extraConfig']).extraConfig
    if (arr && arr[index]) {
      arr[index].filterValues = undefined
      form.setFieldsValue({ extraConfig: [...arr] })
    }
  }
  const columns = [
    {
      title: 'Key',
      dataIndex: 'selectedKey',
      width: '30%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item name={[record.name, 'selectedKey']} rules={[{ required: true, message: 'Input a value' }]}>
          <Select>
            {selectedKeys.map((key) => (
              <Select.Option
                key={key}
                value={key}
                disabled={
                  form.getFieldsValue(['extraConfig'])?.extraConfig?.filter((each) => each?.selectedKey === key)
                    ?.length !== 0 ?? false
                }
              >
                {key}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    },
    {
      title: 'Order',
      dataIndex: 'order',
      width: '10%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item name={[record.name, 'order']} valuePropName='checked'>
          <Switch />
        </Form.Item>
      )
    },
    {
      title: 'Filter',
      dataIndex: 'filter',
      width: '10%',
      render: (_: unknown, record: FormListFieldData) => {
        return (
          <>
            <Form.Item name={[record.name, 'filter']} valuePropName='checked'>
              <Switch onChange={() => handleFilterByClick(record.name)} />
            </Form.Item>
          </>
        )
      }
    },
    {
      title: 'Filter Type',
      dataIndex: 'type',
      width: '20%',
      render: (_: unknown, record: FormListFieldData) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const filterable = getFieldValue(['extraConfig', record.name, 'filter'])
              return (
                filterable && (
                  <Form.Item name={[record.name, 'type']}>
                    <Select onChange={() => handleTypeSelected(record.name)}>
                      {Object.values(FilterType).map((type) => (
                        <Select.Option key={type} value={type}>
                          {type}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )
              )
            }}
          </Form.Item>
        )
      }
    },
    {
      title: 'Filter Values',
      dataIndex: 'filterValues',
      width: '40%',
      render: (_: unknown, record: FormListFieldData) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              // const filterable = getFieldValue(['extraConfig', record.name, 'filter'])
              const filterType = getFieldValue(['extraConfig', record.name, 'type'])
              switch (filterType) {
                case FilterType.FIEXED:
                  return (
                    <Form.Item
                      name={[record.name, 'filterValues']}
                      rules={[{ required: true, message: 'Input a value' }]}
                    >
                      <Select mode='tags' tokenSeparators={[',']} />
                    </Form.Item>
                  )
                case FilterType.FROM_API:
                  return (
                    <div style={{ display: 'flex', width: '100%' }}>
                      <Form.Item
                        name={[record.name, 'filterValues']}
                        style={{ width: '30%' }}
                        rules={[{ required: true, message: 'Input a value' }]}
                      >
                        <Select showSearch>
                          {Object.keys(filterOptionApi)?.map((item) => (
                            <Select.Option key={item} value={item}>
                              {item}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const filterValues = getFieldValue(['extraConfig', record.name, 'filterValues'])
                          return (
                            <Form.Item
                              name={[record.name, 'filterApiPath']}
                              style={{ width: '70%' }}
                              rules={[{ required: true, message: 'Input a value' }]}
                            >
                              <Select showSearch>
                                {filterOptionApi[filterValues]?.map((item) => (
                                  <Select.Option key={item} value={item}>
                                    {item}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          )
                        }}
                      </Form.Item>
                    </div>
                  )
                default:
                  return <></>
              }
            }}
          </Form.Item>
        )
      }
    }
  ]

  return (
    <>
      <div style={{ display: 'flex', padding: '16px', alignItems: 'center' }}>
        <>API: </>
        <Select style={{ width: '300px', marginLeft: '16px' }} showSearch onChange={handleApiSelected}>
          {Object.keys(sourceData)?.map((item) => (
            <Select.Option disabled={!item.includes('List')} key={item} value={item}>
              {item.split('Controller')[0]} - {item.split('Controller')[1]}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div style={{ marginLeft: '16px' }}>
        {selectedApi && (
          <>
            <div style={{ marginBottom: '16px' }} key={selectedApi}>
              {/* initial value would be like [items.xxx] */}
              <Checkbox.Group onChange={(value) => setSelectedKeys(value.map((each: string) => each.slice(6)))}>
                {recursiveRender(sourceData[selectedApi].response)}
              </Checkbox.Group>
            </div>
            {selectedKeys.length !== 0 && (
              <>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Filters & Sorter</div>
                <Form form={form}>
                  <Form.List name='extraConfig' initialValue={[undefined]}>
                    {(fields, { add, remove }) => (
                      <TableFormList dataColumns={columns} dataSource={fields} onAdd={add} onRemove={remove} />
                    )}
                  </Form.List>
                </Form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                  <>Search By: </>
                  <Select
                    style={{ width: '160px', marginLeft: '16px' }}
                    mode='tags'
                    tokenSeparators={[',']}
                    onChange={(values: string[]) => setSelectedSearchBy(values)}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                  <>Actions: </>
                  <Select
                    style={{ width: '160px', marginLeft: '16px' }}
                    mode='tags'
                    tokenSeparators={[',']}
                    onChange={handleSelectActions}
                  />
                </div>
                {selectedActions.length !== 0 && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <>More Actions: </>
                    <Select
                      style={{ width: '160px', marginLeft: '16px' }}
                      mode='tags'
                      tokenSeparators={[',']}
                      onChange={handleSelectMoreActions}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div
        style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '24px', left: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>RowKey: </div>
          <Select
            style={{ width: '120px', margin: '0 16px' }}
            showSearch
            onChange={(value: string) => setRowKey(value)}
          >
            {selectedKeys.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Button type='primary' onClick={handleGenerate}>
          Generate
        </Button>
      </div>
    </>
  )
}

export default TableGenerator
