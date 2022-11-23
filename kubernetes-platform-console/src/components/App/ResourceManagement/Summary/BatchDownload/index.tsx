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
} from 'components/App/ResourceManagement/Summary/BatchDownload/fields'
import { message } from 'infrad'
import { ISummaryData } from 'swagger-api/v1/models'
import { GlobalContext } from 'hocs/useGlobalContext'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'

interface IBatchDownloadProps {
  tab: TAB
  isBatchOperating: boolean
  onBatchOperationStatusChange: (batchOperating: boolean) => void
  selectedTableRows: unknown[]
}

const BatchDownload: React.FC<IBatchDownloadProps> = ({
  tab,
  isBatchOperating,
  onBatchOperationStatusChange,
  selectedTableRows
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
        dataIndex: 'env'
      }
    ])
    .concat(isPlatformAdmin ? [{ title: 'Machine Model', dataIndex: 'machineModel' }] : [])

  const handleSubmitDownload = (callback: () => void) => {
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

    try {
      const json2csv = new Parser({ fields })
      const csvData = json2csv.parse(selectedTableRows)
      const filename = `ECP Resource Summary {${moment().format('MMM DD YYYY HH:mm:ss')}}.csv`

      downloadData(csvData, filename, 'text/csv')
      callback()
    } catch (err) {
      message.error(`Downlad data failed: ${err}.`)
    }
  }

  const submitOperationMapping = {
    [BATCH_OPERATION.BATCH_DOWNLOAD]: handleSubmitDownload
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
      operationList={[BATCH_OPERATION.BATCH_DOWNLOAD]}
      submitOperationMapping={submitOperationMapping}
    />
  )
}

export default BatchDownload
