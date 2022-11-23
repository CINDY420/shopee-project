import React from 'react'
import { Form, Card, Row, Col, Select, Input } from 'infrad'
import { CLUSTER_SPEC_ITEM_NAME } from 'src/components/App/Cluster/CreateCluster/constant'

import { IEksPlatform } from 'src/swagger-api/models'
import { buildNameIdValue } from 'src/components/App/Cluster/CreateCluster/helper'

interface IClusterSpecProps {
  platforms: IEksPlatform[]
  kuernetesVersions: string[]
}

const ClusterSpec: React.FC<IClusterSpecProps> = ({ platforms = [], kuernetesVersions = [] }) => (
  <Card title="Cluster Spec">
    <Row gutter={[24, 0]}>
      <Col span={8}>
        <Form.Item
          label="Cluster Name"
          name={CLUSTER_SPEC_ITEM_NAME.CLUSTER_NAME}
          rules={[
            { required: true },
            {
              type: 'string',
              max: 64,
              message: 'Please enter a cluster name smaller than 64 characters.',
            },
          ]}
          normalize={(clusterName: string) => clusterName.trim()}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="Platform"
          name={CLUSTER_SPEC_ITEM_NAME.PLATFORM}
          rules={[{ required: true }]}
        >
          <Select>
            {platforms.map((option) => (
              <Select.Option key={option.name} value={buildNameIdValue(option.name, option.id)}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="Kubernetes Version"
          name={CLUSTER_SPEC_ITEM_NAME.KUBERNETES_VERSION}
          rules={[{ required: true }]}
        >
          <Select>
            {kuernetesVersions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  </Card>
)

export default ClusterSpec
