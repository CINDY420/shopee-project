import React from 'react'
import BatchOperation, { BATCH_OPERATION } from 'components/App/ResourceManagement/common/BatchOperation'
import { Form, InputNumber, message } from 'infrad'
import { CONTROL_TYPE, IFormItemData } from 'components/App/ResourceManagement/common/BatchOperation/BatchEdit'
import { GlobalContext } from 'hocs/useGlobalContext'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'
import { IEditStockResource, IFrontEndStock } from 'swagger-api/v1/models'
import {
  ISduResourceControllerListStockParams,
  sduResourceControllerEditStockResource,
  sduResourceControllerListStock
} from 'swagger-api/v1/apis/SduResource'
import useAsyncFn from 'hooks/useAsyncFn'
import { ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import { downloadData } from 'helpers/download'
import { Parser } from 'json2csv'
import { STOCK_DOWNLOAD_DATA_FIELDS } from 'components/App/ResourceManagement/Stock/StockBatchOperation/fields'
import moment from 'moment-timezone'
import { NON_NEGATIVE_NUMBER } from 'helpers/validate'

interface IStockBatchOperation {
  isBatchOperating: boolean
  onBatchOperationStatusChange: (batchOperating: boolean) => void
  selectedTableRows: IFrontEndStock[]
  refreshTableFn: () => void
  searchAllValues: ISduResourceControllerListStockParams
}

const StockBatchOperation: React.FC<IStockBatchOperation> = ({
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
  const { machineModels, envs } = state

  const formItemDataList: IFormItemData[] = [
    {
      name: 'displayEnv',
      label: 'Env',
      controlType: CONTROL_TYPE.SELECT,
      options: envs,
      defaultValue: 'live'
    },
    {
      name: 'qpsTotalPeak',
      label: 'Total QPS at peak',
      rules: [{ pattern: NON_NEGATIVE_NUMBER, message: 'Please input a non-negative integer' }]
    },
    {
      name: 'gpuCardLimitOneInsPeak',
      label: 'GPU Card limit per instance at peak',
      rules: [{ type: 'number', min: 0, message: 'Please input a non-negative number' }]
    },
    {
      name: 'growthRatioAnnotation',
      label: 'Justification for higher growth ratio proposed by App',
      controlType: CONTROL_TYPE.INPUT
    },
    {
      name: 'qpsMaxOneIns',
      label: 'Max safe QPS for support per instance',
      rules: [{ pattern: NON_NEGATIVE_NUMBER, message: 'Please input a non-negative integer' }]
    },
    {
      name: 'minInsCount',
      label: 'Minimum instance count',
      rules: [{ pattern: NON_NEGATIVE_NUMBER, message: 'Please input a non-negative integer' }],
      defaultValue: 2
    },
    {
      name: 'inUse',
      label: 'In use',
      controlType: CONTROL_TYPE.SELECT,
      options: [0, 1],
      tooltip: 'Default 1, please select 0 if no longer in use.',
      defaultValue: 1
    },
    {
      name: 'safetyThreshold',
      label: 'Application CPU/MEM safety threshold (per instance)',
      component: (
        <Form.Item
          name='safetyThreshold'
          label='Application CPU/MEM safety threshold (per instance)'
          initialValue='70%'
          tooltip='Default 70% for CPU, 85% for MEM'
          normalize={value => `${value}%`}
        >
          <InputNumber stringMode min={1} max={100} style={{ width: '100%' }} controls={false} />
        </Form.Item>
      )
    },
    {
      name: 'evaluationMetrics',
      label: 'Evaluation metrics',
      controlType: CONTROL_TYPE.SELECT,
      options: ['CPU', 'MEM', 'QPS'],
      defaultValue: 'CPU'
    },
    {
      name: 'remark',
      label: 'Remark',
      controlType: CONTROL_TYPE.INPUT
    },
    {
      name: 'growthRatio',
      label: 'Growth ratio',
      rules: [{ type: 'number', min: 0, message: 'Please input a non-negative number' }]
    },
    {
      name: 'machineModel',
      label: 'Machine model',
      controlType: CONTROL_TYPE.SELECT,
      options: machineModels,
      defaultValue: 'S1_V2',
      visible: isPlatformAdmin
    }
  ]

  const columns = [
    {
      title: 'SDU',
      dataIndex: ['metaData', 'sdu']
    },
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

  const [, batchEditStockFn] = useAsyncFn(sduResourceControllerEditStockResource)

  const handleSubmitBatchEdit = (
    formValues: Omit<IEditStockResource, 'safetyThreshold'> & { safetyThreshold: string },
    callback: () => void
  ) => {
    const sduClusterIds = selectedTableRows.map(item => item.metaData.id)
    const { safetyThreshold, ...restValues } = formValues
    if (safetyThreshold) {
      Object.assign(restValues, { safetyThreshold: Number(safetyThreshold.replace('%', '')) / 100 })
    }
    batchEditStockFn({
      payload: {
        sduClusterIds,
        isBatch: true,
        data: restValues
      }
    }).then(() => {
      message.success('Batch edit stock resource succeeded.')
      callback()
      refreshTableFn()
    })
  }

  const generateCSVFile = (data: IFrontEndStock[]) => {
    const filteredGpuRelatedStockDownloadDataFields = STOCK_DOWNLOAD_DATA_FIELDS.filter(
      item =>
        item.label !== 'GPU card limit per instance at peak' &&
        item.label !== 'Total GPU allocated at peak' &&
        item.label !== 'Estimated GPU increment'
    )

    const filteredFileds = isPlatformAdmin
      ? filteredGpuRelatedStockDownloadDataFields
      : filteredGpuRelatedStockDownloadDataFields.filter(item => item.label !== 'Machine model')
    const json2csv = new Parser({ fields: filteredFileds, withBOM: true })
    const csvData = json2csv.parse(data)
    const filename = `ECP Resource Stock {${moment().format('MMM DD YYYY HH:mm:ss')}}.csv`

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
      const { data } = await sduResourceControllerListStock({ ...searchAllValues })
      generateCSVFile(data)
    } catch (err) {
      message.error('Download failed, please try again.')
    }
  }

  const submitOperationMapping = {
    [BATCH_OPERATION.BATCH_EDIT]: handleSubmitBatchEdit,
    [BATCH_OPERATION.BATCH_DOWNLOAD]: handleSubmitBatchDownload,
    [BATCH_OPERATION.BATCH_DOWNLOAD_ALL]: handleSubmitBatchDownloadAll
  }

  return (
    <BatchOperation
      batchOperationVisible={isBatchOperating}
      onBatchOperationVisibleChange={onBatchOperationStatusChange}
      selectedTableRows={selectedTableRows}
      operationList={[BATCH_OPERATION.BATCH_EDIT, BATCH_OPERATION.BATCH_DOWNLOAD, BATCH_OPERATION.BATCH_DOWNLOAD_ALL]}
      columns={columns}
      rowKey={(record: IFrontEndStock) => record.metaData.id}
      formItemDataList={formItemDataList}
      submitOperationMapping={submitOperationMapping}
    />
  )
}

export default StockBatchOperation
