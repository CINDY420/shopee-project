import { useState, useContext } from 'react'
import { Modal, TableColumnType, Form, Input, message } from 'infrad'
import { IEditedTenantQuota } from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable/QuotaEditItem'
import { Table } from 'src/common-styles/table'
import {
  EnvWrapper,
  UnitWrapper,
  PositiveValueWrapper,
  NegativeValueWrapper,
  TableTitleWrapper,
} from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable/ConfirmModal/style'
import { quotaController_updateTenantsQuota } from 'src/swagger-api/apis/SegmentQuota'
import { HTTPError } from '@space/common-http'
import { SegmentDetailContext } from 'src/components/App/Segment/SegmentDetail/context'
import { envOrderMap } from 'src/constants/quota'
import { GiBToByte } from 'src/helpers/unit'

interface IConfirmModalProps {
  visible: boolean
  editedTenantEnvQuotaList: IEditedTenantQuota[]
  onClose: () => void
  onSubmitSuccess: () => void
}

interface IQuotaDiffRenderProps {
  initialValue: number
  changedValue: number
  totalValue: number
  unit: string
}
const quotaDiffRender = ({
  initialValue,
  changedValue,
  totalValue,
  unit,
}: IQuotaDiffRenderProps) => {
  if (changedValue === 0) return '-'
  const changedValueDisplay =
    changedValue > 0 ? (
      <PositiveValueWrapper>+{changedValue}</PositiveValueWrapper>
    ) : (
      <NegativeValueWrapper>{changedValue}</NegativeValueWrapper>
    )
  return (
    <>
      <div>
        {initialValue} <UnitWrapper>{unit}</UnitWrapper>
      </div>
      <div>
        {changedValueDisplay} <UnitWrapper>{unit}</UnitWrapper>
      </div>
      <div>
        ={totalValue} <UnitWrapper>{unit}</UnitWrapper>
      </div>
    </>
  )
}

const ConfirmModal: React.FC<IConfirmModalProps> = ({
  visible,
  editedTenantEnvQuotaList,
  onClose,
  onSubmitSuccess,
}) => {
  const segmentDetailContext = useContext(SegmentDetailContext)
  const { azKey, segmentKey } = segmentDetailContext

  const columns: TableColumnType<IEditedTenantQuota>[] = [
    {
      title: 'Organization',
      key: 'Organization',
      dataIndex: 'tenantName',
    },
    {
      title: 'Env',
      key: 'env',
      dataIndex: 'env',
      render: (env: string) => <EnvWrapper>{env}</EnvWrapper>,
    },
    {
      title: 'CPU (Quota)',
      key: 'cpu-quota',
      render: (_, { cpuQuota, changedCpuQuota = 0, totalCpuQuota }) =>
        quotaDiffRender({
          initialValue: cpuQuota,
          changedValue: changedCpuQuota,
          totalValue: totalCpuQuota ?? cpuQuota,
          unit: 'Cores',
        }),
    },
    {
      title: 'Memory (Quota)',
      key: 'memory-quota',
      render: (_, { memoryQuota, changedMemoryQuota = 0, totalMemoryQuota }) =>
        quotaDiffRender({
          initialValue: memoryQuota,
          changedValue: changedMemoryQuota,
          totalValue: totalMemoryQuota ?? memoryQuota,
          unit: 'GiB',
        }),
    },
  ]

  const [form] = Form.useForm<{ reason: string }>()
  const [submitting, setSubmitting] = useState(false)

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const handleConfirm = async () => {
    try {
      const formValues = await form.validateFields()
      const updatingTenantQuotaList = editedTenantEnvQuotaList.map(
        ({ tenantId, env, changedCpuQuota, changedMemoryQuota }) => ({
          tenantId,
          env,
          cpuQuota: changedCpuQuota ?? 0,
          memoryQuota: changedMemoryQuota ? GiBToByte(changedMemoryQuota) : 0,
          reason: formValues.reason,
        }),
      )
      setSubmitting(true)
      await quotaController_updateTenantsQuota({
        azKey,
        segmentKey,
        payload: {
          items: updatingTenantQuotaList,
        },
      })

      void message.success('Your change has taken effect.')
      onSubmitSuccess()
      handleClose()
    } catch (error) {
      if (error instanceof HTTPError) {
        void message.error(error.message)
      }
    }
    setSubmitting(false)
  }
  return (
    <Modal
      visible={visible}
      title="Type reason and save change"
      onCancel={handleClose}
      onOk={handleConfirm}
      okText="Confirm"
      width={800}
      okButtonProps={{ loading: submitting }}
    >
      <TableTitleWrapper>Quota Change List</TableTitleWrapper>
      <div style={{ maxHeight: '500px', overflow: 'auto' }}>
        <Table
          rowKey={(record) => `${record.tenantId}-${record.env}`}
          columns={columns}
          dataSource={editedTenantEnvQuotaList.sort((current, next) => {
            if (current.tenantName === next.tenantName) {
              return envOrderMap[current.env] < envOrderMap[next.env] ? -1 : 1
            }
            return current.tenantName < next.tenantName ? -1 : 1
          })}
          pagination={false}
        />
      </div>
      <div style={{ marginTop: '27px' }}>
        <Form layout="vertical" form={form}>
          <Form.Item label="Change Reason" name="reason" rules={[{ required: true }]}>
            <Input.TextArea maxLength={256} showCount allowClear rows={1} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default ConfirmModal
