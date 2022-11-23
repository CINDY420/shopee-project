import React from 'react'
import { Modal, Form, Select, message, Button } from 'infrad'
import {
  StyledDescription,
  StyledForm,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/AddNode/style'
import {
  eksNodeController_getNodeGroupList,
  eksNodeController_addNodes,
} from 'src/swagger-api/apis/EksNode'
import { INodeGroupItem, IEksGetClusterDetailResponse } from 'src/swagger-api/models'
import { useParams } from 'react-router-dom'
import {
  NodeContext,
  getDispatchers,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/useNodeContext'
import { CLUSTER_STATUS_TYPE } from 'src/components/App/Cluster/ClusterTable'

interface IAddNodeProps {
  clusterDetail: IEksGetClusterDetailResponse
}

const AddNode: React.FC<IAddNodeProps> = (props) => {
  const { clusterDetail } = props
  const [form] = Form.useForm()
  const [nodeGroupList, setNodeGroupList] = React.useState<INodeGroupItem[]>()
  const [isAddNodeModalVisible, setIsAddNodeModalVisible] = React.useState(false)

  const { dispatch } = React.useContext(NodeContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { clusterId } = useParams<{
    clusterId: string
  }>()

  const getGroupNodeList = React.useCallback(async () => {
    const { nodeGroups } = await eksNodeController_getNodeGroupList({
      clusterId: Number(clusterId),
    })
    setNodeGroupList(nodeGroups)
  }, [clusterId])

  React.useEffect(() => {
    getGroupNodeList()
  }, [getGroupNodeList])

  const handleConfirm = async () => {
    const formValues = await form.validateFields()
    const { ipList, nodeGroup } = formValues
    const payload = {
      hostIPs: ipList,
      nodeGroupId: nodeGroup,
    }
    await eksNodeController_addNodes({ clusterId: Number(clusterId), payload })
    message.success('Add node successfully')
    dispatchers.requestRefresh()
    setIsAddNodeModalVisible(false)
  }

  const handleCancel = () => {
    setIsAddNodeModalVisible(false)
    form.resetFields()
  }

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsAddNodeModalVisible(true)}
        disabled={clusterDetail?.status === CLUSTER_STATUS_TYPE.PROVISIONING}
      >
        Add Node
      </Button>
      <Modal
        title="Add Node"
        visible={isAddNodeModalVisible}
        getContainer={document.body}
        width={884}
        onCancel={handleCancel}
        onOk={handleConfirm}
        okText="Confirm"
        destroyOnClose
      >
        <StyledDescription title="Basic Information">
          <StyledDescription.Item label="AZ">{clusterDetail?.AZv2}</StyledDescription.Item>
          <StyledDescription.Item label="Env">{clusterDetail?.env}</StyledDescription.Item>
          <StyledDescription.Item label="Platform">
            {clusterDetail?.platformName}
          </StyledDescription.Item>
        </StyledDescription>
        <StyledForm form={form}>
          <Form.Item
            name="nodeGroup"
            rules={[{ required: true, message: 'Please select node group' }]}
            label="Nodegroup"
            style={{ width: '400px' }}
          >
            <Select>
              {nodeGroupList?.map((item) => (
                <Select.Option key={item?.nodeGroupId} value={item?.nodeGroupId}>
                  {item?.nodeGroupName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ipList"
            rules={[{ required: true, message: 'Please input ip' }]}
            label="IP List"
          >
            <Select mode="tags" allowClear style={{ width: '100%' }} />
          </Form.Item>
        </StyledForm>
      </Modal>
    </>
  )
}

export default AddNode
