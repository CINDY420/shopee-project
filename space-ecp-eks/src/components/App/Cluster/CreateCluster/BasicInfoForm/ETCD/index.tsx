import React from 'react'
import { Form, Card, Select, Input } from 'infrad'
import { CertificateWrapper } from 'src/components/App/Cluster/CreateCluster/BasicInfoForm/ETCD/style'
import { ETCD_ITEM_NAME } from 'src/components/App/Cluster/CreateCluster/constant'
import { antdFormIPV4ListValidator } from 'src/components/App/Cluster/CreateCluster/helper'

const ETCD: React.FC = () => (
  <Card title="ETCD">
    <Form.Item
      label="ETCD IPs"
      name={ETCD_ITEM_NAME.ETCD_IPS}
      normalize={(ips: string[]) => ips.map((ip) => ip.trim())}
      rules={[
        { required: true },
        {
          validator: (_, ips: string[]) => antdFormIPV4ListValidator(ips),
        },
      ]}
    >
      <Select
        mode="tags"
        tokenSeparators={[',']}
        open={false}
        allowClear
        placeholder='Please enter the target IPs, separated by commas(",")'
      />
    </Form.Item>
    <CertificateWrapper>Certificate:</CertificateWrapper>
    <Form.Item
      label="SSL Certificate Authority file"
      name={ETCD_ITEM_NAME.AUTHORITY}
      normalize={(value: string) => value.trim()}
      rules={[{ required: true }]}
    >
      <Input.TextArea rows={5} />
    </Form.Item>
    <Form.Item
      label="Client SSL certificate file"
      name={ETCD_ITEM_NAME.CERTIFICATION}
      normalize={(value: string) => value.trim()}
      rules={[{ required: true }]}
    >
      <Input.TextArea rows={5} />
    </Form.Item>
    <Form.Item
      label="Client SSL key file"
      name={ETCD_ITEM_NAME.KEY}
      normalize={(value: string) => value.trim()}
      rules={[{ required: true }]}
    >
      <Input.TextArea rows={5} />
    </Form.Item>
  </Card>
)

export default ETCD
