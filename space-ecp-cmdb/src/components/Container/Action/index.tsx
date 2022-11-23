import React from 'react'
import { message, Form } from 'infrad'
import StageModal, { Stage } from 'src/components/Common/StageModal'
import { SduActionTypes, SDU_ACTION_NOTICE } from 'src/constants/container'
import { Sdu } from 'src/components/Container/SduTable'
import RestartEditForm from 'src/components/Container/Action/Restart/EditForm'
import RestartConfirmForm from 'src/components/Container/Action/Restart/ConfirmForm'
import SuspendEditForm from 'src/components/Container/Action/Suspend/EditForm'
import SuspendConfirmForm from 'src/components/Container/Action/Suspend/ConfirmForm'
import StopEditForm from 'src/components/Container/Action/Stop/EditForm'
import StopConfirmForm from 'src/components/Container/Action/Stop/ConfirmForm'
import { fetch } from 'src/rapper'
import { DEPLOY_ENGINE } from 'src/constants/deployment'
import { useRequest } from 'ahooks'
interface IActionProps {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
  actionModalType: SduActionTypes
  initialValues: Sdu
}
export type RestartEditForm = Record<string, string[]>

export type SuspendEditForm = string[]

export type StopEditForm = string[]

type EditFormValues = RestartEditForm | SuspendEditForm | StopEditForm

const Action: React.FC<IActionProps> = (props) => {
  const {
    visible,
    onClose,
    onSuccess: handleActionModalSuccess,
    actionModalType,
    initialValues,
  } = props
  const { sdu: sduName, deployments } = initialValues || {}
  const [stage, setStage] = React.useState<Stage>(Stage.EDIT)
  const [editFormValues, setEditFormValues] = React.useState<EditFormValues>()
  const [nextButtonDisabled, setNextButtonDisabled] = React.useState(true)

  const [editForm] = Form.useForm()
  const handleNextStage = () => {
    setStage(Stage.CONFIRM)
    if (actionModalType === SduActionTypes.RESTART) {
      const restartFormValues = editForm.getFieldsValue()
      setEditFormValues(restartFormValues)
    }
  }

  const getSuspendOrStopEditFormValues = (deployIds: string[]) => {
    const hasCheckedDeployment = deployIds.length !== 0
    setNextButtonDisabled(!hasCheckedDeployment)
    setEditFormValues(deployIds)
  }

  const handleRestartSduSubmit = async () => {
    const deploymentsWithPhases = editFormValues as RestartEditForm

    const checkedDeployments = deployments.filter((deployment) => {
      const { deployId, status } = deployment
      const { containers } = status
      const hasNotCheckedDeployment =
        deploymentsWithPhases[deployId] === undefined ||
        (containers.length !== 0 && deploymentsWithPhases[deployId].length === 0)
      return !hasNotCheckedDeployment
    })

    const checkedDeploymentsPhases = checkedDeployments.map((deployment) => {
      const { deployId, deployEngine } = deployment
      const isBromoDeployment = deployEngine === DEPLOY_ENGINE.BROMO
      const phases = isBromoDeployment ? [] : deploymentsWithPhases[deployId]
      return {
        deployId,
        phases,
      }
    })

    await fetch['POST/api/ecp-cmdb/sdus/{sduName}:restart']({
      sduName,
      deployRestarts: checkedDeploymentsPhases,
    })
  }

  const handleSuspendSduSubmit = async () => {
    await fetch['POST/api/ecp-cmdb/sdus/{sduName}:suspend']({
      sduName,
      deployIds: editFormValues as SuspendEditForm,
    })
  }

  const handleStopSduSubmit = async () => {
    await fetch['POST/api/ecp-cmdb/sdus/{sduName}:stop']({
      sduName,
      deployIds: editFormValues as StopEditForm,
    })
  }

  const handleActionModalClose = () => {
    onClose()
    editForm.resetFields()
    setEditFormValues([])
    setNextButtonDisabled(true)
    setStage(Stage.EDIT)
  }

  const handleCancel = () => {
    handleActionModalClose()
  }

  const handleSduActionSubmitMap = {
    [SduActionTypes.RESTART]: handleRestartSduSubmit,
    [SduActionTypes.SUSPEND]: handleSuspendSduSubmit,
    [SduActionTypes.STOP]: handleStopSduSubmit,
  }

  const { loading, run } = useRequest(handleSduActionSubmitMap[actionModalType], {
    manual: true,
    onSuccess: () => {
      handleActionModalClose()
      message.success(`${actionModalType} successfully`)
      handleActionModalSuccess()
    },
  })

  const handleReturn = () => {
    setStage(Stage.EDIT)
    editForm.setFieldsValue(editFormValues)
  }

  const sduActionModalContentMap = {
    [SduActionTypes.RESTART]: {
      EditForm: (
        <RestartEditForm
          initialValues={initialValues}
          form={editForm}
          onNextButtonDisabled={setNextButtonDisabled}
        />
      ),
      ConfirmForm: (
        <RestartConfirmForm
          initialValues={initialValues}
          restartSduData={editFormValues as RestartEditForm}
        />
      ),
    },
    [SduActionTypes.SUSPEND]: {
      EditForm: (
        <SuspendEditForm
          initialValues={initialValues}
          onGetFormValues={getSuspendOrStopEditFormValues}
          selectedDeploymentIds={editFormValues as SuspendEditForm}
        />
      ),
      ConfirmForm: (
        <SuspendConfirmForm
          initialValues={initialValues}
          suspendSduData={editFormValues as SuspendEditForm}
        />
      ),
    },
    [SduActionTypes.STOP]: {
      EditForm: (
        <StopEditForm
          initialValues={initialValues}
          onGetFormValues={getSuspendOrStopEditFormValues}
          selectedDeploymentIds={editFormValues as StopEditForm}
        />
      ),
      ConfirmForm: (
        <StopConfirmForm
          initialValues={initialValues}
          stopSduData={editFormValues as StopEditForm}
        />
      ),
    },
  }

  return (
    <StageModal
      title={`${actionModalType} SDU`}
      visible={visible}
      stage={stage}
      onCancel={handleCancel}
      nextButtonDisabled={nextButtonDisabled}
      onNextStage={handleNextStage}
      onReturn={handleReturn}
      onConfirm={run}
      loading={loading}
      handbookLink="https://confluence.shopee.io/pages/viewpage.action?pageId=1084134803"
      notice={
        actionModalType === SduActionTypes.STOP ? (
          <div style={{ whiteSpace: 'pre-line' }}>
            {SDU_ACTION_NOTICE[actionModalType]?.description}
          </div>
        ) : (
          SDU_ACTION_NOTICE[actionModalType]?.description
        )
      }
      noticeType={SDU_ACTION_NOTICE[actionModalType]?.type}
      width={actionModalType === SduActionTypes.RESTART ? 800 : 1024}
    >
      <div style={{ marginTop: '32px' }}>
        {stage === Stage.EDIT
          ? sduActionModalContentMap[actionModalType]?.EditForm
          : sduActionModalContentMap[actionModalType]?.ConfirmForm}
      </div>
    </StageModal>
  )
}

export default Action
