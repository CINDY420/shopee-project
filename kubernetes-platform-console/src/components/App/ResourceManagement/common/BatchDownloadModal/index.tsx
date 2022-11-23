import { Modal, ModalProps, Table, TableProps } from 'infrad'
import * as React from 'react'

interface IBatchDownloadModalProps<RecordType = any> extends ModalProps {
  columns: TableProps<RecordType>['columns']
  dataSource: TableProps<RecordType>['dataSource']
}

const BatchDownloadModal: React.FC<IBatchDownloadModalProps> = ({ columns, dataSource, ...otherProps }) => {
  return (
    <Modal title='Download' getContainer={() => document.body} okText='Confirm' {...otherProps}>
      <h3 style={{ marginBottom: '12px' }}>Affected items</h3>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </Modal>
  )
}

export default BatchDownloadModal
