import * as React from 'react'
import { Form, Input, Checkbox, Empty, Spin } from 'infrad'
import { FormInstance } from 'infrad/lib/form'

import useAsyncFn from 'hooks/useAsyncFn'
import { START_WITH_LOWER_ALPHA, ONLY_LOWER_ALPHA_NUMERIC } from 'helpers/validate'
import { groupsControllerGetProjectEnvQuotas } from 'swagger-api/v3/apis/Tenants'
import { globalControllerGetCids, globalControllerGetEnvs } from 'swagger-api/v3/apis/Global'

import { IIProjectQuotaDto, IIResourceQuotaDetail } from 'swagger-api/v3/models'

import { CenterWrapper } from 'common-styles/flexWrapper'
import ClusterList from './ClusterList'
import { Root, FormRoot, Label } from './style'
import { SDU_TYPE } from 'constants/deployment'
import { IQuota } from 'swagger-api/v1/models'
const { useState, useEffect, useCallback } = React
interface IProps {
  isEdit?: boolean
  form: FormInstance
  selectedGroup: any
  selectedProject: any
  onFieldsChange: any
}

interface IFormProps {
  name: string
  environment: string[]
  CID: string[]
  orchestrator: string[]
  quotas?: IQuota[]
}

const formItemLayout = {
  labelCol: {
    span: 24
  },
  wrapperCol: {
    span: 24
  }
}

const getQuotaNamesMapFromCluster = (clusters: IIProjectQuotaDto[] = []) => {
  const map = {}

  clusters.forEach(cluster => {
    const { name, resourceQuotas } = cluster
    map[name] = resourceQuotas.map(quota => quota.name)
  })

  return map
}

const getMapFromList = (list: any[] = []) =>
  list.reduce((map, item) => {
    map[item.name] = item
    return map
  }, {})

