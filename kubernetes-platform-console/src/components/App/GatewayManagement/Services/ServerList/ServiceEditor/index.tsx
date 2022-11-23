import * as React from 'react'
import { Form, message } from 'infrad'

import { IServiceInfoV2 } from 'api/types/application/service'
import { IIUpdateServicePlayLoad } from 'swagger-api/v3/models'
import { projectsControllerGetClusterListByConfigInfo } from 'swagger-api/v3/apis/Projects'
import {
  servicesControllerUpdateService,
  servicesControllerCreateService,
  servicesControllerGetServiceDetail
} from 'swagger-api/v3/apis/Services'
import CrudDrawer from 'components/Common/CrudDrawer'

import ServiceForm from './ServiceForm'

interface IBaseInfo {
  tenantId: number
  projectName: string
  service: IServiceInfoV2
  envs: string[]
  cids: string[]
}
interface IServiceEditorProps {
  visible: boolean
  onChangeVisible: (visible: boolean) => void
  onCallback?: () => void
  isEdit?: boolean
  baseInfo: IBaseInfo
}

const ServiceEditor: React.FC<IServiceEditorProps> = props => {
  const [form] = Form.useForm()
  const { visible, onChangeVisible, onCallback, isEdit, baseInfo } = props
  const { tenantId, projectName, service, cids, envs } = baseInfo || {}
  const { name: serviceName = '', clusterName = '' } = service || {}
  const [serviceDetail, setServiceDetail] = React.useState<IIUpdateServicePlayLoad>(null)
  const [formField, setFormField] = React.useState([])
  const [clusters, setClusters] = React.useState([])

  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true)

  const onOk = async () => {
    try {
      const values = await form.validateFields()
      let result = null
      const selector = values.selector

      if (selector) {
        values.selector = selector.filter(item => item.key && item.value)
      }

      if (isEdit) {
        result = await servicesControllerUpdateService({
          tenantId,
          project: projectName,
          svc: serviceName,
          payload: values
        })
      } else {
        result = await servicesControllerCreateService({
          tenantId,
          project: projectName,
          payload: values
        })
      }

      if (result) {
        message.success('success')
        onChangeVisible(false)

        if (onCallback) {
          onCallback()
        }
      }
    } catch (err) {
      console.error('error: ', err)
      message.error(err.message)
    }
  }

  const getService = React.useCallback(async () => {
    try {
      const result = await servicesControllerGetServiceDetail({
        tenantId,
        projectName,
        serviceName,
        cluster: clusterName
      })

      setServiceDetail(result)
      // set cluster
      setFormField([])
    } catch (err) {
      message.error(err.message)
    }
  }, [setServiceDetail, tenantId, projectName, serviceName, clusterName])

  React.useEffect(() => {
    if (isEdit) {
      getService()
    }
  }, [isEdit, getService])

  const getCluster = React.useCallback(async () => {
    const { getFieldsValue } = form

    const { env, cid } = getFieldsValue(['env', 'cid'])

    const result = await projectsControllerGetClusterListByConfigInfo({
      tenantId,
      projectName,
      environments: env,
      cids: cid
    })

    if (result && result.clusterIds) {
      setClusters(result.clusterIds)
    }
  }, [setClusters, tenantId, projectName, form])

  React.useEffect(() => {
    if (formField.length) {
      const { getFieldsValue } = form
      const { env = [], cid = [] } = getFieldsValue(['env', 'cid'])

      env.length && cid.length && getCluster()
    }
  }, [formField, getCluster, form])

  return (
    <CrudDrawer
      title={isEdit ? 'Edit Service' : 'Create Service'}
      visible={visible}
      onCancel={() => onChangeVisible(false)}
      onSubmit={onOk}
      body={
        <ServiceForm
          isEdit={isEdit}
          form={form}
          onChangeSubmitDisabled={(disabled: boolean) => setIsSubmitDisabled(disabled)}
          onFormFieldChange={(fields: []) => setFormField(fields)}
          currentService={serviceDetail}
          info={{
            clusters,
            cids,
            envs
          }}
        />
      }
      closeDrawer={() => onChangeVisible(false)}
      isSubmitDisabled={isSubmitDisabled}
    />
  )
}

export default ServiceEditor
