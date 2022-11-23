import React from 'react'
import BatchOperations from 'components/Common/BatchOperations'
import { DownOutlined } from 'infra-design-icons'
import { Button, Dropdown, Menu } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import BatchOperationTable from 'components/App/ResourceManagement/common/BatchOperation/BatchOperationTable'
import BatchEdit, { IFormItemData } from 'components/App/ResourceManagement/common/BatchOperation/BatchEdit'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'constants/accessControl'
import { GetRowKey } from 'infrad/lib/table/interface'

export enum BATCH_OPERATION {
  BATCH_EDIT = 'Batch Edit',
  BATCH_DELETE = 'Batch Delete',
  BATCH_DOWNLOAD = 'Batch Download',
  BATCH_DOWNLOAD_ALL = 'Batch Download All'
}

const UNCHECKABLE_OPERATION = [BATCH_OPERATION.BATCH_DOWNLOAD_ALL]

interface IBatchOperationProps<DataType = any> {
  batchOperationVisible: boolean
  onBatchOperationVisibleChange: (selectable: boolean) => void
  selectedTableRows: DataType[]
  columns?: ColumnsType<DataType>
  rowKey: string | GetRowKey<DataType>
  operationList?: BATCH_OPERATION[]
  formItemDataList?: IFormItemData[]
  submitOperationMapping?: Partial<Record<BATCH_OPERATION, (...argument: unknown[]) => void>>
}

const BatchOperation: React.FC<IBatchOperationProps> = ({
  batchOperationVisible,
  onBatchOperationVisibleChange,
  selectedTableRows = [],
  columns = [],
  rowKey,
  operationList = Object.values(BATCH_OPERATION),
  formItemDataList = [],
  submitOperationMapping
}) => {
  const [operationType, setOperationType] = React.useState<BATCH_OPERATION>(BATCH_OPERATION.BATCH_EDIT)
  const [editModalVisible, setEditModalVisible] = React.useState(false)
  const [dataTableModalVisible, setDataTableModalVisible] = React.useState(false)

  const accessControlContext = React.useContext(AccessControlContext)
  const opsPermissions = accessControlContext[RESOURCE_TYPE.OPS] || []
  const canBatchEdit = opsPermissions.includes(RESOURCE_ACTION.BatchEdit)
  const canBatchDelete = opsPermissions.includes(RESOURCE_ACTION.BatchDelete)

  const BATCH_OPERATION_CONFIRM_MAPPING = {
    [BATCH_OPERATION.BATCH_EDIT]: setEditModalVisible,
    [BATCH_OPERATION.BATCH_DOWNLOAD]: setDataTableModalVisible,
    [BATCH_OPERATION.BATCH_DELETE]: setDataTableModalVisible
  }

  const BATCH_OPERATION_PERMISSION_MAPPING = {
    [BATCH_OPERATION.BATCH_EDIT]: canBatchEdit,
    [BATCH_OPERATION.BATCH_DELETE]: canBatchDelete,
    [BATCH_OPERATION.BATCH_DOWNLOAD]: true,
    [BATCH_OPERATION.BATCH_DOWNLOAD_ALL]: true
  }

  const handleMenuClick = (item: BATCH_OPERATION) => {
    if (UNCHECKABLE_OPERATION.includes(item)) {
      submitOperationMapping[item]()
    } else {
      setOperationType(item)
      onBatchOperationVisibleChange?.(true)
    }
  }

  const renderBulkOperationMenu = () => (
    <Menu>
      {operationList.map(item => (
        <Menu.Item
          key={item}
          onClick={() => handleMenuClick(item)}
          disabled={!BATCH_OPERATION_PERMISSION_MAPPING[item]}
        >
          {item}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <>
      {operationList?.length === 1 ? (
        <Button
          type='primary'
          disabled={batchOperationVisible || !BATCH_OPERATION_PERMISSION_MAPPING[operationList?.[0]]}
          onClick={() => handleMenuClick(operationList?.[0])}
        >
          {operationList?.[0]}
        </Button>
      ) : (
        <Dropdown overlay={renderBulkOperationMenu()} disabled={batchOperationVisible}>
          <Button type='primary'>
            Batch Operation <DownOutlined />
          </Button>
        </Dropdown>
      )}
      <BatchOperations
        disabled={selectedTableRows.length === 0}
        visible={batchOperationVisible}
        title={operationType}
        selectedCount={selectedTableRows.length}
        onSubmit={() => BATCH_OPERATION_CONFIRM_MAPPING[operationType](true)}
        onCancel={() => onBatchOperationVisibleChange?.(false)}
      />
      <BatchEdit
        modalVisible={editModalVisible}
        onVisibleChange={setEditModalVisible}
        selectedTableRows={selectedTableRows}
        formItemDataList={formItemDataList}
        columns={columns}
        rowKey={rowKey}
        onSubmit={submitOperationMapping?.[operationType]}
        cancelBatchOperation={() => onBatchOperationVisibleChange?.(false)}
      />
      <BatchOperationTable
        operationType={operationType}
        modalVisible={dataTableModalVisible}
        onVisibleChange={setDataTableModalVisible}
        selectedTableRows={selectedTableRows}
        columns={columns}
        rowKey={rowKey}
        onSubmit={submitOperationMapping?.[operationType]}
        cancelBatchOperation={() => onBatchOperationVisibleChange?.(false)}
      />
    </>
  )
}

export default BatchOperation