const ProjectForm: React.FC<IProps> = ({ isEdit, form, selectedGroup, selectedProject, onFieldsChange }) => {
  const { resetFields, setFieldsValue, getFieldsError, getFieldsValue } = form

  const project = isEdit ? selectedProject : {}
  const { cids = [], quotas = {}, envs: environments = [], name = '' } = project

  const [, getCidsFn] = useAsyncFn(globalControllerGetCids)
  const [, getEnvsFn] = useAsyncFn(globalControllerGetEnvs)
  const [getEnvQuotasState, getEnvQuotasFn] = useAsyncFn(groupsControllerGetProjectEnvQuotas)

  const [environmentList, setEnvironmentList] = useState([])
  const [cidList, setCidList] = useState([])
  const [clusterList, setClusterList] = useState([])

  const [preCidsValue, setPreCidsValue] = useState([...cids])
  const [preEnvsValue, setPreEnvsValue] = useState([...environments])

  const renderGroup = (itemList: string[], selectedItems: string[]) => {
    return (
      <Checkbox.Group>
        {itemList.map((item: any) => (
          <Checkbox key={item} value={item} disabled={selectedItems.includes(item)}>
            {item}
          </Checkbox>
        ))}
      </Checkbox.Group>
    )
  }

  const normalizeAll = (value, prevValue = [], label) => {
    const list = label === 'environment' ? environmentList : cidList
    const currentIndex = value.indexOf('All')
    const prevIndex = prevValue.indexOf('All')

    if (currentIndex >= 0 && prevIndex < 0) {
      return ['All'].concat(list)
    } else if (currentIndex < 0 && prevIndex >= 0) {
      return []
    } else if (currentIndex >= 0 && prevIndex >= 0) {
      value.splice(currentIndex, 1)
      return value
    }

    return value
  }

  const getIsError = () => {
    const errors = getFieldsError()
    return errors.filter(error => error.errors.length > 0).length > 0
  }

  const isRequiredNotEmpty = (formValues: IFormProps) => {
    const { environment, CID, name, quotas: quotasMap = {}, orchestrator } = formValues
    const quotas = Object.values(quotasMap)
    const isQuotasNotEmpty = quotas.length && quotas.some((quota: string[]) => quota && quota.length)
    const isExistedEcpSdu = orchestrator?.includes(SDU_TYPE.ECP)

    const isBasicRequiredNotEmpty = isEdit
      ? environment.length && CID.length && name.length
      : environment.length && CID.length && name.length && orchestrator
    const isECPRequiredNotEmpty = isBasicRequiredNotEmpty && isQuotasNotEmpty

    if (isEdit) {
      return isECPRequiredNotEmpty
    } else {
      return isExistedEcpSdu ? isECPRequiredNotEmpty : isBasicRequiredNotEmpty
    }
  }

  const handleFieldsChange = changedFields => {
    const fieldObj = changedFields[0]
    const changedField = fieldObj && fieldObj.name[0]
    const values = getFieldsValue()

    if (changedField === 'environment' || changedField === 'CID') {
      const { environment, CID } = values
      setPreCidsValue(CID)
      setPreEnvsValue(environment)

      const isValueChanged =
        environment.toString() !== preEnvsValue.toString() || CID.toString() !== preCidsValue.toString()
      const isNotEmpty = environment.length && CID.length

      if (isValueChanged) {
        if (isNotEmpty) {
          resetFields(['quotas'])
          environment.length && CID.length && fetchClusterListConfigInfo(environment, CID)
        } else {
          setFieldsValue({ ...getFieldsValue(), quotas: {} })
          setClusterList([])
        }
      }
    }

    const isError = getIsError()
    const isRequiredFieldsNotEmpty = isRequiredNotEmpty(values)
    onFieldsChange && onFieldsChange(isError || !isRequiredFieldsNotEmpty)
  }

  const fetchClusterListConfigInfo = useCallback(
    async (envs: string[], cids: string[]) => {
      const { clusters } = await getEnvQuotasFn({
        environments: envs,
        cids,
        tenantId: selectedGroup.id
      })

      // cluster只有一个时，默认选中cluster及其底下的envs
      if (clusters.length === 1) {
        const allQuotasNamesMap = getQuotaNamesMapFromCluster(clusters)
        setFieldsValue({ ...getFieldsValue(), quotas: allQuotasNamesMap })
      }

      setClusterList(clusters)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getEnvQuotasFn, selectedGroup.name]
  )

  const fetchAllListData = useCallback(async () => {
    const [envResult, cidResult] = await Promise.all([getEnvsFn(), getCidsFn()])

    setEnvironmentList(envResult.items)
    setCidList(cidResult.items)
  }, [getEnvsFn, getCidsFn])

  useEffect(() => {
    fetchAllListData()
    isEdit && environments.length && cids.length && fetchClusterListConfigInfo(environments, cids)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const combineClusterList = (
    allClusterList: IIProjectQuotaDto[] = [],
    projectClusterList: IIProjectQuotaDto[] = []
  ) => {
    const projectClustersMap = getMapFromList(projectClusterList)

    return allClusterList.map((cluster: IIProjectQuotaDto) => {
      const { name, resourceQuotas } = cluster
      if (!projectClustersMap[name]) {
        return cluster
      }

      const resourceQuotasMap = getMapFromList(projectClustersMap[name].resourceQuotas)
      const newResourceQuotas = resourceQuotas.map(
        (quota: IIResourceQuotaDetail) => resourceQuotasMap[quota.name] || quota
      )
      return {
        name,
        resourceQuotas: newResourceQuotas
      }
    })
  }

  const preSelectedQuotaNamesMap = getQuotaNamesMapFromCluster(quotas.clusters)
  const allQuotasNamesMap = getQuotaNamesMapFromCluster(clusterList)
  // set default form values
  form.setFieldsValue({ ...getFieldsValue(), quotas: preSelectedQuotaNamesMap })

  const shouldUpdate = (prevValue: IFormProps, currentValue: IFormProps) => {
    return prevValue?.orchestrator !== currentValue?.orchestrator
  }

  const presetClusterList = React.useMemo(() => combineClusterList(clusterList, quotas.clusters), [
    clusterList,
    quotas.clusters
  ])

  return (
    <Root>
      <FormRoot>
        <Form layout='vertical' form={form} {...formItemLayout} onFieldsChange={handleFieldsChange}>
          <Form.Item
            label={<Label>Name</Label>}
            name='name'
            initialValue={name}
            rules={
              isEdit
                ? []
                : [
                    {
                      required: true,
                      message: 'Please input project name'
                    },
                    {
                      pattern: START_WITH_LOWER_ALPHA,
                      message: 'Must start with lowercase alpha a-z'
                    },
                    {
                      pattern: ONLY_LOWER_ALPHA_NUMERIC,
                      message: 'Can only contain lowercase alphanumeric(a-z0-9)'
                    },
                    {
                      max: 31,
                      message: 'Must be less than or equal to 31 characters'
                    },
                    {
                      min: 2,
                      message: 'Must be more than 1 character'
                    }
                  ]
            }
            validateFirst={true}
          >
            <Input placeholder='Must only consist of lowercase alphanumeric(a-z0-9)' autoFocus disabled={isEdit} />
          </Form.Item>
          <Form.Item
            label={<Label>Environment</Label>}
            name='environment'
            initialValue={[...environments]}
            normalize={(value, prevValue) => normalizeAll(value, prevValue, 'environment')}
            rules={[
              {
                required: true,
                message: 'Please choose environment'
              }
            ]}
          >
            {renderGroup(environmentList, environments)}
          </Form.Item>
          <Form.Item
            label={<Label>CID</Label>}
            name='CID'
            initialValue={[...cids]}
            normalize={(value, prevValue) => normalizeAll(value, prevValue, 'CID')}
            rules={[
              {
                required: true,
                message: 'Please choose CID'
              }
            ]}
          >
            {renderGroup(cidList, cids)}
          </Form.Item>
          <Form.Item shouldUpdate={shouldUpdate}>
            {({ getFieldValue }) => {
              const orchestratorValue = getFieldValue('orchestrator')
              return orchestratorValue?.includes(SDU_TYPE.ECP) || isEdit ? (
                <Spin spinning={getEnvQuotasState.loading}>
                  <Form.Item
                    label={<Label>Cluster</Label>}
                    name='quotas'
                    initialValue={preSelectedQuotaNamesMap}
                    rules={[
                      {
                        required: true,
                        message: 'Please choose Cluster'
                      }
                    ]}
                  >
                    {clusterList.length ? (
                      <ClusterList
                        preSelectedQuotaNamesMap={preSelectedQuotaNamesMap}
                        allQuotasNamesMap={allQuotasNamesMap}
                        clusterList={presetClusterList}
                        form={form}
                      />
                    ) : (
                      <CenterWrapper>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      </CenterWrapper>
                    )}
                  </Form.Item>
                </Spin>
              ) : null
            }}
          </Form.Item>
          {isEdit || (
            <Form.Item
              label={<Label>Orchestrator</Label>}
              name='orchestrator'
              rules={[
                {
                  required: true,
                  message: 'Please choose orchestrator'
                }
              ]}
            >
              <Checkbox.Group>
                <Checkbox value={SDU_TYPE.LEAP}>Leap</Checkbox>
                <Checkbox value={SDU_TYPE.ECP}>SZ K8S</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          )}
        </Form>
      </FormRoot>
    </Root>
  )
}

export default ProjectForm
