import React, { useCallback, useContext, useMemo, useState } from 'react'
import {
  Input,
  Button,
  Typography,
  Checkbox,
  CheckboxOptionType,
  TableColumnType,
  Space,
  Form,
  Modal,
} from 'infrad'
import { CheckboxGroupProps } from 'infrad/lib/checkbox'
import { CheckboxValueType } from 'infrad/lib/checkbox/Group'

import {
  Root,
  ActionWrapper,
  EnvGroupWrapper,
  EnvWrapper,
  UnitWrapper,
  TitleWrapper,
} from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable/style'
import { Table } from 'src/common-styles/table'

import { ENV } from 'src/constants/quota'
import { quotaController_listTenantsQuota } from 'src/swagger-api/apis/SegmentQuota'
import ConfirmAction from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable/ConfirmAction'
import InfoTooltip from 'src/components/Common/InfoTooltip'
import { IGetSegmentQuotaResponse, IListTenantsQuotaItem } from 'src/swagger-api/models'
import QuotaEditItem, {
  QuotaName,
  IEditedTenantQuota,
  IOnQuotaUpdateArgs,
} from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable/QuotaEditItem'
import ConfirmModal from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable/ConfirmModal'
import { SegmentDetailContext } from 'src/components/App/Segment/SegmentDetail/context'
import { useRequest } from 'ahooks'
import { listQuery } from '@infra/utils'
import { ByteToGiB } from 'src/helpers/unit'

const { FilterByBuilder, FilterByOperator } = listQuery

const envOptions: CheckboxOptionType[] = Object.values(ENV).map((env) => ({
  label: <EnvWrapper>{env}</EnvWrapper>,
  value: env,
}))

interface IQuotaTableProps {
  initialEnvTotalQuotaList: IGetSegmentQuotaResponse[]
  defaultSelectedEnvs?: string[]
  refreshEnvTotalQuotaList: () => void
}

