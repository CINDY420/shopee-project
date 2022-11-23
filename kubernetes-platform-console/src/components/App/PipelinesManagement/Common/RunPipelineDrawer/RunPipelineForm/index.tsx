import React from 'react'

import { StyledForm } from 'common-styles/form'
import { Input, message, Radio, Select, Spin } from 'infrad'
import useAsyncFn from 'hooks/useAsyncFn'
import { globalControllerGetCids } from 'swagger-api/v3/apis/Global'

import { pipelinesControllerGetGitBranches } from 'swagger-api/v3/apis/Pipelines'
import CidSelector from './CidSelector'
import { getSession } from 'helpers/session'

enum ParameterTypes {
  STRING = 'string',
  CHOICE = 'choice',
  BOOL = 'bool',
  LISTGITBRANCHES = 'listGitBranches'
}
const booleanOptions = [
  { label: 'True', value: true },
  { label: 'False', value: false }
]

const { Item } = StyledForm

interface IRunPipelineForm {
  form: any
  tenantId: number
  pipelineName: string
  getPipelineState: any
}

const Option = Select.Option

const RunPipelineForm: React.FC<IRunPipelineForm> = ({ form, tenantId, pipelineName, getPipelineState }) => {
  const [getCidsState, getCidsFn] = useAsyncFn(globalControllerGetCids)
  const [getPipelineBranchesState, getPipelineBranchesFn] = useAsyncFn(pipelinesControllerGetGitBranches)

  const [cidList, setCidList] = React.useState([])
  const [branches, setBranches] = React.useState<string[]>([])
  const fetchAllListData = React.useCallback(async () => {
    const cidResult = await getCidsFn()
    setCidList(cidResult.items)
    const branches = await getPipelineBranchesFn({ tenantId, pipelineName })
    setBranches(branches)
  }, [getCidsFn, getPipelineBranchesFn, pipelineName, tenantId])

  React.useEffect(() => {
    fetchAllListData().then(() => {
      if (getPipelineState.value) {
        form.resetFields()
      }
    })
  }, [fetchAllListData, form, getPipelineState.value])

  const loginedUser = getSession()
  return getCidsState.loading || getPipelineBranchesState.loading || !getPipelineState.value ? (
    <Spin></Spin>
  ) : (
    <StyledForm form={form} layout='vertical'>
      <Item label='Pipeline Name' name='pipelineName' initialValue={pipelineName}>
        <Input disabled />
      </Item>
      {getPipelineState.value?.parameterDefinitions?.map(item => {
        switch (item.type) {
          case ParameterTypes.STRING:
            if (item.name === 'FROM_USER_NAME') {
              return (
                <Item label={item.name} name={item.name} key={item.name} initialValue={loginedUser.email}>
                  <Input disabled />
                </Item>
              )
            } else if (item.name === 'DEPLOY_CIDS') {
              const defaultCids = item.value.toUpperCase().split(',')
              return (
                <Item
                  label='CID'
                  name={item.name}
                  key={item.name}
                  initialValue={defaultCids}
                  rules={[{ required: true, message: 'Please select cid' }]}
                  colon={false}
                >
                  <CidSelector form={form} cids={cidList} defaultCids={defaultCids} />
                </Item>
              )
            } else {
              return (
                <Item label={item.name} name={item.name} key={item.name} initialValue={item.value.toString() || ''}>
                  <Input />
                </Item>
              )
            }
          case ParameterTypes.BOOL:
            return (
              <Item label={item.name} name={item.name} key={item.name} initialValue={item.value} colon={false}>
                <Radio.Group options={booleanOptions} />
              </Item>
            )
          case ParameterTypes.LISTGITBRANCHES:
            return (
              <Item
                label={item.name}
                name={item.name}
                key={item.name}
                initialValue=''
                rules={[{ required: true, message: 'Please select a value' }]}
              >
                <Select placeholder='Please select branches' showSearch>
                  {branches.length &&
                    branches.map(branch => {
                      return (
                        <Option key={branch} value={branch}>
                          {branch}
                        </Option>
                      )
                    })}
                </Select>
              </Item>
            )
          case ParameterTypes.CHOICE:
            return (
              item.choices && (
                <Item
                  label={item.name}
                  name={item.name}
                  key={item.name}
                  initialValue={item.value}
                  rules={[{ message: 'Please select a value' }]}
                >
                  <Select>
                    {item.choices.map(choice => (
                      <Option key={choice} value={choice}>
                        {choice}
                      </Option>
                    ))}
                  </Select>
                </Item>
              )
            )
          default:
            message.error(`Type ${item.name} is not existed. `)
            return <Item key={item.name}></Item>
        }
      })}
    </StyledForm>
  )
}

export default RunPipelineForm
