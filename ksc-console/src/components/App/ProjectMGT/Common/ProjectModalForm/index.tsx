import * as React from 'react'
import { Checkbox, Form, FormInstance, Input, Space } from 'infrad'
import {
  StyledContentWrapper,
  StyledInput,
  StyledFormItem,
} from 'components/App/ProjectMGT/Common/ProjectModalForm/style'
import { HorizontalDivider } from 'common-styles/divider'
import ClusterList from 'components/App/ProjectMGT/Common/ProjectModalForm/ClusterList'
import { projectControllerGetProject } from 'swagger-api/apis/Project'
import { useParams } from 'react-router-dom'
import {
  IEnvClusterMetric,
  IOpenApiProjectUSS,
  IResponseClusterQuota,
  IResponseEnvQuota,
} from 'swagger-api/models'
import { tenantControllerGetTenant } from 'swagger-api/apis/Tenant'
import { removeUnitOfMemory } from 'helpers/format'

interface IProjectModalForm {
  form: FormInstance
  isEdit: boolean
  projectName?: string
  projectUSS?: IOpenApiProjectUSS
}

export interface IEnvQuotas extends IResponseClusterQuota {
  env: string
  isEnvChecked: boolean
}

export interface IFormattedClusters {
  clusterName: string
  envQuotas: IEnvQuotas[]
}

export interface ITenantClusterEnvMap {
  env: string
  clusterName: string
}

const generateFormClusterDatas = (
  envQuotas: IResponseEnvQuota[] | IEnvClusterMetric[],
  isEdit?: boolean,
) => {
  const result: Record<string, IFormattedClusters> = {}
  envQuotas.forEach((item) => {
    const { clusterQuota, env, clusterMetrics } = item
    ;(clusterQuota || clusterMetrics).forEach((cluster) => {
      const { clusterId, clusterName, quota } = cluster
      const { cpu, gpu, memory } = quota
      if (!result[clusterId]) {
        result[clusterId] = {
          clusterName,
          envQuotas: [],
        }
      }
      result[clusterId].envQuotas.push({
        env,
        clusterId,
        clusterName,
        quota: {
          cpu,
          gpu,
          // remove the unit of memory and get the number
          memory: removeUnitOfMemory(memory),
        },
        isEnvChecked: !!isEdit,
      })
    })
  })
  return result
}

const mergeEnvQuotas = (originEnvQuotas: IEnvQuotas[], newEnvQuotas: IEnvQuotas[]) => {
  const envMaps: Record<string, IEnvQuotas> = {}
  newEnvQuotas.forEach((item) => {
    envMaps[item.env] = item
  })
  return originEnvQuotas.map((item) => envMaps[item.env] ?? item)
}

const mergeClusters = (
  originData: Record<string, IFormattedClusters>,
  newData: Record<string, IFormattedClusters>,
) => {
  const result: Record<string, IFormattedClusters> = {}
  Object.entries(originData ?? {}).forEach(([clusterId, clusterDetail]) => {
    const { envQuotas: originEnvQuotas } = clusterDetail
    const clusterName = originEnvQuotas[0].clusterName
    const newEnvQuotas = newData[clusterId]?.envQuotas
    result[clusterId] = {
      clusterName,
      envQuotas: newEnvQuotas ? mergeEnvQuotas(originEnvQuotas, newEnvQuotas) : originEnvQuotas,
    }
  })
  return result
}

