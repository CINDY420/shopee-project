import React from 'react'
import { Form, Card, InputNumber, Row, Col } from 'infrad'
import { Rule } from 'infrad/lib/form'
import {
  StyledInputNumber,
  DotWrapper,
} from 'src/components/App/Cluster/CreateCluster/BasicInfoForm/ClusterNetwork/style'
import {
  CLUSTER_NETWORK_SERVICES_CIDR_BLOCK_NAME,
  CLUSTER_NETWORK_POD_CIDR_BLOCK_NAME,
  CLUSTER_NETWORK_ITEM,
} from 'src/components/App/Cluster/CreateCluster/constant'
import {
  buildIPV4,
  isValidIPV4,
  isEmptyIpCidr,
} from 'src/components/App/Cluster/CreateCluster/helper'

/**
 * ip address v4 with cidr is like "192.168.20.0/17", and in the form:
 * "firstDDN" is "192", stands for the first  Dotted Decimal Notation(DDN);
 * "secondDDN" is "168",
 * "thirdDDN" is "20",
 * "fourthDDN" is "0",
 * "cidr" is "17"
 */

const validateServiceCidrRule: Rule = (form) => ({
  validator: () => {
    const serviceCidr = form.getFieldValue(CLUSTER_NETWORK_ITEM.SERVICES_CIDR_BLOCK)
    const ipV4 = buildIPV4(serviceCidr)
    if (isValidIPV4(ipV4)) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Your CidrBlock is illegal, please check it.'))
  },
})
const validatePodCidrRule: Rule = (form) => ({
  validator: () => {
    const podCidr = form.getFieldValue(CLUSTER_NETWORK_ITEM.POD_CIDR_BLOCK)
    if (isEmptyIpCidr(podCidr)) return Promise.resolve()
    const ipV4 = buildIPV4(podCidr)
    if (typeof podCidr?.cidr === 'number' && isValidIPV4(ipV4)) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Your CidrBlock is illegal, please check it.'))
  },
})

interface IClusterNetworkProps {
  vpcEnabled: boolean
}

const ClusterNetwork: React.FC<IClusterNetworkProps> = ({ vpcEnabled }) => (
  <Card title="Cluster Network">
    <Row>
      <Col span={8}>
        <Form.Item label="Services CidrBlock" required>
          <Form.Item
            name={CLUSTER_NETWORK_SERVICES_CIDR_BLOCK_NAME.FIRST_DDN}
            rules={[{ required: true, message: 'please enter!' }, validateServiceCidrRule]}
            noStyle
          >
            <StyledInputNumber controls={false} />
          </Form.Item>
          <DotWrapper>.</DotWrapper>
          <Form.Item name={CLUSTER_NETWORK_SERVICES_CIDR_BLOCK_NAME.SECOND_DDN} noStyle>
            <StyledInputNumber controls={false} />
          </Form.Item>
          <DotWrapper>.</DotWrapper>
          <Form.Item name={CLUSTER_NETWORK_SERVICES_CIDR_BLOCK_NAME.THIRD_DDN} noStyle>
            <StyledInputNumber controls={false} />
          </Form.Item>
          <DotWrapper>.</DotWrapper>
          <Form.Item name={CLUSTER_NETWORK_SERVICES_CIDR_BLOCK_NAME.FOURTH_DDN} noStyle>
            <StyledInputNumber controls={false} />
          </Form.Item>
          <DotWrapper>/</DotWrapper>
          <Form.Item
            name={CLUSTER_NETWORK_SERVICES_CIDR_BLOCK_NAME.CIDR}
            rules={[
              { type: 'number', min: 0, max: 128, message: 'cidr block must be between 0-128' },
            ]}
            noStyle
          >
            <StyledInputNumber controls={false} />
          </Form.Item>
        </Form.Item>
      </Col>
      {!vpcEnabled && (
        <>
          <Col span={8}>
            <Form.Item label="Pod CidrBlock">
              <Form.Item
                name={CLUSTER_NETWORK_POD_CIDR_BLOCK_NAME.FIRST_DDN}
                rules={[validatePodCidrRule]}
                noStyle
              >
                <StyledInputNumber controls={false} />
              </Form.Item>
              <DotWrapper>.</DotWrapper>
              <Form.Item name={CLUSTER_NETWORK_POD_CIDR_BLOCK_NAME.SECOND_DDN} noStyle>
                <StyledInputNumber controls={false} />
              </Form.Item>
              <DotWrapper>.</DotWrapper>
              <Form.Item name={CLUSTER_NETWORK_POD_CIDR_BLOCK_NAME.THIRD_DDN} noStyle>
                <StyledInputNumber controls={false} />
              </Form.Item>
              <DotWrapper>.</DotWrapper>
              <Form.Item name={CLUSTER_NETWORK_POD_CIDR_BLOCK_NAME.FOURTH_DDN} noStyle>
                <StyledInputNumber controls={false} />
              </Form.Item>
              <DotWrapper>/</DotWrapper>
              <Form.Item
                name={CLUSTER_NETWORK_POD_CIDR_BLOCK_NAME.CIDR}
                rules={[
                  { type: 'number', min: 0, max: 128, message: 'cidr block must be between 0-128' },
                ]}
                noStyle
              >
                <StyledInputNumber controls={false} />
              </Form.Item>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Node Mask"
              name={CLUSTER_NETWORK_ITEM.NODE_MASK}
              rules={[
                {
                  type: 'number',
                  min: 0,
                  max: 32,
                  message: 'The node mask must be within (0,32).',
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </>
      )}
    </Row>
  </Card>
)

export default ClusterNetwork
