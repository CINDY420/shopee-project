import React from 'react'
import BatchOperation, { BATCH_OPERATION } from 'components/App/ResourceManagement/common/BatchOperation'
import { CONTROL_TYPE, IFormItemData } from 'components/App/ResourceManagement/common/BatchOperation/BatchEdit'
import { GlobalContext } from 'hocs/useGlobalContext'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'
import {
  ISduResourceControllerListIncrementParams,
  sduResourceControllerDeleteIncrementEstimate,
  sduResourceControllerEditIncrementEstimate,
  sduResourceControllerListIncrement
} from 'swagger-api/v1/apis/SduResource'
import { IEditIncrementEstimate, IFrontEndIncrement } from 'swagger-api/v1/models'
import { message } from 'infrad'
import useAsyncFn from 'hooks/useAsyncFn'
import { ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import { INCREMENTAL_DOWNLOAD_DATA_FIELDS } from 'components/App/ResourceManagement/Incremental/IncrementalBatchOperation/fields'
import { downloadData } from 'helpers/download'
import moment from 'moment-timezone'
import { Parser } from 'json2csv'
import { NON_NEGATIVE_NUMBER } from 'helpers/validate'

interface IIncrementalBatchOperation {
  isBatchOperating: boolean
  onBatchOperationStatusChange: (batchOperating: boolean) => void
  selectedTableRows: IFrontEndIncrement[]
  refreshTableFn: () => void
  searchAllValues: ISduResourceControllerListIncrementParams
}

const IncrementalBatchOperation: React.FC<IIncrementalBatchOperation> = ({
  isBatchOperating,
  onBatchOperationStatusChange,
  selectedTableRows,
  refreshTableFn,
  searchAllValues
}) => {
  const { state: GlobalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = GlobalContextState || {}
  const isPlatformAdmin = userRoles.some(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)

  const { state } = React.useContext(ResourceContext)
  const { cids, envs, azs, clusters, segments, machineModels } = state

  const formItemDataList: IFormItemData[] = [
    {
      name: 'cid',
      label: 'Cid',
      controlType: CONTROL_TYPE.SELECT,
      options: cids
    },
    {
      name: 'displayEnv',
      label: 'Env',
      controlType: CONTROL_TYPE.SELECT,
      options: envs
    },
    {
      name: 'az',
      label: 'Az',
      controlType: CONTROL_TYPE.SELECT,
      options: azs
    },
    {
      name: 'cluster',
      label: 'Cluster',
      controlType: CONTROL_TYPE.SELECT,
      options: clusters
    },
    {
      name: 'segment',
      label: 'Segment',
      controlType: CONTROL_TYPE.SELECT,
      options: segments
    },
    {
      name: 'evaluationMetrics',
      label: 'Evaluation metrics',
      controlType: CONTROL_TYPE.SELECT,
      options: ['CPU', 'MEM', 'QPS'],
      defaultValue: 'CPU'
    },
    {
      name: 'machineModel',
      label: 'Machine model',
      controlType: CONTROL_TYPE.SELECT,
      options: machineModels,
      defaultValue: 'S1_V2',
      visible: isPlatformAdmin
    },
    {
      name: 'cpuLimitOneInsPeak',
      label: 'CPU limit per instance at peak (Cores)',
      rules: [{ type: 'number', min: 0, message: 'Please input a non-negative number' }]
    },
    {
      name: 'memLimitOneInsPeak',
      label: 'Memory limit per instance at peak (GB)',
      rules: [{ type: 'number', min: 0, message: 'Please input a non-negative number' }]
    },
    {
      name: 'gpuCardLimitOneInsPeak',
      label: 'GPU cards limit per instance at peak',
      rules: [{ type: 'number', min: 0, message: 'Please input a non-negative number' }]
    },
    {
      name: 'estimatedCpuIncrementTotal',
      label: 'Required CPU increment (Cores)',
      rules: [{ type: 'number', min: 0, message: 'Please input a non-negative number' }]
    },
    {
      name: 'estimatedMemIncrementTotal',
      label: 'Required memory increment (GB)',
      rules: [{ type: 'number', min: 0, message: 'Please input a non-negative number' }]
    },
    {
      name: 'qpsMaxOneIns',
      label: 'Max safe QPS for support per instance',
      rules: [{ type: 'number', min: 0, message: 'Please input a non-negative number' }]
    },
    {
      name: 'minInsCount',
      label: 'Minimum instance count',
      defaultValue: 2,
      rules: [{ pattern: NON_NEGATIVE_NUMBER, message: 'Please input a non-negative integer' }]
    },
    {
      name: 'estimatedQpsTotal',
      label: 'Total required QPS',
      rules: [{ type: 'number', min: 0, message: 'Please input a non-negative number' }]
    },
    {
      name: 'remark',
      label: 'Remark',
      controlType: CONTROL_TYPE.INPUT
    },
    {
      name: 'estimatedLogic',
      label: 'Required logic description',
      controlType: CONTROL_TYPE.INPUT
    }
  ]

  const columns = [
    {
      title: 'Level 1 Project',
      dataIndex: ['metaData', 'level1']
    },
    {
      title: 'Level 2 Project',
      dataIndex: ['metaData', 'level2']
    },
    {
      title: 'Level 3 Project',
      dataIndex: ['metaData', 'level3']
    }
  ]

  const [, batchEditIncrementalFn] = useAsyncFn(sduResourceControllerEditIncrementEstimate)
  const handleSubmitBatchEdit = (formValues: IEditIncrementEstimate, callback: () => void) => {
    const ids: string[] = selectedTableRows.map(item => item.metaData.id)
    batchEditIncrementalFn({
      payload: {
        ids,
        data: formValues
      }
    }).then(() => {
      message.success('Batch edit incremental resource succeeded.')
      callback()
      refreshTableFn()
    })
  }

  const generateCSVFile = (data: IFrontEndIncrement[]) => {
    const filteredGpuRelatedIncrementalDownloadDataFileds = INCREMENTAL_DOWNLOAD_DATA_FIELDS.filter(
      item => item.label !== 'GPU cards limit per instance at peak' && item.label !== 'Estimated GPU increment (Cards)'
    )

    const filteredFileds = isPlatformAdmin
      ? filteredGpuRelatedIncrementalDownloadDataFileds
      : filteredGpuRelatedIncrementalDownloadDataFileds.filter(item => item.label !== 'Machine model')
    const json2csv = new Parser({ fields: filteredFileds, withBOM: true })
    const csvData = json2csv.parse(data)
    const filename = `ECP Resource Incremental {${moment().format('MMM DD YYYY HH:mm:ss')}}.csv`

    downloadData(csvData, filename, 'text/csv')
  }

  const handleSubmitBatchDownload = (callback: () => void) => {
    try {
      generateCSVFile(selectedTableRows)
      callback()
    } catch (err) {
      message.error(`Downlad data failed: ${err}.`)
    }
  }

  const handleSubmitBatchDownloadAll = async () => {
    try {
      message.info('The application has been submitted and data will be downloaded in about 10 seconds.')
      const { data } = await sduResourceControllerListIncrement({ ...searchAllValues })
      generateCSVFile(data)
    } catch (err) {
      message.error('Download failed, please try again.')
    }
  }

  const [, batchDeletaIncrementalFn] = useAsyncFn(sduResourceControllerDeleteIncrementEstimate)
  const handleBatchDelete = (callback: () => void) => {
    const ids = selectedTableRows.map(item => item.metaData.id)
    const payload = {
      ids
    }
    batchDeletaIncrementalFn({ payload }).then(() => {
      message.success('Batch delete incremental resource succeeded.')
      onBatchOperationStatusChange(false)
      callback()
      refreshTableFn()
    })
  }

  const submitOperationMapping = {
    [BATCH_OPERATION.BATCH_EDIT]: handleSubmitBatchEdit,
    [BATCH_OPERATION.BATCH_DOWNLOAD]: handleSubmitBatchDownload,
    [BATCH_OPERATION.BATCH_DOWNLOAD_ALL]: handleSubmitBatchDownloadAll,
    [BATCH_OPERATION.BATCH_DELETE]: handleBatchDelete
  }

  return (
    <BatchOperation
      batchOperationVisible={isBatchOperating}
      onBatchOperationVisibleChange={onBatchOperationStatusChange}
      selectedTableRows={selectedTableRows}
      columns={columns}
      rowKey={(record: IFrontEndIncrement) => record.metaData.id}
      formItemDataList={formItemDataList}
      submitOperationMapping={submitOperationMapping}
    />
  )
}

export default IncrementalBatchOperation
