import React, { useState, useMemo } from 'react'
import CrudDrawer from 'components/Common/CrudDrawer'
import CreateEditRuleForm from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer/CreateEditRuleForm'
import { HPA_RULE_DRAWER_TYPE } from 'constants/application'
import { Form, message } from 'infrad'

import { hpaControllerCreateHpa, hpaControllerUpdateHpa } from 'swagger-api/v1/apis/Hpa'
import { useRecoilValue } from 'recoil'
import { selectedApplication } from 'states/applicationState/application'
import { IGetApplicationResponse, IHPAWithId, IHpaMeta, IHpaSpec } from 'swagger-api/v1/models'
import { ICreateEditRuleFormValues } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer/CreateEditRuleForm/interface'
import {
  extractCronRulesFromForm,
  formatCronRulesToForm
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/helper/cronRules'
import { DrawerSubTitle } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer/style'

const drawerTypeTitleMap = {
  [HPA_RULE_DRAWER_TYPE.CREATE]: 'Create HPA Rule',
  [HPA_RULE_DRAWER_TYPE.EDIT]: 'Edit HPA Rule',
  [HPA_RULE_DRAWER_TYPE.COPY]: 'Copy HPA Rule to'
}

const HPA_USER_MANUAL_LINK = 'https://confluence.shopee.io/pages/viewpage.action?pageId=1111663706'

interface IRuleCrudDrawer {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
  crudType: HPA_RULE_DRAWER_TYPE
  // initialValues is must if crudType is edit or copy
  initialValues?: IHPAWithId
}

// form values depends on html tags, they can be any
const extractCreateEditValuesFromForm = (formValues: ICreateEditRuleFormValues): { meta: IHpaMeta; spec: IHpaSpec } => {
  const { deployment = [], notifyChannels, rules, scaleDirection, autoscalingLogic, threshold, status } = formValues
  // infrad Cascader value is [azName, sduName]
  const [azName, sduName] = deployment

  const meta = { az: azName, sdu: sduName }
  const { autoscalingRules, cronRules: formCronRules = [] } = rules || {}
  const cronRules = extractCronRulesFromForm(formCronRules)

  const spec: IHpaSpec = {
    notifyChannels,
    autoscalingLogic,
    rules: { autoscalingRules, cronRules },
    scaleDirection,
    threshold,
    status
  }

  return { meta, spec }
}

const RuleCrudDrawer: React.FC<IRuleCrudDrawer> = props => {
  const { visible, onClose, onSuccess, crudType, initialValues } = props
  const { meta, spec, id: hpaId } = initialValues || {}
  const { az, sdu } = meta || {}
  const { notifyChannels, rules, scaleDirection, autoscalingLogic, threshold, status } = spec || {}
  const { autoscalingRules = [], cronRules = [] } = rules || {}
  const formCronRules = formatCronRulesToForm(cronRules)
  const editFormInitialValues: ICreateEditRuleFormValues = useMemo(
    () => ({
      deployment: [az, sdu],
      notifyChannels,
      rules: {
        autoscalingRulesSelected: autoscalingRules.length > 0,
        cronRulesSelected: cronRules.length > 0,
        autoscalingRules,
        cronRules: formCronRules
      },
      scaleDirection,
      autoscalingLogic,
      threshold,
      status
    }),
    [
      autoscalingLogic,
      autoscalingRules,
      az,
      cronRules,
      formCronRules,
      notifyChannels,
      scaleDirection,
      sdu,
      threshold,
      status
    ]
  )
  const [createHpaForm] = Form.useForm<ICreateEditRuleFormValues>()
  const [editHpaForm] = Form.useForm()

  const application: IGetApplicationResponse = useRecoilValue(selectedApplication)
  const { name: appName, tenantId, projectName } = application

  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const handleFieldsChange = () => setSubmitDisabled(false)
  const handleDrawerClose = () => {
    createHpaForm.resetFields()
    editHpaForm.resetFields()
    setSubmitDisabled(true)
    onClose()
  }

  const drawerTypeFormMap = useMemo(
    () => ({
      [HPA_RULE_DRAWER_TYPE.CREATE]: (
        <CreateEditRuleForm form={createHpaForm} crudType={crudType} onFieldsChange={handleFieldsChange} />
      ),
      [HPA_RULE_DRAWER_TYPE.EDIT]: (
        <CreateEditRuleForm
          form={editHpaForm}
          crudType={crudType}
          onFieldsChange={handleFieldsChange}
          initialValues={editFormInitialValues}
        />
      )
    }),
    [createHpaForm, crudType, editHpaForm, editFormInitialValues]
  )

  const handleCreateSubmit = async () => {
    const values = await createHpaForm.validateFields()
    const { meta, spec } = extractCreateEditValuesFromForm(values)

    setSubmitLoading(true)
    try {
      await hpaControllerCreateHpa({
        tenantId,
        projectName,
        appName,
        payload: { meta, spec }
      })
      message.success('Create hpa rule successfully!')
      onSuccess()
      handleDrawerClose()
    } catch (err) {
      err?.message && message.error(err?.message)
    }
    setSubmitLoading(false)
  }
  const handleEditSubmit = async () => {
    const values = await editHpaForm.validateFields()
    const { meta, spec } = extractCreateEditValuesFromForm(values)

    setSubmitLoading(true)
    try {
      await hpaControllerUpdateHpa({
        tenantId,
        projectName,
        appName,
        payload: { meta, spec, id: hpaId }
      })
      message.success('Edit hpa rule successfully!')
      onSuccess()
      handleDrawerClose()
    } catch (err) {
      err?.message && message.error(err?.message)
    }
    setSubmitLoading(false)
  }
  const typeHandleDrawerSubmitMap = {
    [HPA_RULE_DRAWER_TYPE.CREATE]: handleCreateSubmit,
    [HPA_RULE_DRAWER_TYPE.EDIT]: handleEditSubmit
  }

  const title = (
    <>
      <div>{drawerTypeTitleMap[crudType]}</div>
      <DrawerSubTitle>
        Click{' '}
        <a href={HPA_USER_MANUAL_LINK} target='_blank'>
          here
        </a>{' '}
        to view User Manual
      </DrawerSubTitle>
    </>
  )

  return (
    <>
      <CrudDrawer
        visible={visible}
        title={title}
        body={drawerTypeFormMap[crudType]}
        isSubmitDisabled={submitDisabled}
        closeDrawer={handleDrawerClose}
        onSubmit={typeHandleDrawerSubmitMap[crudType]}
        destroyOnClose={true}
        isLoading={submitLoading}
      />
    </>
  )
}

export default RuleCrudDrawer
