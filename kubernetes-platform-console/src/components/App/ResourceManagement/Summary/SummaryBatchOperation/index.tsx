import BatchOperation, { BATCH_OPERATION } from 'components/App/ResourceManagement/common/BatchOperation'
import { TAB } from 'components/App/ResourceManagement/Summary'
import React from 'react'
import { downloadData } from 'helpers/download'
import { Parser } from 'json2csv'
import moment from 'moment-timezone'
import {
  SUMMARY_DETAILED_DOWANLOAD_DATA_FIELDS,
  SUMMARY_LEVEL_1_DOWANLOAD_DATA_FIELDS,
  SUMMARY_LEVEL_2_DOWANLOAD_DATA_FIELDS,
  SUMMARY_LEVEL_3_DOWANLOAD_DATA_FIELDS,
  SUMMARY_QUOTA_DOWNLOAD_DATA_FIELDS
} from 'components/App/ResourceManagement/Summary/SummaryBatchOperation/fields'
import { message } from 'infrad'
import { ISummaryData } from 'swagger-api/v1/models'
import { GlobalContext } from 'hocs/useGlobalContext'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'
import {
  ISduResourceControllerListSummaryParams,
  sduResourceControllerListSummary
} from 'swagger-api/v1/apis/SduResource'

interface ISummaryBatchOperationProps {
  tab: TAB
  isBatchOperating: boolean
  onBatchOperationStatusChange: (batchOperating: boolean) => void
  selectedTableRows: ISummaryData[]
  searchAllValues: ISduResourceControllerListSummaryParams
}

const SummaryBatchOperation: React.FC<ISummaryBatchOperationProps> = ({
  tab,
  isBatchOperating,
  onBatchOperationStatusChange,
  selectedTableRows,
  searchAllValues
}) => {
  const { state: globalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = globalContextState || {}
  const isPlatformAdmin = userRoles.some(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)

  const level1Columns = [
    {
      title: 'Level 1 Project',
      dataIndex: 'level1DisplayName'
    }
  ]

  const level2Columns = level1Columns.concat([
    {
      title: 'Level 2 Project',
      dataIndex: 'level2DisplayName'
    }
  ])

  const level3Columns = level2Columns.concat([
    {
      title: 'Level 3 Project',
      dataIndex: 'level3DisplayName'
    }
  ])

  const detailColumns = level3Columns
    .concat([
      {
        title: 'AZ',
        dataIndex: 'az'
      },
      {
        title: 'ENV',
        dataIndex: 'displayEnv'
      }
    ])
    .concat(isPlatformAdmin ? [{ title: 'Machine Model', dataIndex: 'machineModel' }] : [])

  const generateCSVFile = (data: ISummaryData[]) => {
    let fields: { label: string; value: string }[] = []

    switch (tab) {
      case TAB.LEVEL_1_PROJECT:
        fields = SUMMARY_LEVEL_1_DOWANLOAD_DATA_FIELDS.concat(SUMMARY_QUOTA_DOWNLOAD_DATA_FIELDS)
        break
      case TAB.LEVEL_2_PROJECT:
        fields = SUMMARY_LEVEL_2_DOWANLOAD_DATA_FIELDS.concat(SUMMARY_QUOTA_DOWNLOAD_DATA_FIELDS)
        break
      case TAB.LEVEL_3_PROJECT:
        fields = SUMMARY_LEVEL_3_DOWANLOAD_DATA_FIELDS.concat(SUMMARY_QUOTA_DOWNLOAD_DATA_FIELDS)
        break
      case TAB.DETAILED_SUMMARY:
        const filteredDetailedFileds = isPlatformAdmin
          ? SUMMARY_DETAILED_DOWANLOAD_DATA_FIELDS
          : SUMMARY_DETAILED_DOWANLOAD_DATA_FIELDS.filter(item => item.label !== 'Machine Model')
        const filteredQuotaFields = SUMMARY_QUOTA_DOWNLOAD_DATA_FIELDS.filter(
          item => item.label.includes('Stock') || item.label.includes('Incremental')
        )
        fields = filteredDetailedFileds.concat(filteredQuotaFields)
        break
      default:
        break
    }
    const json2csv = new Parser({ fields })
    const csvData = json2csv.parse(data)
    const filename = `ECP Resource Summary {${moment().format('MMM DD YYYY HH:mm:ss')}}.csv`

    downloadData(csvData, filename, 'text/csv')
  }

  const handleSubmitDownload = (callback: () => void) => {
    try {
      generateCSVFile(selectedTableRows)
      callback()
    } catch (err) {
      message.error(`Downlad data failed: ${err}.`)
    }
  }

  const handleSubmitDownloadAll = async () => {
    try {
      message.info('The application has been submitted and data will be downloaded in about 10 seconds.')
      const { summaries } = await sduResourceControllerListSummary({ ...searchAllValues })
      generateCSVFile(summaries)
    } catch (err) {
      message.error('Download failed, please try again.')
    }
  }

  const submitOperationMapping = {
    [BATCH_OPERATION.BATCH_DOWNLOAD]: handleSubmitDownload,
    [BATCH_OPERATION.BATCH_DOWNLOAD_ALL]: handleSubmitDownloadAll
  }

  const columnsMapping = {
    [TAB.LEVEL_1_PROJECT]: level1Columns,
    [TAB.LEVEL_2_PROJECT]: level2Columns,
    [TAB.LEVEL_3_PROJECT]: level3Columns,
    [TAB.DETAILED_SUMMARY]: detailColumns
  }

  return (
    <BatchOperation
      batchOperationVisible={isBatchOperating}
      onBatchOperationVisibleChange={onBatchOperationStatusChange}
      selectedTableRows={selectedTableRows}
      columns={columnsMapping[tab]}
      rowKey={(record: ISummaryData) =>
        `${record.level1DisplayName}${record.level2DisplayName}${record.level3DisplayName}${record.az}${record.displayEnv}${record.machineModel}`
      }
      operationList={[BATCH_OPERATION.BATCH_DOWNLOAD, BATCH_OPERATION.BATCH_DOWNLOAD_ALL]}
      submitOperationMapping={submitOperationMapping}
    />
  )
}

export default SummaryBatchOperation
