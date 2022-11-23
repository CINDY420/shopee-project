import * as React from 'react'
import { message, Modal } from 'infrad'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import BatchOperations from 'components/Common/BatchOperations'
import { HPA_BATCH_ACTIONS, IBatchEditingContext } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA'
import { hpaControllerDeleteHpa, hpaControllerDisableHpa, hpaControllerEnableHpa } from 'swagger-api/v1/apis/Hpa'
import { IGetApplicationResponse } from 'swagger-api/v1/models'

interface IProps {
  application: IGetApplicationResponse
  batchEditingContext: IBatchEditingContext
  onCancel: () => void
  onSuccess: () => void
}

const HPABatchOperations: React.FC<IProps> = ({ application, batchEditingContext, onCancel, onSuccess }) => {
  const { isBatchEditing, batchEditingType, selectedRows } = batchEditingContext

  const BATCH_ACTION_CONTENT_MAP = React.useMemo(
    () => ({
      [HPA_BATCH_ACTIONS.ENABLE]: 'enable',
      [HPA_BATCH_ACTIONS.DISABLE]: 'disable',
      [HPA_BATCH_ACTIONS.DELETE]: 'delete'
    }),
    []
  )

  const BATCH_ACTION_FETCH_FN_MAP = React.useMemo(
    () => ({
      [HPA_BATCH_ACTIONS.ENABLE]: hpaControllerEnableHpa,
      [HPA_BATCH_ACTIONS.DISABLE]: hpaControllerDisableHpa,
      [HPA_BATCH_ACTIONS.DELETE]: hpaControllerDeleteHpa
    }),
    []
  )

  const confirm = React.useCallback(
    () =>
      Modal.confirm({
        title: 'Notification',
        icon: <ExclamationCircleOutlined />,
        content: `Are you sure ${BATCH_ACTION_CONTENT_MAP[batchEditingType]} these alert rules?`,
        okText: 'Confirm',
        cancelText: 'Cancel',
        async onOk() {
          const { tenantId, projectName, name } = application
          const fetchFn = BATCH_ACTION_FETCH_FN_MAP[batchEditingType]

          try {
            await fetchFn({
              tenantId,
              projectName,
              appName: name,
              payload: {
                hpas: selectedRows
              }
            })
            message.success(`${BATCH_ACTION_CONTENT_MAP[batchEditingType]} these HPA rules successful!`)
            onSuccess && onSuccess()
          } catch (err) {
            err?.message && message.error(err?.message)
          }
        }
      }),
    [BATCH_ACTION_CONTENT_MAP, BATCH_ACTION_FETCH_FN_MAP, application, batchEditingType, onSuccess, selectedRows]
  )

  const handleSubmit = React.useCallback(() => {
    confirm()
  }, [confirm])

  return (
    <BatchOperations
      title={batchEditingType}
      visible={isBatchEditing === true}
      selectedCount={selectedRows.length}
      disabled={selectedRows.length === 0}
      onSubmit={handleSubmit}
      onCancel={() => onCancel()}
    />
  )
}

export default HPABatchOperations
