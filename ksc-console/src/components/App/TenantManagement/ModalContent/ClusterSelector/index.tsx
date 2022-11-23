import * as React from 'react'
import { Checkbox, FormInstance, Table } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import { getNumFromString } from 'helpers/format'
import {
  StyledInput,
  QuotaContentWrapper,
  QuotaItemWrapper,
  QuotaName,
} from 'components/App/TenantManagement/ModalContent/ClusterSelector/style'
import {
  IDisplayQuota,
  IClusterListItem,
  IResponseClusterQuota,
  IResponseEnvQuota,
} from 'swagger-api/models'
import { QUOTA } from 'constants/global'

interface IClusterSelectorProps {
  form: FormInstance
  clusters?: IClusterListItem[]
  checkedEnvList: string[]
  listClusters: IClusterListItem[]
  initialClusterData: IResponseEnvQuota[]
}
interface ITr extends IResponseClusterQuota {
  env: string
  rowSpan?: number
}

interface IEnvsAndClusters {
  env: string
  cluster: IClusterListItem
}

enum OPERATION {
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
}

const QUOTA_MAPS = [
  {
    quotaName: 'CPU',
    unit: 'Cores',
    displayName: 'cpu',
  },
  {
    quotaName: 'Memory',
    unit: 'GiB',
    displayName: 'memory',
  },
  {
    quotaName: 'GPU',
    unit: 'Units',
    displayName: 'gpu',
  },
]

const transformQuotaArrayToObject = (
  envQuotas: IResponseEnvQuota[],
): Record<string, IResponseClusterQuota[]> =>
  envQuotas?.reduce((result, current) => {
    const { env, clusterQuota: clusterQuotaList } = current
    if (!result[env]) result[env] = []

    result[env] = result[env].concat(clusterQuotaList)
    return result
  }, {})

const generateEditedEnvQuotas = (
  originData: IResponseEnvQuota[] | undefined,
  currentValue: ITr,
  type: OPERATION,
): IResponseEnvQuota[] => {
  const { clusterId, quota, env, clusterName } = currentValue
  const currentClusterQuota: IResponseClusterQuota = { clusterId, quota, clusterName }
  if (!originData || originData.length === 0)
    return [
      {
        env,
        clusterQuota: [currentClusterQuota],
      },
    ]

  const originDataMap = transformQuotaArrayToObject(originData)
  const originClusterQuotas = originDataMap?.[env]
  if (originClusterQuotas) {
    let editedClusterQuotas: IResponseClusterQuota[] = []
    switch (type) {
      case OPERATION.ADD:
        editedClusterQuotas = originClusterQuotas.concat(currentClusterQuota)
        break
      case OPERATION.DELETE:
        editedClusterQuotas = originClusterQuotas.filter((item) => item.clusterId !== clusterId)
        break
      case OPERATION.UPDATE:
        editedClusterQuotas = originClusterQuotas.map((item) =>
          item.clusterId === clusterId ? currentClusterQuota : item,
        )
        break
    }

    originDataMap[env] = editedClusterQuotas
    return Object.entries(originDataMap).reduce((result: IResponseEnvQuota[], currentData) => {
      const [key, quotas] = currentData
      quotas.length > 0 &&
        result.push({
          env: key,
          clusterQuota: quotas,
        })
      return result
    }, [])
  }
  return [
    ...originData,
    {
      env,
      clusterQuota: [currentClusterQuota],
    },
  ]
}

const transformEnvQuotasToTableData = (data: IResponseEnvQuota[] | undefined): ITr[] => {
  if (!data) return []
  const tableObject = transformQuotaArrayToObject(data)
  const tableDataList = Object.entries(tableObject).flatMap((item) => {
    const [env, clusterQuotas = []] = item
    return clusterQuotas.map((clusterQuota, index) => ({
      env,
      ...clusterQuota,
      rowSpan: !index ? clusterQuotas.length : 0,
    }))
  })
  return tableDataList
}

const getExistClusters = (initialClusterData: IResponseEnvQuota[]) => {
  const existClusters: Record<string, Array<string>> = {}
  initialClusterData.forEach((envQuota: IResponseEnvQuota) => {
    envQuota.clusterQuota.forEach((clusterQuota: IResponseClusterQuota) => {
      if (!existClusters[clusterQuota.clusterId]) existClusters[clusterQuota.clusterId] = []

      existClusters[clusterQuota.clusterId].push(envQuota.env)
    })
  })
  return existClusters
}

const isExistedCluster = (
  existClusters: Record<string, Array<string>>,
  clusterId: string,
  env: string,
): boolean => existClusters[clusterId] && existClusters[clusterId].indexOf(env) !== -1

