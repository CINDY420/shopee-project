import { useState, useEffect, useCallback } from 'react'
import { Button, Form, message } from 'infrad'
import {
  projectControllerGetProject,
  projectControllerUpdateProject,
} from 'swagger-api/apis/Project'
import { IProjectListItem, IClusterMetric, IOpenApiProjectUSS } from 'swagger-api/models'
import { RESOURCE_CONFIG_LIST, IResource } from 'constants/resource'
import {
  StyledInput,
  StyledTable,
} from 'components/App/ProjectMGT/TenantDetail/Content/ProjectList/QuotasTable/style'
import { ColumnsType } from 'infrad/lib/table'
import useCheckRoles from 'hooks/useCheckRoles'
import { PLATFORM_ADMIN_ID, TENANT_ADMIN_ID } from 'constants/auth'

interface IQuotasTableProps {
  params: IProjectListItem
}
interface ITableData extends IClusterMetric {
  env: string
  rowSpan: number
}

const QuotasTable = ({ params }: IQuotasTableProps) => {
  const { tenantId, projectId } = params
  const [tableDataList, setTableDataList] = useState<Array<ITableData>>([])
  const [projectName, setProjectName] = useState('')
  const [logStore, setLogStore] = useState('')
  const [uss, setUss] = useState<IOpenApiProjectUSS>()
  const [editingEnv, setEditingEnv] = useState('')
  const [form] = Form.useForm()

  const canEditProject = useCheckRoles([
    {
      roleId: PLATFORM_ADMIN_ID,
    },
    {
      roleId: TENANT_ADMIN_ID,
      tenantId,
    },
  ])

  const getTableData = useCallback(async () => {
    const {
      envClusterMetrics = [],
      displayName,
      uss,
      logStore,
    } = await projectControllerGetProject({
      tenantId,
      projectId,
    })
    const tableDataList = envClusterMetrics.flatMap((item) =>
      (item.clusterMetrics || []).map((cluster, index) => ({
        env: item.env,
        rowSpan: !index ? item.clusterMetrics.length : 0,
        ...cluster,
      })),
    )
    setTableDataList(tableDataList)
    setProjectName(displayName)
    setLogStore(logStore)
    setUss(uss)
  }, [tenantId, projectId])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  const isEditing = (record: ITableData) => record.env === editingEnv

  const handleEdit = (record: ITableData) => {
    setEditingEnv(record.env)
  }

  const handleCancel = () => {
    form.resetFields()
    setEditingEnv('')
  }

  const handleSave = async (record: ITableData) => {
    const env = record.env
    const editedTableDataList = tableDataList.filter((item) => item.env === env)
    const clusterQuotas = editedTableDataList.map((item) => {
      const { clusterId, quota } = item
      const { memory } = quota
      return {
        clusterId,
        quota: {
          ...quota,
          memory: `${memory}Gi`,
        },
      }
    })
    try {
      await projectControllerUpdateProject({
        tenantId,
        projectId,
        payload: {
          projectName,
          envQuotas: [
            {
              env,
              clusterQuota: clusterQuotas,
            },
          ],
          uss,
          logStore,
        },
      })
      setEditingEnv('')
      message.success('edit project success')
    } catch (error) {
      message.error(error?.message || 'Edit project failed')
    }
  }

  const handleQuotaChange = (value: string, record: ITableData, key: string) => {
    record.quota[key] = Number(value)
  }

  const renderChildColumns = (parentConfig: IResource): ColumnsType<unknown> =>
    ['Used', 'Assigned', 'Quota'].map((item) => {
      const key = item.toLocaleLowerCase()
      const canEdit = item === 'Quota'
      return {
        title: item,
        dataIndex: key,
        key,
        render: (_, record: ITableData) => {
          if (canEdit)
            return (
              <Form.Item
                name={[record.env, record.clusterName, 'quota', parentConfig.key]}
                initialValue={record?.[key]?.[parentConfig.key]}
                noStyle
              >
                <StyledInput
                  suffix={parentConfig.suffix}
                  onChange={(e) => handleQuotaChange(e.target.value, record, parentConfig.key)}
                  disabled={!canEdit || !isEditing(record)}
                />
              </Form.Item>
            )

          return (
            <StyledInput
              suffix={parentConfig.suffix}
              defaultValue={record?.[key]?.[parentConfig.key]}
              disabled
            />
          )
        },
      }
    })

  const renderColumns = (): ColumnsType<unknown> =>
    RESOURCE_CONFIG_LIST.map((item) => ({
      title: item.before,
      children: renderChildColumns(item),
    }))

  const columns = [
    {
      title: 'Env',
      dataIndex: 'env',
      key: 'env',
      render: (env: string, record: ITableData) => ({
        children: env,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
    },
    {
      title: 'Cluster',
      dataIndex: 'clusterName',
      key: 'clusterName',
    },
    ...renderColumns(),
  ]

  canEditProject &&
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_, record: ITableData) => ({
        children: isEditing(record) ? (
          <>
            <Button type="link" onClick={() => handleSave(record)}>
              Save
            </Button>
            <Button type="link" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
        ),

        props: {
          rowSpan: record.rowSpan,
        },
      }),
    })

  return (
    <Form form={form}>
      <StyledTable
        rowKey="clusterId"
        bordered
        columns={columns}
        dataSource={tableDataList}
        pagination={false}
      />
    </Form>
  )
}

export default QuotasTable
