import React, { useState } from 'react'

import { MigrationContext } from '../../../../useMigrationContext'

import history from 'helpers/history'
import { filterTypes, getFilterItem, getFilterUrlParam } from 'helpers/queryParams'
import { useRecoilValue } from 'recoil'
import { selectedTenant } from 'states/applicationState/tenant'

import {
  pipelinesControllerListAllPipelines,
  pipelinesControllerBatchMigratePipelines
} from 'swagger-api/v3/apis/Pipelines'

import { Button, Form, message, Modal } from 'infrad'
import { QuestionCircleOutlined } from 'infra-design-icons'
import BatchOperations from 'components/Common/BatchOperations'
import BatchMigrateForm from './BatchMigrateForm'
import { IEngine } from 'api/types/application/pipeline'

const { confirm } = Modal

interface IBatchMigrateOperation {
  engines: IEngine[]
  selectedRowKeys: string[]
  isBatchingMigrate: boolean
  onCloseBatMchigrate: () => void
  onChangeSelectedRowKeys: (keys: string[]) => void
}

const BatchMigrateOperation: React.FC<IBatchMigrateOperation> = ({
  engines,
  selectedRowKeys,
  isBatchingMigrate,
  onCloseBatMchigrate,
  onChangeSelectedRowKeys
}) => {
  const tenant = useRecoilValue(selectedTenant)
  const tenantId = tenant.id

  const { state } = React.useContext(MigrationContext)
  const { onRefreshMigrationStatus } = state

  const [form] = Form.useForm()
  const [selectAllLoading, setSelectAllLoading] = useState<boolean>(false)
  const [allPipelinesKeys, setAllPipelinesKeys] = useState<string[]>([])
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)

  const getAllPipelinesKeys = async () => {
    const { search } = history.location
    const queryParams = new URLSearchParams(search)
    const searchEngine = queryParams.get('engine')
    const searchPipeline = queryParams.get('pipeline')
    const searchProject = queryParams.get('project')
    const filterBy = getFilterUrlParam({
      engine: getFilterItem('engine', searchEngine, filterTypes.equal),
      pipelineName: getFilterItem('pipelineName', searchPipeline, filterTypes.contain),
      projectName: getFilterItem('projectName', searchProject, filterTypes.equal)
    })
    try {
      setSelectAllLoading(true)
      const pipelineKeys = await pipelinesControllerListAllPipelines({
        tenantId,
        filterBy
      })
      setAllPipelinesKeys(pipelineKeys)
      onChangeSelectedRowKeys(pipelineKeys)
      setIsSelectAll(true)
    } catch (err) {
      err.message && message.error(err.message)
    }
    setSelectAllLoading(false)
  }

  const handleSubmit = () => {
    confirm({
      title: 'Migrate these pipelines? ',
      icon: <QuestionCircleOutlined />,
      content: 'This operation cannot be canceled.',
      okText: 'Confirm',
      autoFocusButton: null,
      onOk() {
        migratePipelinesFn()
      }
    })
  }

  const clearSelect = () => {
    onChangeSelectedRowKeys([])
    setIsSelectAll(false)
  }

  const handleCancelBatchMigrate = () => {
    onCloseBatMchigrate()
    clearSelect()
  }

  const migratePipelinesFn = async () => {
    try {
      const values: any = await form.validateFields()
      const { destEngine } = values
      await pipelinesControllerBatchMigratePipelines({
        tenantId,
        payload: { sourcePipelines: selectedRowKeys, destEngine }
      })
      onRefreshMigrationStatus()
      handleCancelBatchMigrate()
      message.success('Submit migration task successfully!')
    } catch (err) {
      err.message && message.error(err.message)
    }
  }

  const handleFieldsChange = (disabled: boolean) => setDisabled(disabled)

  return (
    <BatchOperations
      title='Batch-Migrate'
      selectedCount={selectedRowKeys.length}
      visible={isBatchingMigrate}
      disabled={!selectedRowKeys.length || disabled}
      onSubmit={handleSubmit}
      onCancel={handleCancelBatchMigrate}
    >
      <BatchMigrateForm form={form} onFieldsChange={handleFieldsChange} engines={engines} />
      {isSelectAll && selectedRowKeys.length === allPipelinesKeys.length ? (
        <Button type='link' onClick={clearSelect} style={{ fontWeight: 500 }}>
          Clear
        </Button>
      ) : (
        <Button type='link' onClick={getAllPipelinesKeys} style={{ fontWeight: 500 }} loading={selectAllLoading}>
          Select All
        </Button>
      )}
    </BatchOperations>
  )
}

export default BatchMigrateOperation
