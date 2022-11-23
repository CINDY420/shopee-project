import React, { forwardRef, useImperativeHandle } from 'react'
import { Input, Form, Select, Empty } from 'infrad'
import { FormProps, FormInstance } from 'infrad/lib/form'

import { FLAVOR_OPTION, PHASE_RELEASE } from 'constants/deployment'

import { formatLimitAndRequestText } from 'helpers/deploy'

import { FormWrapper, PhaseWrap, PhaseTitle, Label } from './style'
import PhaseCard from './PhaseCard'
import { flavorControllerGetClusterFlavors } from 'swagger-api/v3/apis/Flavor'
import { IClusterFlavor } from 'api/types/cluster/cluster'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

const { Item } = Form
const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 24
  },
  wrapperCol: {
    span: 24
  }
}

interface IFormPhaseResource {
  flavorOption: FLAVOR_OPTION
  flavor: string
  container: string
  cpuLimit: number
  memLimit: number
}
interface IFormPhase {
  phase: string
  resource: IFormPhaseResource[]
}

interface IFormDetail {
  phases: IFormPhase[]
}

interface IProps {
  clusterName: string
  form: FormInstance
  deploymentDetail: any
  clusters: string[]
  flavorOptions: string[]
  initialValues: IFormDetail
  onFieldsChange: (isError: boolean) => void
}

const DeploymentForm: React.FC<any> = forwardRef<FormProps, IProps>(
  ({ clusterName, form, clusters: preClusters, deploymentDetail, onFieldsChange, initialValues }, ref) => {
    const { resetFields, setFieldsValue, getFieldsError } = form
    const { name, containerDetails } = deploymentDetail

    const [flavors, setFlavors] = React.useState<IClusterFlavor[]>([])
    const handleFetchFlavors = React.useCallback(async () => {
      const res = await flavorControllerGetClusterFlavors({ clusterName })
      const { flavors = [] } = res || {}
      setFlavors(flavors)
    }, [clusterName])

    React.useEffect(() => {
      handleFetchFlavors()
    }, [handleFetchFlavors])

    const accessControlContext = React.useContext(AccessControlContext)
    const projectActions = accessControlContext[RESOURCE_TYPE.PROJECT] || []
    const canCustomSetFlavor = projectActions.includes(RESOURCE_ACTION.Transfer)

    const clusters = preClusters.map((item: string) => {
      return {
        text: item,
        value: item
      }
    })

    const getFormValues = (deployName: string, clusterName: string) => {
      const defaultValues = {
        deployName,
        clusterName
      }

      Object.entries(containerDetails).forEach(([phaseName, containerList]: any) => {
        containerList.forEach(containerObj => {
          const { name, cpuLimit, memLimit } = containerObj
          defaultValues[`${phaseName}---${name}`] = `${formatLimitAndRequestText(
            cpuLimit,
            'Cores'
          )} / ${formatLimitAndRequestText(memLimit, 'GiB')}`
        })
      })

      return defaultValues
    }

    const getIsError = () => {
      const errors = getFieldsError()
      return errors.filter(error => error.errors.length > 0).length > 0
    }

    const handleFieldsChange = changedFields => {
      const fieldObj = changedFields[0]
      const isClusterChanged = fieldObj && fieldObj.name[0] === 'clusterName'

      if (isClusterChanged) {
        const clusterName = fieldObj.value

        const newValues = getFormValues(name, clusterName)
        setFieldsValue(newValues)
      }

      const isError = getIsError()
      onFieldsChange && onFieldsChange(isError)
    }

    useImperativeHandle(ref, () => ({
      form
    }))

    React.useEffect(() => {
      resetFields()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { phases = [] } = initialValues
    return (
      <FormWrapper>
        <Form
          name='deployment_form'
          {...formItemLayout}
          form={form}
          labelAlign='left'
          colon={false}
          layout='vertical'
          initialValues={{ ...initialValues, deployName: name, clusterName }}
          onFieldsChange={handleFieldsChange}
        >
          <Item
            label={<Label>Deployment Name</Label>}
            name='deployName'
            rules={[{ required: true, message: 'Deployment Name' }]}
          >
            <Input placeholder='' disabled={true} />
          </Item>
          <Item label={<Label>Cluster</Label>} name='clusterName' rules={[{ required: true, message: 'Cluster' }]}>
            {/* 后端返回的cluster列表不好处理，跟产品讨论，去掉cluster切换功能 */}
            <Select placeholder='' disabled>
              {clusters.map((item: any) => (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              ))}
            </Select>
          </Item>
          <Item label={<Label>Phase</Label>}>
            {phases.length ? (
              <Form.List name='phases'>
                {fields =>
                  fields.map(({ key, name }, index) => {
                    const { phase: phaseName, resource: containerList } = phases[index]
                    return (
                      <>
                        <PhaseWrap key={key}>
                          <PhaseTitle>
                            <Form.Item style={{ marginBottom: '4px' }} name={[name, 'phase']}>
                              {phaseName}
                            </Form.Item>
                          </PhaseTitle>
                          <Form.List name={[name, 'resource']}>
                            {fields =>
                              fields.map(({ key, name, ...restField }, index) => (
                                <PhaseCard
                                  disable={phases.length > 1 && phaseName === PHASE_RELEASE}
                                  key={key}
                                  fatherName={name}
                                  {...restField}
                                  flavors={flavors}
                                  index={index}
                                  containerDetail={containerList[index]}
                                  canCustomSetFlavor={canCustomSetFlavor}
                                />
                              ))
                            }
                          </Form.List>
                        </PhaseWrap>
                      </>
                    )
                  })
                }
              </Form.List>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Item>
        </Form>
      </FormWrapper>
    )
  }
)

export default DeploymentForm