const ClusterSelector: React.FC<IClusterSelectorProps> = ({
  form,
  checkedEnvList,
  listClusters,
  initialClusterData,
}) => {
  const [clusterTableDataList, setClusterTableDataList] = React.useState<IResponseEnvQuota[]>()
  const [existClusters, setExistClusters] = React.useState<Record<string, Array<string>>>({})

  const updatedFormData = (record: ITr, operation: OPERATION) => {
    const values = form.getFieldsValue()
    const { envQuotas: originData, ...rest } = values
    const editedDataList = generateEditedEnvQuotas(originData, record, operation)
    form.setFieldsValue({
      ...rest,
      envQuotas: [...editedDataList],
    })
  }

  const updateExistClusters = (checked: boolean, record: ITr) => {
    const { env, clusterId } = record
    if (!existClusters[clusterId]) {
      existClusters[clusterId] = []
    }
    if (checked) {
      existClusters[clusterId].push(env)
    } else {
      existClusters[clusterId] = existClusters[clusterId].filter((item) => item !== env)
    }
    setExistClusters(existClusters)
  }

  const handleClusterChange = (checked: boolean, record: ITr) => {
    updateExistClusters(checked, record)
    updatedFormData(record, checked ? OPERATION.ADD : OPERATION.DELETE)
  }

  const mergeAllEnvsAndClusters = React.useCallback(
    (): IEnvsAndClusters[] =>
      checkedEnvList.flatMap((env) => listClusters.map((cluster) => ({ env, cluster }))),
    [checkedEnvList, listClusters],
  )

  const filterNewEnvsAndClusters = React.useCallback(
    (
      envsAndClusters: Array<IEnvsAndClusters>,
      existClusters: Record<string, Array<string>>,
    ): Array<IEnvsAndClusters> =>
      envsAndClusters.filter(
        (item) => !isExistedCluster(existClusters, item.cluster.clusterId, item.env),
      ),
    [],
  )

  const generateTableData = React.useCallback(
    (existClusters: Record<string, Array<string>>): void => {
      const newEnvsAndClusters = filterNewEnvsAndClusters(mergeAllEnvsAndClusters(), existClusters)
      const newTableRowDatas = newEnvsAndClusters.map((item) => ({
        env: item.env,
        clusterQuota: [
          {
            clusterId: item.cluster.clusterId,
            clusterName: item.cluster.displayName,
            quota: {
              cpu: 1,
              gpu: 0,
              memory: '1Gi',
            },
          },
        ],
      }))
      setClusterTableDataList([...initialClusterData, ...newTableRowDatas])
    },
    [initialClusterData, filterNewEnvsAndClusters, mergeAllEnvsAndClusters],
  )

  React.useEffect(() => {
    const existClusters = getExistClusters(initialClusterData)
    setExistClusters(existClusters)
    generateTableData(existClusters)
  }, [initialClusterData, generateTableData])

  const handleInputChange = (value: string, quotaKey: string, record: ITr) => {
    record.quota[quotaKey] = quotaKey === QUOTA.MEMORY ? `${value}Gi` : Number(value)
    if (isExistedCluster(existClusters, record.clusterId, record.env)) {
      updatedFormData(record, OPERATION.UPDATE)
    }
  }

  const columns: ColumnsType<ITr> = [
    {
      title: 'Env',
      dataIndex: 'env',
      key: 'env',
      render: (env: string, record) => ({
        children: env,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
    },
    {
      title: 'Cluster',
      dataIndex: 'clusterName',
      key: 'cluster',
      render: (clusterName: string, record) => (
        <Checkbox
          defaultChecked={isExistedCluster(existClusters, record.clusterId, record.env)}
          onChange={(e) => handleClusterChange(e.target.checked, record)}
        >
          {clusterName}
        </Checkbox>
      ),
    },
    {
      title: 'Resource Applied (Quota)',
      dataIndex: 'quota',
      key: 'quota',
      render: (quota: IDisplayQuota, record) => (
        <QuotaContentWrapper>
          {QUOTA_MAPS.map((quotaItem) => (
            <QuotaItemWrapper key={quotaItem.quotaName}>
              <QuotaName>{quotaItem.quotaName}</QuotaName>
              <StyledInput
                width="112px"
                defaultValue={
                  typeof quota[quotaItem.displayName] === 'string'
                    ? getNumFromString(quota[quotaItem.displayName])
                    : quota[quotaItem.displayName]
                }
                suffix={quotaItem.unit}
                bordered={false}
                onChange={(e) => handleInputChange(e.target.value, quotaItem.displayName, record)}
              />
            </QuotaItemWrapper>
          ))}
        </QuotaContentWrapper>
      ),
    },
  ]
  return (
    <Table
      rowKey={(record) => `${record.env}-${record.clusterId}`}
      bordered
      pagination={false}
      dataSource={transformEnvQuotasToTableData(clusterTableDataList)}
      columns={columns}
    />
  )
}

export default ClusterSelector
