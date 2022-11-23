import { Modal } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import React from 'react'
import { StyledTable } from 'components/App/ResourceManagement/common/BatchOperation/BatchOperationTable/style'
import { GetRowKey } from 'infrad/lib/table/interface'
import { BATCH_OPERATION } from 'components/App/ResourceManagement/common/BatchOperation'

interface IBatchOperationTableProps<DataType = any> {
  operationType: BATCH_OPERATION
  selectedTableRows: DataType[]
  columns: ColumnsType<DataType>
  rowKey: string | GetRowKey<DataType>
  modalVisible: boolean
  onVisibleChange: (visible: boolean) => void
  onSubmit: (callback: () => void) => void
  cancelBatchOperation: () => void
}

const BatchOperationTable: React.FC<IBatchOperationTableProps> = ({
  operationType,
  selectedTableRows,
  columns,
  rowKey,
  modalVisible,
  onVisibleChange,
  onSubmit,
  cancelBatchOperation
}) => {
  const handleConfirm = () => {
    onSubmit(() => {
      onVisibleChange(false)
      cancelBatchOperation()
    })
  }

  return (
    <Modal
      title={operationType}
      visible={modalVisible}
      getContainer={() => document.body}
      width={940}
      okText='Confirm'
      onCancel={() => onVisibleChange(false)}
      onOk={handleConfirm}
    >
      <StyledTable
        columns={columns}
        rowKey={rowKey}
        dataSource={selectedTableRows}
        pagination={false}
        scroll={{ y: 332 }}
      />
    </Modal>
  )
}

export default BatchOperationTable
