import React from 'react'
import { Form, Card, Input, Select, Checkbox, Empty, Button } from 'infrad'
import { NETWORKING_MODEL_ITEM_NAME } from 'src/components/App/Cluster/CreateCluster/constant'
import { IVpc } from 'src/swagger-api/models'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

interface INetworkingModelProps {
  enableVpcCNI?: boolean
  onEnableVpcCNIChange: (enable: boolean) => void
  vpcs: IVpc[]
  refreshVpcsFn: () => void
  vpcsLoading: boolean
}

const NetworkingModel: React.FC<INetworkingModelProps> = ({
  enableVpcCNI,
  vpcs = [],
  refreshVpcsFn,
  vpcsLoading,
  onEnableVpcCNIChange,
}) => {
  const handleEnableVpc = (e: CheckboxChangeEvent) => {
    const enabled = e.target.checked
    onEnableVpcCNIChange(enabled)
  }
  return (
    <Card title="Networking Model">
      <Form.Item name={NETWORKING_MODEL_ITEM_NAME.ENABLE_VPC_CNI} valuePropName="checked">
        <Checkbox onChange={handleEnableVpc}>VPC-CNI</Checkbox>
      </Form.Item>
      {enableVpcCNI && (
        <>
          <Form.Item label="VPC" name={NETWORKING_MODEL_ITEM_NAME.VPC} rules={[{ required: true }]}>
            <Select
              placeholder="Please select your target VPC"
              loading={vpcsLoading}
              notFoundContent={
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  imageStyle={{ width: '46' }}
                  description={
                    <>
                      <span>
                        There is no VPC on this AZ under your platform, please set up a VPC on SDN,
                        then refresh to select your target VPC.
                      </span>
                      <br />
                      Click to
                      <Button style={{ paddingLeft: '2px' }} type="link" onClick={refreshVpcsFn}>
                        Refresh
                      </Button>
                    </>
                  }
                />
              }
            >
              {vpcs.map(({ name }) => (
                <Select.Option key={name} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="AnchorServer"
            name={NETWORKING_MODEL_ITEM_NAME.ANCHOR_SERVER}
            rules={[
              {
                required: true,
                message:
                  'Maybe there is no AnchorServer on this AZ/Segment-Env, please confirm and input your target AnchorServer.',
              },
              {
                type: 'string',
                max: 255,
                message: 'Please enter less than 255 characters.',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </>
      )}
    </Card>
  )
}

export default NetworkingModel
