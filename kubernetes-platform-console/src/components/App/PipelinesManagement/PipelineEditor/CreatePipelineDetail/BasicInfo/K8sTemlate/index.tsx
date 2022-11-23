import React from 'react'
import { StyledForm } from './style'
import { Input, Radio, Select } from 'infrad'
import { IConfig } from 'api/types/application/pipeline'
import { INTEGER_NUMBER, INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE, PERCENTAGE } from 'helpers/validate'
import { DEFAULT_PLATFORM_CLUSTER, ENV } from 'constants/pipeline'
const { Item } = StyledForm
interface IK8sTemplateProps {
  isEdit: boolean
  config: IConfig
  selectedEnvList: string[]
  clusterList: string[]
}
const Option = Select.Option
const booleanOptions = [
  { label: 'True', value: true },
  { label: 'False', value: false }
]
const convertStringToBoolean = string => {
  return string === 'true'
}

const displayCluster = (env: string) => {
  return env === ENV.LIVE || env === ENV.LIVEISH ? DEFAULT_PLATFORM_CLUSTER.LIVE : DEFAULT_PLATFORM_CLUSTER.TEST
}

const K8sTemplate: React.FC<IK8sTemplateProps> = ({ isEdit, config, selectedEnvList, clusterList }) => {
  return (
    <>
      <Item
        label='DEPLOY_DEFINITION'
        name={['config', 'deployDefinition']}
        colon={false}
        rules={[{ required: true }]}
        initialValue={isEdit ? config.DEPLOY_DEFINITION || '' : ''}
      >
        <Input style={{ width: 480 }} />
      </Item>

      <Item
        label='DEPLOY_TO_K8S'
        name={['config', 'deployToK8s']}
        initialValue={isEdit ? convertStringToBoolean(config.DEPLOY_TO_K8S) : true}
        colon={false}
      >
        <Radio.Group options={booleanOptions} />
      </Item>

      <Item
        label='K8S_REPLICAS'
        name={['config', 'k8sReplicas']}
        initialValue={isEdit ? parseInt(config.K8S_REPLICAS) || 1 : 1}
        colon={false}
        rules={[
          {
            pattern: INTEGER_NUMBER,
            message: 'Please input an integer'
          }
        ]}
      >
        <Input style={{ width: 240 }} />
      </Item>

      <Item
        label='K8S_MAX_SURGE'
        name={['config', 'k8sMaxSurge']}
        initialValue={isEdit ? config.K8S_MAX_SURGE || '25%' : '25%'}
        colon={false}
        rules={[
          {
            pattern: INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE,
            message: 'Invalid format'
          }
        ]}
      >
        <Input style={{ width: 240 }} />
      </Item>

      <Item
        label='K8S_MAX_UNAVALIABLE'
        name={['config', 'k8sMaxUnavailable']}
        initialValue={isEdit ? config.K8S_MAX_UNAVAILABLE || '25%' : '25%'}
        colon={false}
        rules={[
          {
            pattern: INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE,
            message: 'Invalid format'
          }
        ]}
      >
        <Input style={{ width: 240 }} />
      </Item>

      <Item
        label='K8S_MESOSZK'
        name={['config', 'k8sMesosZK']}
        initialValue={isEdit ? convertStringToBoolean(config.K8S_MESOSZK) : false}
        colon={false}
      >
        <Radio.Group options={booleanOptions} />
      </Item>

      <Item
        label='DEPLOY_TO_K8S_ONLY'
        name={['config', 'deployToK8sOnly']}
        initialValue={isEdit ? convertStringToBoolean(config.DEPLOY_TO_K8S_ONLY) : true}
        colon={false}
      >
        <Radio.Group options={booleanOptions} />
      </Item>

      <Item
        label='K8S_USE_ACTUAL_IDC'
        name={['config', 'k8sUseActualIDC']}
        initialValue={isEdit ? convertStringToBoolean(config.K8S_USE_ACTUAL_IDC) : false}
        colon={false}
      >
        <Radio.Group options={booleanOptions} />
      </Item>

      <Item
        label='K8S_KEEP_SMB_SMOKE'
        name={['config', 'k8sKeepSMBSmoke']}
        initialValue={isEdit ? convertStringToBoolean(config.K8S_KEEP_SMB_SMOKE) : false}
        colon={false}
      >
        <Radio.Group options={booleanOptions} />
      </Item>

      <Item
        label='K8S_CANARY_REPLICAS'
        name={['config', 'k8sCanaryReplicas']}
        initialValue={isEdit ? parseInt(config.K8S_CANARY_REPLICAS) || 1 : 1}
        colon={false}
        rules={[
          {
            pattern: INTEGER_NUMBER,
            message: 'Please Input an integer'
          }
        ]}
      >
        <Input style={{ width: 240 }} />
      </Item>

      <Item
        label='K8S_CANARY_PERCENTAGE'
        name={['config', 'k8sCanaryPercentage']}
        initialValue={isEdit ? config.K8S_CANARY_PERCENTAGE || '25%' : '25%'}
        colon={false}
        rules={[
          {
            pattern: PERCENTAGE,
            message: 'Invalid format'
          }
        ]}
      >
        <Input style={{ width: 240 }} />
      </Item>

      <Item
        label='TERMINATION_GRACE_PERIOD_SECONDS'
        name={['config', 'terminationGracePeriodSeconds']}
        initialValue={isEdit ? parseInt(config.TERMINATION_GRACE_PERIOD_SECONDS) || 30 : 30}
        colon={false}
        rules={[
          {
            pattern: INTEGER_NUMBER,
            message: 'Please Input an integer'
          }
        ]}
      >
        <Input style={{ width: 240 }} />
      </Item>

      {selectedEnvList.map(env => (
        <Item
          key={env}
          label={`PLATFORMCLUSTER (${env})`}
          name={['config', 'platformCluster', env]}
          colon={false}
          initialValue={isEdit ? config.PLATFORMCLUSTER || displayCluster(env) : displayCluster(env)}
        >
          <Select style={{ width: 400 }} showSearch>
            {clusterList.map(cluster => (
              <Option key={cluster} value={cluster}>
                {cluster}
              </Option>
            ))}
          </Select>
        </Item>
      ))}

      <Item
        label='EXTRA_HOSTS'
        name={['config', 'extraHosts']}
        initialValue={isEdit ? config.EXTRA_HOSTS || '' : ''}
        colon={false}
      >
        <Input.TextArea rows={1} placeholder='Input a value' style={{ width: 480 }} />
      </Item>
    </>
  )
}

export default K8sTemplate
