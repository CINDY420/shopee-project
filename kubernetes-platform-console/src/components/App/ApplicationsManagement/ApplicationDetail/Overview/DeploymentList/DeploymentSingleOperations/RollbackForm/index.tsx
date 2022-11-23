import * as React from 'react'
import { Form, Input, Select, message } from 'infrad'

import { grey } from 'constants/colors'
import { formatTime } from 'helpers/format'
import { DEPLOYMENT_ACTIONS } from 'constants/deployment'

import useAsyncFn from 'hooks/useAsyncFn'
import { IDeploymentSingleEditProps } from '../index'
import {
  deploymentsControllerGetApplicationDeployContainerTags,
  deploymentsControllerRollbackDeployment
} from 'swagger-api/v3/apis/Deployments'
import { IContainerInfo, IIGetDeployContainerTagsResponseDto, IIDeployContainerTag } from 'swagger-api/v3/models'

import BaseForm from '../Common/BaseForm'

import { InlineFormItem, Label } from '../style'
import { StyledItem, StyledContainerItem } from './style'

const { Item } = Form
const { Option } = Select

interface IContainerTagListMap {
  [name: string]: IIGetDeployContainerTagsResponseDto
}

const RollbackForm: React.FC<IDeploymentSingleEditProps> = ({
  initialValues,
  onValuesChange,
  application,
  afterFinished
}) => {
  const [form] = Form.useForm()

  const { containers, clusterId, sduName: deployName, appInstanceName } = initialValues || {}
  const { tenantId, projectName, name: appName } = application

  const [, fetchFn] = useAsyncFn(deploymentsControllerRollbackDeployment)

  const fetchContainerTagList = React.useCallback(
    async (containerName: string) =>
      deploymentsControllerGetApplicationDeployContainerTags({
        tenantId: Number(tenantId),
        projectName,
        appName,
        deployName,
        containerName,
        clusterId
      }),
    [appName, clusterId, tenantId, deployName, projectName]
  )

  const fetchAllContainersTagList = React.useCallback(() => {
    const fetchContainerTagListFns = containers.map((container: IContainerInfo) => {
      const { name: containerName } = container
      return fetchContainerTagList(containerName)
    })

    return Promise.all(fetchContainerTagListFns).then(responses => {
      return responses.reduce(
        (containerTagListMap: IContainerTagListMap, currentContainerTagList: IIGetDeployContainerTagsResponseDto) => {
          const { name } = currentContainerTagList
          containerTagListMap[name] = currentContainerTagList
          return containerTagListMap
        },
        {}
      )
    })
  }, [containers, fetchContainerTagList])

  const [fetchAllContainersTagListState, fetchAllContainersTagListFn] = useAsyncFn(fetchAllContainersTagList)

  const containerTagListMap: IContainerTagListMap = fetchAllContainersTagListState.value || {}
  const loading = fetchAllContainersTagListState.loading

  React.useEffect(() => {
    fetchAllContainersTagListFn()
  }, [fetchAllContainersTagListFn])

  return (
    <BaseForm
      form={form}
      initialValues={initialValues}
      id={DEPLOYMENT_ACTIONS.ROLLBACK}
      onFinish={values => {
        const { sduName: name, ...others } = values
        fetchFn({
          tenantId: Number(tenantId),
          projectName,
          appName,
          payload: {
            deploys: [
              {
                appInstanceName,
                name,
                ...others
              }
            ]
          }
        }).then(() => message.success(`${DEPLOYMENT_ACTIONS.ROLLBACK} ${values.name} successful!`))
        afterFinished()
      }}
      onValuesChange={onValuesChange}
      confirmConfig={{
        title: `${DEPLOYMENT_ACTIONS.ROLLBACK} the deployment ${deployName}`
      }}
    >
      <Item label={<Label>Deployment Name</Label>} name='sduName'>
        <Input disabled />
      </Item>
      <Item label={<Label>Cluster</Label>} name='clusterId'>
        <Input disabled />
      </Item>
      <InlineFormItem label={<Label>Phase</Label>} name='phase'>
        <Input disabled />
      </InlineFormItem>
      <StyledContainerItem label={<Label>Container</Label>}>
        <Form.List name='containers'>
          {fields => {
            return fields.map((field, index) => {
              const { key, name, ...restField } = field
              const container = containers[key]
              const { name: label } = container
              const tagsInfo = containerTagListMap?.[label] || {}
              const tags = tagsInfo?.tags || []

              return (
                <StyledItem {...restField} key={key} label={label} labelAlign='right' name={[name, 'tag']}>
                  <Select
                    loading={loading}
                    disabled={loading}
                    onChange={(value: string) => {
                      const [tagName, image, timestamp] = value.split(',')
                      const selectedTag = tags.find(tag => {
                        return tag.tagname === tagName && tag.image === image && tag.timestamp === timestamp
                      })

                      const containers = form.getFieldValue('containers')
                      const editingContainer = containers[index]

                      editingContainer.image = selectedTag.image
                      editingContainer.tag = tagName

                      form.setFieldsValue({
                        containers
                      })
                    }}
                  >
                    {tags.map((tag: IIDeployContainerTag) => {
                      const { image, tagname, timestamp } = tag
                      const value = `${tagname},${image},${timestamp}`
                      return (
                        <Option key={value} value={value}>
                          <div>{tagname}</div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: grey,
                              wordBreak: 'break-all',
                              whiteSpace: 'break-spaces'
                            }}
                          >{`image: ${image}`}</div>
                          <div style={{ fontSize: '12px', color: grey }}>{`timestamp: ${formatTime(timestamp)}`}</div>
                        </Option>
                      )
                    })}
                  </Select>
                </StyledItem>
              )
            })
          }}
        </Form.List>
      </StyledContainerItem>
    </BaseForm>
  )
}

export default RollbackForm
