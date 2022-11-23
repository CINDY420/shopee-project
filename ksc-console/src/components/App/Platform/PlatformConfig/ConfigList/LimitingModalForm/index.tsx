import { StyledModalRoot } from 'components/App/Platform/PlatformConfig/ConfigList/style'
import { Alert, Form, InputNumber, Select } from 'infrad'
import React from 'react'
import { clusterControllerListClusters } from 'swagger-api/apis/Cluster'
import { IClusterListItem } from 'swagger-api/models'

const { Option } = Select
const LimitingModalForm = ({ form }) => {
  const [clusters, setClusters] = React.useState<IClusterListItem[]>([])

  const listAllClusters = async () => {
    const { items } = await clusterControllerListClusters({})
    setClusters(items)
  }

  React.useEffect(() => {
    listAllClusters()
  }, [])

  return (
    <StyledModalRoot>
      <Alert message="Please notice this action will effect pod schedule" type="info" showIcon />
      <br />
      <Form name="limiting" form={form} layout="vertical">
        <Form.Item
          label="Pod Scheduling"
          name="schedulePodPerSecond"
          rules={[
            {
              required: true,
              message: 'Please input schedule',
            },
          ]}
        >
          <InputNumber
            style={{ width: '592px' }}
            min={0}
            type="number"
            placeholder="Input schedule cycle pod amount"
            addonAfter="Second"
          />
        </Form.Item>
        <Form.Item
          label="Cluster"
          name="clusterId"
          rules={[
            {
              required: true,
              message: 'Please select cluster',
            },
          ]}
        >
          <Select>
            {clusters.map((cluster) => (
              <Option key={cluster.clusterId} value={cluster.clusterId}>
                {cluster.displayName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </StyledModalRoot>
  )
}

export default LimitingModalForm
