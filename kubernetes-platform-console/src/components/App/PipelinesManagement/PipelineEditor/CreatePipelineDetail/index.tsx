import { Form, message, Spin } from 'infrad'
import { PIPELINES } from 'constants/routes/routes'
import * as React from 'react'
import history from 'helpers/history'

import {
  pipelinesControllerCreatePipeline,
  pipelinesControllerUpdatePipeline,
  pipelinesControllerGetAllPipelineEngines
} from 'swagger-api/v3/apis/Pipelines'
import { ICreatePipelinesBodyDto, IPipelineConfig } from 'swagger-api/v3/models'
import BasicInfo from './BasicInfo'
import Parameter from './Parameter'
import { CancelButton, SubmitButton } from './style'
import { buildPipelineHistoriesName, buildTenantName } from 'constants/routes/name'
import { IParameterDefinition, ILastRun, IConfig } from 'api/types/application/pipeline'
import { globalControllerGetCids, globalControllerGetEnvs } from 'swagger-api/v3/apis/Global'
import { clustersControllerGetClusterNames } from 'swagger-api/v3/apis/Cluster'
import useAsyncFn from 'hooks/useAsyncFn'
import { ENV, K8S_TEMPLATE } from 'constants/pipeline'

// interface IBasicInfo {
//   env?: string
// }
interface ICreatePipelineProps {
  tenantId: number
  tenantName: string
  isEdit: boolean
  pipeline?: {
    env: string
    module: string
    name: string
    project: string
    engine: string
    lastRun: ILastRun
    config: IConfig
    parameterDefinitions: IParameterDefinition[]
  }
}
const CreatePipelineDetail: React.FC<ICreatePipelineProps> = ({ tenantId, tenantName, pipeline, isEdit }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(true)

  const defaultTemplate = isEdit ? pipeline.config?.PipelineTemplate || K8S_TEMPLATE : K8S_TEMPLATE
  const [template, setTemplate] = React.useState(defaultTemplate)

  const [selectedCidList, setSelectedCidList] = React.useState([])
  const [selectedEnvList, setSelectedEnvList] = React.useState([])

  const [, getEnginesFn] = useAsyncFn(pipelinesControllerGetAllPipelineEngines)
  const [engineList, setEngineList] = React.useState([])

  const [, getClustersFn] = useAsyncFn(clustersControllerGetClusterNames)
  const [clusterList, setClusterList] = React.useState([])

  const [, getCidsFn] = useAsyncFn(globalControllerGetCids)
  const [cidList, setCidList] = React.useState([])

  const [, getEnvsFn] = useAsyncFn(globalControllerGetEnvs)
  const [envList, setEnvList] = React.useState([])

  const fetchAllListData = React.useCallback(async () => {
    const [envs, cids, clusters, engines] = await Promise.all([
      getEnvsFn(),
      getCidsFn(),
      getClustersFn(),
      getEnginesFn({ tenantId })
    ])
    setEnvList(envs.items.map(env => env.toLocaleLowerCase()).filter(env => env !== ENV.LIVE && env !== ENV.LIVEISH))
    setCidList(cids.items)
    setClusterList(clusters.names)
    setEngineList(engines)
    setLoading(false)
  }, [getCidsFn, getClustersFn, getEnginesFn, getEnvsFn, tenantId])

  React.useEffect(() => {
    fetchAllListData()
    if (isEdit) {
      setSelectedEnvList([pipeline.env])
      pipeline.parameterDefinitions.forEach(parameter => {
        if (parameter.name === 'DEPLOY_CIDS') {
          setSelectedCidList(
            parameter.value
              .toString()
              .toUpperCase()
              .split(',')
          )
        }
      })
    }
  }, [fetchAllListData, isEdit, pipeline])

  const handleSubmit = async () => {
    try {
      const fieldData = await form.validateFields()
      const index = fieldData.parameters.findIndex(obj => obj.key === 'DEPLOY_CIDS')
      if (fieldData.parameters[index].value === '') {
        throw new Error('Please fill out all the fields (e.g. CID)')
      } else if (fieldData.config.k8sMaxSurge === '0' && fieldData.config.k8sMaxUnavailable === '0') {
        throw new Error('K8S_MAX_SURGE and K8S_MAX_UNAVALIABLE cannot be 0 at the same time')
      }
      const basicInfo: ICreatePipelinesBodyDto = {
        engines: {},
        envs: [],
        module: '',
        project: '',
        pipelineConfig: null,
        parameterDefinitions: null
      }
      const config: IPipelineConfig = {
        pipelineTemplate: '',
        gitRepo: '',
        deployDefinition: '',
        tenantName: '',
        deployToK8s: true,
        deployToK8sOnly: true,
        k8sMesosZK: false,
        k8sUseActualIDC: false,
        k8sKeepSMBSmoke: false,
        k8sReplicas: 1,
        k8sCanaryReplicas: 1,
        k8sMaxSurge: '',
        k8sMaxUnavailable: '',
        extraHosts: '',
        k8sCanaryPercentage: '',
        platformCluster: {},
        terminationGracePeriodSeconds: 30
      }
      const parameters = []
      Object.keys(fieldData).forEach(field => {
        switch (field) {
          case 'basicInfo':
            Object.keys(fieldData[field]).forEach(key => {
              if (isEdit && key === 'envs') {
                const env = fieldData[field][key]
                delete fieldData[field][key]
                basicInfo.env = env[0]
              } else {
                basicInfo[key] = fieldData[field][key]
              }
            })
            break
          case 'config':
            Object.keys(fieldData[field]).forEach(key => {
              config[key] = fieldData[field][key]
            })
            break
          case 'parameters':
            fieldData[field].forEach(parameterObject => {
              const parameter = {
                name: parameterObject.key,
                value: parameterObject.type === 'bool' ? false : parameterObject.value || '',
                type: parameterObject.type === 'Git-Branch' ? 'listGitBranches' : parameterObject.type,
                description: '',
                choices: []
              }
              if (parameterObject.key === 'DEPLOY_CIDS') {
                parameterObject.value.split(',').forEach(each => {
                  each && parameter.choices.push(each)
                })
              }
              if (parameterObject.type === 'choice') {
                Object.assign(parameter.choices, parameterObject.value)
              }
              parameters.push(parameter)
            })
            break
          default:
            break
        }
      })
      if (isEdit) {
        const pipelineName = pipeline.name
        await pipelinesControllerUpdatePipeline({
          tenantId,
          pipelineName,
          payload: { ...basicInfo, pipelineConfig: config, parameterDefinitions: parameters }
        })
        message.success('Update Pipeline Successfully!')
        history.push(`${buildPipelineHistoriesName(tenantId, pipelineName)}`)
      } else {
        await pipelinesControllerCreatePipeline({
          tenantId,
          payload: { ...basicInfo, pipelineConfig: config, parameterDefinitions: parameters }
        })
        message.success('Create Pipeline Successfully!')
        history.push(`${PIPELINES}/${buildTenantName(tenantId)}`)
      }
    } catch (e) {
      e.errorFields && message.error('Please fill out all the fields')
      e.message && message.error(e.message)
    }
  }

  const handleCancel = () => {
    if (isEdit) {
      history.push(`${buildPipelineHistoriesName(tenantId, pipeline.name)}`)
    } else {
      history.replace(`${PIPELINES}/${buildTenantName(tenantId)}`)
    }
  }
  return loading ? (
    <Spin></Spin>
  ) : (
    <>
      <BasicInfo
        isEdit={isEdit}
        config={isEdit ? pipeline.config : undefined}
        project={isEdit ? pipeline.project : undefined}
        module={isEdit ? pipeline.module || '' : undefined}
        env={isEdit ? pipeline.env || pipeline.config.ENVIRONMENT : undefined}
        engine={isEdit ? pipeline.engine : undefined}
        selectedCid={isEdit ? selectedCidList : undefined}
        selectedEnv={selectedEnvList}
        engineList={engineList}
        clusterList={clusterList}
        cidList={cidList}
        envList={envList}
        tenantName={tenantName}
        onEnvListChange={setSelectedEnvList}
        template={template}
        onTemplateChange={setTemplate}
        form={form}
      />
      <Parameter
        isEdit={isEdit}
        gitRepo={isEdit ? pipeline.config.GIT_REPO : undefined}
        parameterDefinitions={isEdit ? pipeline.parameterDefinitions : undefined}
        template={template}
        form={form}
      />
      <SubmitButton size='large' type='primary' onClick={handleSubmit}>
        Submit
      </SubmitButton>
      <CancelButton size='large' onClick={handleCancel}>
        Cancel
      </CancelButton>
    </>
  )
}

export default CreatePipelineDetail
