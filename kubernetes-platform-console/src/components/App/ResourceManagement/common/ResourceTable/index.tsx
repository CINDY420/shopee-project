import { useLocalStorageState } from 'ahooks'
import CustomDisplayItemsModal from 'components/App/ResourceManagement/common/CustomDisplayItemsModal/Index'
import { INCREMENTAL_GROUPS, STOCK_GROUPS } from 'components/App/ResourceManagement/common/ResourceTable/columnGroups'
import { Action, StyledTable } from 'components/App/ResourceManagement/common/ResourceTable/style'
import ResourceTableExpand from 'components/App/ResourceManagement/common/ResourceTableExpand'
import { ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import PromptCreator from 'components/Common/PromptCreator'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'constants/accessControl'
import { RESOURCE_MANAGEMENT_LOCAL_STORAGE_KEYS } from 'constants/localStorage'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'
import { GlobalContext } from 'hocs/useGlobalContext'
import { AccessControlContext } from 'hooks/useAccessControl'
import { CaretDownOutlined, CaretRightOutlined, SettingOutlined } from 'infra-design-icons'
import { FormInstance, message, PaginationProps, Popconfirm, Space, Typography } from 'infrad'
import { ColumnsType, TablePaginationConfig } from 'infrad/lib/table'
import * as React from 'react'
import {
  sduResourceControllerDeleteIncrementEstimate,
  sduResourceControllerEditIncrementEstimate,
  sduResourceControllerEditStockResource
} from 'swagger-api/v1/apis/SduResource'
import { IFrontEndIncrement, IFrontEndStock } from 'swagger-api/v1/models'
import { StringParam, useQueryParam } from 'use-query-params'
import { downloadData } from 'helpers/download'
import { Parser } from 'json2csv'
import { STOCK_DOWNLOAD_DATA_FIELDS } from 'components/App/ResourceManagement/Stock/StockBatchOperation/fields'
import { INCREMENTAL_DOWNLOAD_DATA_FIELDS } from 'components/App/ResourceManagement/Incremental/IncrementalBatchOperation/fields'
import moment from 'moment'
import useAsyncFn from 'hooks/useAsyncFn'
import AddNewEstimatedModal from 'components/App/ResourceManagement/Incremental/AddNewEstimated'
import { RESOURCE_MANAGEMENT_TYPE } from 'components/App/ResourceManagement'

interface IResourceTableProps {
  loading: boolean
  resourceType: RESOURCE_MANAGEMENT_TYPE
  dataSource: IFrontEndStock[] | IFrontEndIncrement[]
  dataColumns: ColumnsType
  isBatchOperating: boolean
  setSelectedRows:
    | React.Dispatch<React.SetStateAction<IFrontEndStock[]>>
    | React.Dispatch<React.SetStateAction<IFrontEndIncrement[]>>
  selectedRows: IFrontEndStock[] | IFrontEndIncrement[]
  isViewAllDetails?: boolean
  onChange?: any
  pagination?: TablePaginationConfig
  refresh: (fromBeginning?: boolean, targetPagination?: PaginationProps) => void
}

const { Prompt } = PromptCreator({
  content: "The changes you made haven't been saved."
})
const getInitialExpandedRowKeys = (dataSource: IFrontEndStock[] | IFrontEndIncrement[], isViewAllDetails: boolean) => {
  return isViewAllDetails
    ? (dataSource as Array<IFrontEndStock | IFrontEndIncrement>).map(data => data.metaData.id)
    : []
}
const ResourceTable: React.FC<IResourceTableProps> = ({
  loading,
  resourceType,
  dataColumns,
  dataSource,
  isBatchOperating,
  selectedRows,
  setSelectedRows,
  isViewAllDetails,
  onChange: handleTableChange,
  pagination,
  refresh
}) => {
  const accessControlContext = React.useContext(AccessControlContext)
  const opsPermissions = accessControlContext[RESOURCE_TYPE.OPS] || []
  const canEdit = opsPermissions.includes(RESOURCE_ACTION.Edit)
  const canDelete = opsPermissions.includes(RESOURCE_ACTION.Delete)
  const canDuplicate = opsPermissions.includes(RESOURCE_ACTION.AddNewEstimates)

  const [isAddNewEstimatedModalVisible, setAddNewEstimatedModalVisible] = React.useState(false)
  const [duplicateRecord, setDuplicateRecord] = React.useState<IFrontEndIncrement>()
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<string[]>([])

  const { state: GlobalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = GlobalContextState || {}
  const isPlatformAdmin = userRoles.some(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)

  const { state } = React.useContext(ResourceContext)
  const { cids, azs, envs, clusters, segments, machineModels } = state
  const getStockGroups = React.useCallback(() => {
    return STOCK_GROUPS(envs, machineModels, isPlatformAdmin)
  }, [envs, isPlatformAdmin, machineModels])

  const getIncrementGroups = React.useCallback(() => {
    return INCREMENTAL_GROUPS(cids, azs, envs, clusters, segments, machineModels, isPlatformAdmin)
  }, [azs, cids, envs, clusters, segments, isPlatformAdmin, machineModels])

  const [currentGroups, setCurrentGroups] = React.useState(
    resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL ? getIncrementGroups() : getStockGroups()
  )
  React.useEffect(() => {
    setCurrentGroups(resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL ? getIncrementGroups() : getStockGroups())
  }, [getIncrementGroups, getStockGroups, resourceType])

  const [editingKey, setEditingKey] = React.useState('')
  const [selectedTab] = useQueryParam('selectedTab', StringParam)
  React.useEffect(() => {
    setEditingKey('')
    setExpandedRowKeys([])
  }, [selectedTab, dataSource])

  const [preferenceCache, setPreferenceCache] = useLocalStorageState<Record<string, string[]>>(
    RESOURCE_MANAGEMENT_LOCAL_STORAGE_KEYS.STOCK
  )
  const handlePreferenceChanged = React.useCallback(
    (preference: Record<string, string[]>, editingKey: string) => {
      if (!preference || resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL) return
      const newGroups =
        editingKey === ''
          ? getStockGroups()?.map(group => {
              const { items, ...others } = group
              const newItems = items.filter(item => {
                return preference[group.name]?.includes(item.name)
              })
              return { ...others, items: newItems }
            })
          : getStockGroups()
      setCurrentGroups(newGroups)
    },
    [getStockGroups, resourceType]
  )

  React.useEffect(() => {
    handlePreferenceChanged(preferenceCache, editingKey)
  }, [handlePreferenceChanged, preferenceCache, editingKey])

  React.useEffect(() => {
    setExpandedRowKeys(getInitialExpandedRowKeys(dataSource, isViewAllDetails))
  }, [dataSource, isViewAllDetails])

  const [editingForm, setEditingForm] = React.useState<FormInstance>(null)
  const [isCustomDisplayItemsModalVisible, setCustomDisplayItemsModalVisible] = React.useState(false)

  const handleCustomDisplayItemsModalConfirm = (selectedItems: Record<string, string[]>) => {
    handlePreferenceChanged(selectedItems, editingKey)
    setPreferenceCache(selectedItems)
    setCustomDisplayItemsModalVisible(false)
  }

  const isEditing = (record: IFrontEndStock | IFrontEndIncrement) => record.metaData.id === editingKey
  const edit = (record: IFrontEndStock | IFrontEndIncrement) => {
    setEditingKey(record.metaData.id)
    expandedRowKeys.push(record.metaData.id)
    setExpandedRowKeys([...expandedRowKeys])
  }

  const remove = async (record: IFrontEndStock | IFrontEndIncrement) => {
    const payload = {
      ids: [record?.metaData?.id]
    }
    try {
      await sduResourceControllerDeleteIncrementEstimate({ payload })
    } catch (e) {
      e.message && message.error(e.message)
    }
    refresh()
  }

  const handleDownload = (record: IFrontEndStock | IFrontEndIncrement) => {
    try {
      const filteredGpuRelatedIncrementalDownloadDataFileds = INCREMENTAL_DOWNLOAD_DATA_FIELDS.filter(
        item =>
          item.label !== 'GPU cards limit per instance at peak' && item.label !== 'Estimated GPU increment (Cards)'
      )

      const filteredIncrementalFileds = isPlatformAdmin
        ? filteredGpuRelatedIncrementalDownloadDataFileds
        : filteredGpuRelatedIncrementalDownloadDataFileds.filter(item => item.label !== 'Machine model')

      const filteredGpuRelatedStockDownloadDataFields = STOCK_DOWNLOAD_DATA_FIELDS.filter(
        item =>
          item.label !== 'GPU card limit per instance at peak' &&
          item.label !== 'Total GPU allocated at peak' &&
          item.label !== 'Estimated GPU increment'
      )

      const filteredStockFileds = isPlatformAdmin
        ? filteredGpuRelatedStockDownloadDataFields
        : filteredGpuRelatedStockDownloadDataFields.filter(item => item.label !== 'Machine model')

      const json2csv =
        resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL
          ? new Parser({ fields: filteredIncrementalFileds, withBOM: true })
          : new Parser({ fields: filteredStockFileds, withBOM: true })
      const csvData = json2csv.parse(record)
      const filename = `ECP Resource ${
        resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL ? 'Incremantal' : 'Stock'
      } {${moment().format('MMM DD YYYY HH:mm:ss')}}.csv`

      downloadData(csvData, filename, 'text/csv')
    } catch (err) {
      message.error(`Downlad data failed: ${err}.`)
    }
  }

  const handleDuplicate = (record: IFrontEndIncrement) => {
    setDuplicateRecord(record)
    setAddNewEstimatedModalVisible(true)
  }
  const handleModalCancel = () => {
    setAddNewEstimatedModalVisible(false)
    setDuplicateRecord(undefined)
  }
  const [, editStockFn] = useAsyncFn(sduResourceControllerEditStockResource)
  const [, editIncrementFn] = useAsyncFn(sduResourceControllerEditIncrementEstimate)
  const save = async (record: IFrontEndStock | IFrontEndIncrement) => {
    const formData = await editingForm.validateFields()
    const { data } = record
    const ids = [record.metaData.id]
    if ('growthExpectation' in data) {
      const {
        displayEnv,
        evaluationMetrics,
        gpuCardLimitOneInsPeak,
        growthRatio,
        growthRatioAnnotation,
        inUse,
        machineModel,
        minInsCount,
        qpsMaxOneIns,
        qpsTotalPeak,
        remark,
        safetyThreshold
      } = formData
      const payload = {
        sduClusterIds: ids,
        data: {
          displayEnv,
          evaluationMetrics,
          gpuCardLimitOneInsPeak,
          growthRatio,
          growthRatioAnnotation,
          inUse,
          machineModel,
          minInsCount,
          qpsMaxOneIns,
          qpsTotalPeak,
          remark,
          safetyThreshold: Number(safetyThreshold.toString().replace('%', '')) / 100
        }
      }
      editStockFn({ payload }).then(() => {
        message.success('Save stock resource successfully')
      })
    } else {
      const {
        az,
        cid,
        cluster,
        cpuLimitOneInsPeak,
        displayEnv,
        estimatedCpuIncrementTotal,
        estimatedLogic,
        estimatedMemIncrementTotal,
        estimatedQpsTotal,
        evaluationMetrics,
        gpuCardLimitOneInsPeak,
        machineModel,
        memLimitOneInsPeak,
        minInsCount,
        qpsMaxOneIns,
        remark,
        segment
      } = formData
      const payload = {
        ids,
        data: {
          az,
          cid,
          cluster: cluster || null,
          cpuLimitOneInsPeak,
          displayEnv,
          estimatedCpuIncrementTotal,
          estimatedLogic,
          estimatedMemIncrementTotal,
          estimatedQpsTotal,
          evaluationMetrics,
          gpuCardLimitOneInsPeak,
          machineModel,
          memLimitOneInsPeak,
          minInsCount,
          qpsMaxOneIns,
          remark,
          segment
        }
      }
      editIncrementFn({ payload }).then(() => {
        message.success('Save incremental resource successfully')
      })
    }
    setEditingKey('')
    refresh()
  }

  const handleCancel = () => {
    setEditingKey('')
    editingForm.resetFields()
  }

  const handleGetEditingForm = (form: FormInstance) => {
    setEditingForm(form)
  }

  const actions = {
    title: (
      <Action>
        <>Action</>
        {resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL ? null : (
          <SettingOutlined onClick={() => setCustomDisplayItemsModalVisible(!isCustomDisplayItemsModalVisible)} />
        )}
      </Action>
    ),
    dataIndex: 'action',
    render: (_, record) => {
      const editable = isEditing(record)
      return editable ? (
        <Space size='middle'>
          <Popconfirm title='Sure to save?' onConfirm={() => save(record)}>
            <Typography.Link disabled={isBatchOperating}>Save</Typography.Link>
          </Popconfirm>
          <Popconfirm title='Sure to cancel?' onConfirm={handleCancel}>
            <Typography.Link disabled={isBatchOperating}>Cancel</Typography.Link>
          </Popconfirm>
        </Space>
      ) : (
        <Space size='middle'>
          {resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL ? (
            <Typography.Link
              disabled={editingKey !== '' || isBatchOperating || !canDuplicate}
              onClick={() => handleDuplicate(record)}
            >
              Duplicate
            </Typography.Link>
          ) : null}
          <Typography.Link disabled={editingKey !== '' || isBatchOperating || !canEdit} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
          <Typography.Link disabled={editingKey !== '' || isBatchOperating} onClick={() => handleDownload(record)}>
            Download
          </Typography.Link>
          {resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL ? (
            <Popconfirm title='Sure to delete?' onConfirm={() => remove(record)}>
              <Typography.Link disabled={editingKey !== '' || isBatchOperating || !canDelete}>Delete</Typography.Link>
            </Popconfirm>
          ) : null}
        </Space>
      )
    }
  }

  const rowSelection = {
    selectedRows,
    preserveSelectedRowKeys: true,
    onChange: (_, rows) => {
      setSelectedRows(rows)
    }
  }

  React.useEffect(() => {
    if (!isBatchOperating) {
      setSelectedRows([])
    } else {
      setEditingKey('')
    }
  }, [isBatchOperating, setSelectedRows])

  return (
    <>
      <CustomDisplayItemsModal
        name={RESOURCE_MANAGEMENT_LOCAL_STORAGE_KEYS.STOCK}
        visible={isCustomDisplayItemsModalVisible}
        onCancel={() => setCustomDisplayItemsModalVisible(false)}
        onOk={handleCustomDisplayItemsModalConfirm}
      />
      <AddNewEstimatedModal
        isVisible={isAddNewEstimatedModalVisible}
        onCancel={handleModalCancel}
        onOk={() => setAddNewEstimatedModalVisible(false)}
        refresh={refresh}
        duplicateRecord={duplicateRecord}
      />
      <Prompt when={isBatchOperating || editingKey !== ''} onlyPathname={false}>
        <StyledTable
          loading={loading}
          columns={dataColumns.concat(actions)}
          dataSource={dataSource}
          rowKey={(record: IFrontEndStock | IFrontEndIncrement) => record.metaData.id}
          rowSelection={isBatchOperating ? rowSelection : undefined}
          // onRow={({ key }) => expandedKeys.includes(key) && { className: 'expand-parent' }}
          expandable={{
            expandedRowRender: record => (
              <ResourceTableExpand
                groups={currentGroups}
                data={record.data}
                isEditing={isEditing(record)}
                onGetEditingForm={handleGetEditingForm}
                height={resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL ? '280px' : null}
                resourceType={resourceType}
              />
            ),
            expandedRowKeys,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <CaretDownOutlined
                  onClick={() => {
                    const newExpandedRowKeys = expandedRowKeys.filter((id: string) => id !== record.metaData.id)
                    setExpandedRowKeys(newExpandedRowKeys)
                  }}
                />
              ) : (
                <CaretRightOutlined
                  onClick={() => {
                    expandedRowKeys.push(record.metaData.id)
                    setExpandedRowKeys([...expandedRowKeys])
                  }}
                />
              )
          }}
          onChange={handleTableChange}
          pagination={{
            showQuickJumper: true,
            ...pagination
          }}
        />
      </Prompt>
    </>
  )
}

export default ResourceTable
