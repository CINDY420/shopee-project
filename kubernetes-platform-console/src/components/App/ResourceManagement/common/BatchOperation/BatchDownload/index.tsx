import { Modal } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import React from 'react'
import { StyledTable } from 'components/App/ResourceManagement/common/BatchOperation/BatchDownload/style'
import { GetRowKey } from 'infrad/lib/table/interface'

interface IBatchDownloadProps<DataType = any> {
  selectedTableRows: DataType[]
  columns: ColumnsType<DataType>
  rowKey: string | GetRowKey<DataType>
  modalVisible: boolean
  onVisibleChange: (visible: boolean) => void
  onSubmit: (callback: () => void) => void
  cancelBatchOperation: () => void
}

const BatchDownload: React.FC<IBatchDownloadProps> = ({
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
      title='Batch Download'
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

export default BatchDownload
