import React, { useState, useCallback, useEffect } from 'react'
import { HPA_RULE_DRAWER_TYPE } from 'constants/application'
import { Form, FormProps, Switch, Cascader } from 'infrad'
import { StatusWrapper } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer/CreateEditRuleForm/style'
import { sduControllerListAllAzSdus } from 'swagger-api/v1/apis/SDU'
import { IAzSdu, IGetApplicationResponse } from 'swagger-api/v1/models'
import { useRecoilValue } from 'recoil'
import { selectedApplication } from 'states/applicationState/application'

import RulesItem from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/RulesItem'
import ScaleDirectionItem from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/ScaleDirectionItem'
import { ICreateEditRuleFormValues } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer/CreateEditRuleForm/interface'
import Threshold from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/Threshold'
import NotifyChannel from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/NotifyChannel'
import { hpaControllerGetHpaDefaultConfig } from 'swagger-api/v1/apis/Hpa'

const { Item } = Form

interface ICreateEditRuleForm extends FormProps {
  crudType: HPA_RULE_DRAWER_TYPE
  initialValues?: ICreateEditRuleFormValues
}

const CreateEditRuleForm: React.FC<ICreateEditRuleForm> = props => {
  const { crudType, form, onFieldsChange, initialValues } = props
  const application: IGetApplicationResponse = useRecoilValue(selectedApplication)
  const { name: appName, tenantId, projectName } = application
  const [azSdus, setAzSdus] = useState<IAzSdu[]>([])
  const [formEdited, setFormEdited] = useState(false)

  const [formValues, setFormValues] = useState<ICreateEditRuleFormValues>()

  const getAzSdusFn = useCallback(async () => {
    const { items: allAzSdus = [] } = await sduControllerListAllAzSdus({ tenantId, projectName, appName })
    setAzSdus(allAzSdus)
  }, [appName, projectName, tenantId])
  useEffect(() => {
    getAzSdusFn()
    // update form values manually if the form has not been edited
    if (!formEdited) {
      form.setFieldsValue(initialValues)
      setFormValues(initialValues)
    }
  }, [form, formEdited, getAzSdusFn, initialValues])

  const options = azSdus.map(({ azName, sdus }) => {
    return {
      value: azName,
      label: azName,
      children: sdus.map(({ sduName, hasHpa }) => ({
        value: sduName,
        label: sduName,
        disabled: hasHpa
      }))
    }
  })

  const createInitialValues: ICreateEditRuleFormValues = {
    deployment: undefined,
    notifyChannels: [''],
    rules: {
      // default should selected
      autoscalingRulesSelected: true,
      autoscalingRules: undefined,
      // default should selected
      cronRulesSelected: true,
      cronRules: undefined
    },
    autoscalingLogic: 'or',
    // v1.20 does not support editing stabilizationWindowSeconds, notifyFailed when create
    scaleDirection: {
      scaleUp: {
        stabilizationWindowSeconds: undefined,
        notifyFailed: true,
        selected: true
      },
      scaleDown: {
        stabilizationWindowSeconds: undefined,
        notifyFailed: true,
        selected: true
      }
    },
    threshold: {
      maxReplicaCount: undefined,
      minReplicaCount: undefined
    },
    status: false
  }

  const selectedDeployment = form.getFieldValue('deployment')
  const getHpaDefaultConfig = React.useCallback(async () => {
    if (selectedDeployment !== undefined && crudType === HPA_RULE_DRAWER_TYPE.CREATE) {
      const az = selectedDeployment[0]
      const sdu = selectedDeployment[1]
      const { scaleDirection } = await hpaControllerGetHpaDefaultConfig({ tenantId, projectName, appName, az, sdu })
      setFormValues((pre: ICreateEditRuleFormValues) => {
        return { ...pre, scaleDirection }
      })
    }
  }, [appName, crudType, projectName, selectedDeployment, tenantId])

  React.useEffect(() => {
    getHpaDefaultConfig()
  }, [getHpaDefaultConfig])

  const handleValuesChange: FormProps['onValuesChange'] = (_, values) => {
    setFormValues(values)
  }
  // will be triggered when values changed or rules validated
  const handleFieldsChange: FormProps['onFieldsChange'] = (...args) => {
    setFormEdited(true)
    onFieldsChange(...args)
  }

  return (
    <Form
      layout='vertical'
      name='hpaRule'
      initialValues={crudType === HPA_RULE_DRAWER_TYPE.EDIT ? initialValues : createInitialValues}
      onFieldsChange={handleFieldsChange}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Item label='Deployment' name='deployment' rules={[{ required: true }]}>
        <Cascader disabled={crudType === HPA_RULE_DRAWER_TYPE.EDIT} options={options} placeholder='Please select' />
      </Item>
      <NotifyChannel label='Notify Channel' form={form} required />
      <RulesItem label='Rules' fatherNamePath={['rules']} required form={form} triggerRules={formValues?.rules} />
      <Threshold label='Threshold' form={form} fatherNamePath={['threshold']} crudType={crudType} required />
      <ScaleDirectionItem
        label='Scale Direction'
        form={form}
        fatherNamePath={['scaleDirection']}
        required
        crudType={crudType}
        triggerRules={formValues?.scaleDirection}
      />
      <StatusWrapper>
        <Item label='Status' name='status' valuePropName='checked'>
          <Switch />
        </Item>
      </StatusWrapper>
    </Form>
  )
}

export default CreateEditRuleForm