const QuotaTable: React.FC<IQuotaTableProps> = ({
  initialEnvTotalQuotaList,
  defaultSelectedEnvs = [],
  refreshEnvTotalQuotaList,
}) => {
  const segmentDetailContext = useContext(SegmentDetailContext)
  const { azKey, segmentKey } = segmentDetailContext
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedEnvs, setSelectedEnvs] = useState<CheckboxValueType[]>(defaultSelectedEnvs)
  const [editingTenantId, setEditingTenantId] = useState<string>()
  const [allEditing, setAllEditing] = useState(false)
  const [editedTenantQuotaList, setEditedTenantQuotaList] = useState<IEditedTenantQuota[]>([])
  const [cpuQuotaValid, setCpuQuotaValid] = useState(true)
  const [memoryQuotaValid, setMemoryQuotaValid] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)

  const [form] = Form.useForm()

  const canSave = editedTenantQuotaList.length > 0 && cpuQuotaValid && memoryQuotaValid

  const listTenantsQuotaFn = async () => {
    const envFilterByItems = selectedEnvs.map((env) => ({
      keyPath: 'env',
      operator: FilterByOperator.CONTAINS,
      value: env.toString().toLocaleLowerCase(),
    }))
    const filterByBuilder = new FilterByBuilder(envFilterByItems)
    const filterBy = filterByBuilder.build()

    const values = await quotaController_listTenantsQuota({
      filterBy,
      azKey,
      segmentKey,
      searchBy: searchValue,
    })
    return values
  }
  const {
    data,
    refresh: refreshQuotaTable,
    loading,
  } = useRequest(listTenantsQuotaFn, {
    manual: false,
    refreshDeps: [searchValue, selectedEnvs, azKey, segmentKey],
  })
  const { items = [] } = data || {}
  const formattedTenantsQuotaList = items.map(({ memoryApplied, memoryQuota, ...others }) => ({
    memoryApplied: ByteToGiB(memoryApplied),
    memoryQuota: ByteToGiB(memoryQuota),
    ...others,
  }))

  // reset states used by 'single edit' and 'multiple edit'
  const resetCommonStates = useCallback(() => {
    setCpuQuotaValid(true)
    setMemoryQuotaValid(true)
    setEditedTenantQuotaList([])
    form.resetFields()
  }, [form])

  const handleSearch = (value: string) => setSearchValue(value)
  const handleEnvSelect: CheckboxGroupProps['onChange'] = (envs) => setSelectedEnvs(envs)
  const handleTenantEdit = (tenantId: string) => setEditingTenantId(tenantId)
  const handleEditTenantCancel = useCallback(() => {
    setEditingTenantId(undefined)
    resetCommonStates()
  }, [resetCommonStates])
  const handleEditAll = () => setAllEditing(true)
  const handleEditAllCancel = () => {
    if (editedTenantQuotaList.length !== 0) {
      Modal.confirm({
        title: 'Notification',
        content: 'The change will not take effect, are you sure to cancel?',
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk: () => {
          setAllEditing(false)
          resetCommonStates()
        },
      })
    } else {
      setAllEditing(false)
      resetCommonStates()
    }
  }
  const handleQuotaUpdate = ({ tenantId, env, editedTenantQuota }: IOnQuotaUpdateArgs) => {
    setEditedTenantQuotaList((previousList) => {
      let newList = [...previousList]
      const updatingTenantQuotaIndex = newList.findIndex(
        (item) => item.tenantId === tenantId && item.env === env,
      )

      if (updatingTenantQuotaIndex === -1) {
        // first editing
        newList = [...newList, editedTenantQuota]
      } else {
        // update previous item
        const { changedCpuQuota, changedMemoryQuota, totalCpuQuota, totalMemoryQuota } =
          editedTenantQuota
        changedCpuQuota !== undefined &&
          (newList[updatingTenantQuotaIndex].changedCpuQuota = changedCpuQuota)
        changedMemoryQuota !== undefined &&
          (newList[updatingTenantQuotaIndex].changedMemoryQuota = changedMemoryQuota)
        totalCpuQuota !== undefined &&
          (newList[updatingTenantQuotaIndex].totalCpuQuota = totalCpuQuota)
        totalMemoryQuota !== undefined &&
          (newList[updatingTenantQuotaIndex].totalMemoryQuota = totalMemoryQuota)
      }
      // remove unchanged item
      newList = newList.filter((item) => item.changedCpuQuota || item.changedMemoryQuota)
      return newList
    })
  }
  const handleRemovePreviewQuota = (tenantId: string, env: string, quotaName: QuotaName) => {
    setEditedTenantQuotaList((previousList) => {
      const newList = [...previousList]
      const removedList = newList.map((item) => {
        if (item.tenantId === tenantId && item.env === env) {
          if (quotaName === QuotaName.CPU_QUOTA) {
            item.changedCpuQuota = 0
            item.totalCpuQuota = item.cpuQuota
          } else {
            item.changedMemoryQuota = 0
            item.totalMemoryQuota = item.memoryQuota
          }
        }
        return item
      })
      // remove unchanged item
      const unEmptyList = removedList.filter(
        (item) => item.changedCpuQuota || item.changedMemoryQuota,
      )
      return unEmptyList
    })
  }
  const handleAddedCpuQuotaValidate = (valid: boolean) => setCpuQuotaValid(valid)
  const handleAddedMemoryQuotaValidate = (valid: boolean) => setMemoryQuotaValid(valid)

  const envUnassignedCpuQuotaMap = useMemo(() => {
    const envUnassignedQuotaMap: Record<string, number> = {}
    initialEnvTotalQuotaList.forEach(({ env, cpuTotal, cpuAssigned }) => {
      envUnassignedQuotaMap[env] = Number(cpuTotal) - Number(cpuAssigned)
    })
    return envUnassignedQuotaMap
  }, [initialEnvTotalQuotaList])

  const envUnassignedMemoryQuotaMap = useMemo(() => {
    const envUnassignedQuotaMap: Record<string, number> = {}
    initialEnvTotalQuotaList.forEach(({ env, memoryTotal, memoryAssigned }) => {
      envUnassignedQuotaMap[env] = ByteToGiB(Number(memoryTotal) - Number(memoryAssigned))
    })
    return envUnassignedQuotaMap
  }, [initialEnvTotalQuotaList])

  const handleEditSave = useCallback(() => {
    setModalVisible(true)
  }, [])
  const handleSubmitSuccess = () => {
    // reset single edit state
    setEditingTenantId(undefined)
    // reset multiple edit state
    setAllEditing(false)

    resetCommonStates()
    refreshEnvTotalQuotaList()
    refreshQuotaTable()
  }

  const editingColumns: TableColumnType<IListTenantsQuotaItem>[] = useMemo(
    () => [
      {
        title: 'Organization',
        key: 'Organization',
        dataIndex: 'tenantName',
        width: '360px',
        onCell: (record) => ({
          rowSpan: record?.colSpan,
          style: {
            borderRight: '1px solid  #f0f0f0',
          },
        }),
        render: (organizationName: string) => (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{organizationName}</div>
        ),
      },
      {
        title: 'Env',
        key: 'env',
        dataIndex: 'env',
        onCell: () => ({
          style: {
            borderRight: '1px solid  #f0f0f0',
          },
        }),
        render: (env: string) => <EnvWrapper>{env}</EnvWrapper>,
      },
      {
        title: (
          <span>
            CPU (Applied)
            <InfoTooltip info="The sum of the actual allocated amount (limit) CPU of the Organization in the env" />
          </span>
        ),
        key: 'cpuApplied',
        dataIndex: 'cpuApplied',
        render: (cpuApplied: number) => (
          <>
            {cpuApplied}
            <UnitWrapper>Cores</UnitWrapper>
          </>
        ),
      },
      {
        title: (
          <span>
            CPU (Quota)
            <InfoTooltip info="The CPU number of resources available to this Organization in the env" />
          </span>
        ),
        key: 'cpuQuota',
        dataIndex: 'cpuQuota',
        onCell: () => ({
          style: {
            borderRight: '1px solid  #f0f0f0',
          },
        }),
        render: (cpuQuota: number, record) =>
          editingTenantId === record.tenantId || allEditing ? (
            <QuotaEditItem
              record={record}
              name={QuotaName.CPU_QUOTA}
              initialValue={cpuQuota}
              unit="Cores"
              onQuotaUpdate={handleQuotaUpdate}
              initialEnvUnassignedQuota={envUnassignedCpuQuotaMap[record.env]}
              currentEnvAddedQuotaList={editedTenantQuotaList.filter(
                ({ tenantId, env, changedCpuQuota = 0 }) =>
                  env === record.env && changedCpuQuota > 0 && tenantId !== record.tenantId,
              )}
              disabled={!cpuQuotaValid}
              onAddedValidate={handleAddedCpuQuotaValidate}
              onRemovePreviewQuota={handleRemovePreviewQuota}
            />
          ) : (
            <>
              {cpuQuota}
              <UnitWrapper>Cores</UnitWrapper>
            </>
          ),
      },
      {
        title: (
          <span>
            Memory (Applied)
            <InfoTooltip info="The sum of the actual allocated amount (limit) Memory of the Organization in the env" />
          </span>
        ),
        key: 'memoryApplied',
        dataIndex: 'memoryApplied',
        render: (memoryApplied: number) => (
          <>
            {memoryApplied}
            <UnitWrapper>GiB</UnitWrapper>
          </>
        ),
      },
      {
        title: (
          <span>
            Memory (Quota)
            <InfoTooltip info="The Memory number of resources available to this Organization in the env" />
          </span>
        ),
        key: 'memoryQuota',
        dataIndex: 'memoryQuota',
        onCell: () => ({
          style: {
            borderRight: '1px solid  #f0f0f0',
          },
        }),
        render: (memoryQuota: number, record) =>
          editingTenantId === record.tenantId || allEditing ? (
            <QuotaEditItem
              record={record}
              name={QuotaName.MEMORY_QUOTA}
              initialValue={memoryQuota}
              unit="GiB"
              onQuotaUpdate={handleQuotaUpdate}
              initialEnvUnassignedQuota={envUnassignedMemoryQuotaMap[record.env]}
              currentEnvAddedQuotaList={editedTenantQuotaList.filter(
                ({ tenantId, env, changedMemoryQuota = 0 }) =>
                  env === record.env && changedMemoryQuota > 0 && tenantId !== record.tenantId,
              )}
              disabled={!memoryQuotaValid}
              onAddedValidate={handleAddedMemoryQuotaValidate}
              onRemovePreviewQuota={handleRemovePreviewQuota}
            />
          ) : (
            <>
              {memoryQuota}
              <UnitWrapper>GiB</UnitWrapper>
            </>
          ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) =>
          editingTenantId === record.tenantId ? (
            <Space direction="vertical" size={8}>
              <Typography.Link onClick={handleEditSave} disabled={!canSave}>
                Save
              </Typography.Link>
              <Typography.Link onClick={handleEditTenantCancel}>Cancel</Typography.Link>
            </Space>
          ) : (
            <Typography.Link
              disabled={editingTenantId ? editingTenantId !== record.tenantId : false}
              onClick={() => handleTenantEdit(record.tenantId)}
            >
              Edit
            </Typography.Link>
          ),
        onCell: (record) => ({
          rowSpan: record?.colSpan,
        }),
      },
    ],
    [
      allEditing,
      canSave,
      cpuQuotaValid,
      editedTenantQuotaList,
      editingTenantId,
      envUnassignedCpuQuotaMap,
      envUnassignedMemoryQuotaMap,
      handleEditSave,
      handleEditTenantCancel,
      memoryQuotaValid,
    ],
  )
  const columns = useMemo(
    () => (allEditing ? editingColumns.filter(({ key }) => key !== 'action') : editingColumns),
    [allEditing, editingColumns],
  )

  return (
    <>
      <Root paddingBottom={allEditing ? '36px' : ''}>
        <TitleWrapper>
          Organizations&apos; Quota
          <ActionWrapper>
            <Input.Search
              placeholder="Search Organization"
              style={{ width: 448, marginRight: '16px' }}
              onSearch={handleSearch}
              disabled={!!editingTenantId || allEditing}
            />
            <Button
              type="primary"
              style={{ verticalAlign: '50%' }}
              onClick={handleEditAll}
              disabled={!!editingTenantId || allEditing}
            >
              Edit Quota
            </Button>
          </ActionWrapper>
        </TitleWrapper>
        <EnvGroupWrapper>
          <span style={{ marginRight: '16px' }}>Env:</span>
          <Checkbox.Group
            options={envOptions}
            defaultValue={selectedEnvs}
            onChange={handleEnvSelect}
            disabled={!!editingTenantId || allEditing}
          />
        </EnvGroupWrapper>
        <Form form={form}>
          <Table
            columns={columns}
            loading={loading}
            rowKey={(record) => `${record.tenantId}-${record.env}`}
            dataSource={formattedTenantsQuotaList}
            pagination={false}
          />
        </Form>
        <ConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmitSuccess={handleSubmitSuccess}
          editedTenantEnvQuotaList={editedTenantQuotaList}
        />
      </Root>
      <ConfirmAction
        visible={allEditing}
        confirmDisabled={!canSave}
        onSave={handleEditSave}
        onCancel={handleEditAllCancel}
      />
    </>
  )
}

export default QuotaTable
