import { Descriptions, Input, Space, Empty, Spin } from 'infrad'
import { UpOutlined, DownOutlined } from 'infra-design-icons'
import {
  Root,
  TitleWrapper,
  InfoWrapper,
  StyledEmpty,
  SpinWrapper,
} from 'src/components/App/Cluster/AddEKSCluster/ClusterInfo/style'
import { timestampToLocalTime } from 'src/helpers/time'
import { useEffect, useState } from 'react'
import { useDebounceFn } from 'ahooks'
import { eksClusterController_getClusterInfoByUuid } from 'src/swagger-api/apis/EksCluster'
import { IGetClusterInfoByUuidResponse } from 'src/swagger-api/models'

const { TextArea } = Input

enum FetchClusterInfoStatus {
  EMPTY,
  LOADING,
  SUCCESS,
}

interface IClusterInfoProps {
  clusterId?: string
  onSuccess: () => void
  onError: () => void
}

const emptyElement = (
  <div>
    <TitleWrapper>Cluster Info</TitleWrapper>
    <InfoWrapper>
      Please ensure the cluster you are operating on is accurate by checking the cluster info.
    </InfoWrapper>
    <StyledEmpty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </div>
)

const ClusterInfo: React.FC<IClusterInfoProps> = ({ clusterId, onSuccess, onError }) => {
  const [kubeconfigShow, setKubeconfigShow] = useState(false)
  const [clusterInfo, setClusterInfo] = useState<IGetClusterInfoByUuidResponse>()
  const [fetchClusterInfoStatus, setFetchClusterInfoStatus] = useState(FetchClusterInfoStatus.EMPTY)

  const { clusterName, AZv2, segment, createTime, kubeConfig } = clusterInfo || {}

  const { run: getClusterInfoDebounceFn } = useDebounceFn(
    async () => {
      if (!clusterId) return
      setFetchClusterInfoStatus(FetchClusterInfoStatus.LOADING)
      try {
        const clusterInfoData = await eksClusterController_getClusterInfoByUuid(
          {
            uuid: clusterId,
          },
          { disableError: true },
        )
        onSuccess()
        setFetchClusterInfoStatus(FetchClusterInfoStatus.SUCCESS)
        setClusterInfo(clusterInfoData)
      } catch (_error) {
        // PM don't want to show the error
        onError()
        setFetchClusterInfoStatus(FetchClusterInfoStatus.EMPTY)
      }
    },
    { wait: 500 },
  )

  const handleKubeconfigShow = () => {
    setKubeconfigShow((show) => !show)
  }

  useEffect(() => {
    void getClusterInfoDebounceFn()
  }, [clusterId, getClusterInfoDebounceFn])

  const clusterInfoElement = (
    <Space direction="vertical" size={24}>
      <Descriptions title={<TitleWrapper>Cluster Info</TitleWrapper>} column={3} bordered>
        <Descriptions.Item label="Cluster Name" span={3}>
          {clusterName}
        </Descriptions.Item>
        <Descriptions.Item label="Belonging AZv2">{AZv2}</Descriptions.Item>
        <Descriptions.Item label="Belonging Segment">{segment}</Descriptions.Item>
        <Descriptions.Item label="Create Time">
          {createTime && timestampToLocalTime(createTime)}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title={
          <TitleWrapper onClick={handleKubeconfigShow}>
            Kube Config
            {kubeconfigShow ? <UpOutlined /> : <DownOutlined />}
          </TitleWrapper>
        }
      >
        {kubeconfigShow && (
          <Descriptions.Item>
            <TextArea value={kubeConfig} rows={20} style={{ backgroundColor: '#fff' }} disabled />
          </Descriptions.Item>
        )}
      </Descriptions>
    </Space>
  )

  const clusterInfoElementMap = {
    [FetchClusterInfoStatus.EMPTY]: emptyElement,
    [FetchClusterInfoStatus.LOADING]: (
      <SpinWrapper>
        <Spin />
      </SpinWrapper>
    ),
    [FetchClusterInfoStatus.SUCCESS]: clusterInfoElement,
  }

  return <Root>{clusterInfoElementMap[fetchClusterInfoStatus]}</Root>
}

export default ClusterInfo