const ProjectModalForm: React.FC<IProjectModalForm> = ({
  form,
  isEdit,
  projectName,
  projectUSS,
}) => {
  const [isUSSRequired, setIsUSSRequired] = React.useState(false)
  const [isClusterCheckedAll, setIsClusterCheckedAll] = React.useState(false)
  const [isClusterCheckAllIndeterminate, setIsClusterCheckAllIndeterminate] = React.useState(false)
  const [clustersDetail, setClustersDetail] = React.useState<Record<string, IFormattedClusters>>({})
  const formClusters: Record<string, IFormattedClusters> = Form.useWatch(['clusters'], form)

  const { tenantId, projectId } = useParams()

  const getTenantClusters = React.useCallback(async () => {
    if (tenantId) {
      const { envQuotas = [] } = await tenantControllerGetTenant({ tenantId })

      const formattedClusters = generateFormClusterDatas(envQuotas)
      form.setFieldsValue({ clusters: formattedClusters })
      setClustersDetail(formattedClusters)
    }
  }, [tenantId])

  const getProjectInitialClusters = React.useCallback(async () => {
    if (tenantId && projectId) {
      const { envClusterMetrics = [], logStore } = await projectControllerGetProject({
        tenantId,
        projectId,
      })
      const formattedClusters = generateFormClusterDatas(envClusterMetrics, true)
      const mergedClusters = mergeClusters(form.getFieldValue('clusters'), formattedClusters)
      form.setFieldsValue({
        projectName,
        uss: projectUSS,
        clusters: mergedClusters,
        logStore,
      })
      setClustersDetail(mergedClusters)
    }
  }, [projectId, tenantId])

  React.useEffect(() => {
    getTenantClusters().then(() => {
      isEdit && getProjectInitialClusters()
    })
  }, [isEdit, getProjectInitialClusters, getTenantClusters])

  const handleUSSChange = () => {
    const ussValue = form.getFieldValue('uss')
    const value = Object.values(ussValue).find((item) => item)
    setIsUSSRequired(!!value)
  }

  React.useEffect(() => {
    if (formClusters) {
      const clustersEnvQuotas = Object.values(formClusters).flatMap((item) => item.envQuotas)
      const checkedEnvs = clustersEnvQuotas.filter((item) => item?.isEnvChecked)
      if (clustersEnvQuotas.length > 0 && checkedEnvs.length === clustersEnvQuotas.length) {
        setIsClusterCheckedAll(true)
        setIsClusterCheckAllIndeterminate(false)
      } else if (checkedEnvs.length > 0) {
        setIsClusterCheckedAll(false)
        setIsClusterCheckAllIndeterminate(true)
      } else {
        setIsClusterCheckedAll(false)
        setIsClusterCheckAllIndeterminate(false)
      }
    }
  }, [formClusters])

  const handleClusterCheckAllChange = (checked) => {
    const clusters: Record<string, IFormattedClusters> = form.getFieldValue('clusters')
    const newClusters = {}
    Object.entries(clusters).forEach(([clusterId, clusterDetail]) => {
      newClusters[clusterId] = {
        envQuotas: clusterDetail.envQuotas.map((item) => {
          item.isEnvChecked = checked
          return item
        }),
      }
    })
    form.setFieldsValue({ clusters })
  }

  return (
    <StyledContentWrapper>
      <HorizontalDivider size="32px" />
      <Form labelCol={{ span: 4 }} form={form}>
        <Form.Item
          label="Project Name"
          name="projectName"
          rules={[{ required: true, message: 'Please input project name!' }]}
        >
          {isEdit === false ? (
            <StyledInput placeholder="Must Only consist of lowercase alphanumeric(a-z0-9)" />
          ) : (
            <div>{projectName}</div>
          )}
        </Form.Item>
        <Form.Item label="Cluster" required>
          <Form.Item style={{ margin: 0 }}>
            <Checkbox
              checked={isClusterCheckedAll}
              indeterminate={isClusterCheckAllIndeterminate}
              onChange={(e) => handleClusterCheckAllChange(e.target.checked)}
            >
              All
            </Checkbox>
          </Form.Item>
          {Object.entries(clustersDetail).map(([clusterId, clusterItem]) => (
            <ClusterList key={clusterId} clusterItem={clusterItem} clusterId={clusterId} />
          ))}
        </Form.Item>
        <Form.Item
          label="USS"
          tooltip={
            <>
              if you need use spfs,please fill in this field.
              <br />
              if you need use spos, you don&apos;t need to fill it out
            </>
          }
        >
          <Space wrap>
            <StyledFormItem
              name={['uss', 'appId']}
              rules={[
                {
                  required: isUSSRequired,
                  message: 'Please input appId',
                },
              ]}
            >
              <Input addonBefore="APPID" placeholder="Please input" onChange={handleUSSChange} />
            </StyledFormItem>
            <StyledFormItem
              name={['uss', 'appSecret']}
              rules={[
                {
                  required: isUSSRequired,
                  message: 'Please input appSecret',
                },
              ]}
            >
              <Input
                addonBefore="App Secret"
                placeholder="Please Input"
                onChange={handleUSSChange}
              />
            </StyledFormItem>
            <StyledFormItem
              name={['uss', 'metaUrl']}
              rules={[
                {
                  required: isUSSRequired,
                  message: 'Please input metaUrl',
                },
              ]}
            >
              <Input addonBefore="MetaURL" placeholder="Please input" onChange={handleUSSChange} />
            </StyledFormItem>
            <StyledFormItem
              name={['uss', 'name']}
              rules={[
                {
                  required: isUSSRequired,
                  message: 'Please input name',
                },
              ]}
            >
              <Input addonBefore="Name" placeholder="Please input" onChange={handleUSSChange} />
            </StyledFormItem>
          </Space>
        </Form.Item>
        <Form.Item
          label="LogStore Name"
          name="logStore"
          tooltip="If you want to view Job log, please input Log platform's logstore name"
        >
          <Input placeholder="Please input log platform logstore name" />
        </Form.Item>
      </Form>
    </StyledContentWrapper>
  )
}
export default ProjectModalForm
