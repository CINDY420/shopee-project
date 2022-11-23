import React, { useState } from 'react'
import {
  StyledLayout,
  ContentWrapper,
  StyledContent,
  StyledPageHeader,
} from 'src/common-styles/layout'
import { Col, Row, Form, Input, Select, message, Switch, FormProps } from 'infrad'
import Submit from 'src/components/App/Cluster/AddEKSCluster/Submit'
import ClusterInfo from 'src/components/App/Cluster/AddEKSCluster/ClusterInfo'

import { HTTPError } from '@space/common-http'
import { useHistory } from 'react-router'
import { CLUSTER } from 'src/constants/routes/routes'
import { clusterController_addCluster } from 'src/swagger-api/apis/Cluster'
import { IAddClusterBody } from 'src/swagger-api/models'
import {
  globalController_listAllEcpVersions,
  globalController_listAllAZv1s,
} from 'src/swagger-api/apis/Global'
import { useRequest } from 'ahooks'
import { disableOAMDeployEcpVersions } from 'src/constants/cluster'

const AddEKSCluster: React.FC = () => {
  const history = useHistory()
  const handleClose = () => history.push(CLUSTER)
  const [inputtedClusterId, setInputtedClusterId] = useState<string>()
  const [clusterIdValid, setClusterIdValid] = useState<boolean>()

  const { data: allAZv1s } = useRequest(globalController_listAllAZv1s)
  const { data: allEcpVersions } = useRequest(globalController_listAllEcpVersions)

  const [form] = Form.useForm<IAddClusterBody>()

  const handleValuesChange: FormProps['onValuesChange'] = (values: IAddClusterBody) => {
    if (values?.clusterId) {
      setInputtedClusterId(values?.clusterId)
    }

    if (
      values?.ecpVersion &&
      !disableOAMDeployEcpVersions.includes(values?.ecpVersion.toLocaleLowerCase())
    ) {
      form.setFieldsValue({ ...values, useOam: true })
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await clusterController_addCluster({ payload: values })
      void message.success('Submit successfully!')
      handleClose()
    } catch (error) {
      if (error instanceof HTTPError) {
        await message.error(error.message)
      }
    }
  }

  return (
    <StyledLayout>
      <StyledPageHeader title="Add EKS Cluster" onBack={handleClose} />
      <ContentWrapper style={{ paddingBottom: 0 }}>
        <StyledContent>
          <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="clusterId"
                  label="Cluster ID"
                  rules={[{ required: true }]}
                  validateStatus={clusterIdValid === false ? 'error' : undefined}
                  help={clusterIdValid === false ? 'Cluster ID is incorrect or null.' : undefined}
                  extra={
                    clusterIdValid === undefined
                      ? 'Please ensure the cluster you are operating on is accurate by checking the cluster info.'
                      : undefined
                  }
                >
                  <Input style={{ width: '400px' }} placeholder="Please input Cluster ID" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <ClusterInfo
                clusterId={inputtedClusterId}
                onSuccess={() => setClusterIdValid(true)}
                onError={() => setClusterIdValid(false)}
              />
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="azV1" label="Belonging AZv1" rules={[{ required: true }]}>
                  <Select placeholder="Please select Belonging AZv1">
                    {allAZv1s?.items.sort().map((azV1) => (
                      <Select.Option key={azV1} value={azV1}>
                        {azV1}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="monitoringUrl"
                  label="Monitoring URL(prometheus data source)"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Please input Monitoring URL" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ecpVersion" label="Cluster Version" rules={[{ required: true }]}>
                  <Select placeholder="Please select Cluster Version">
                    {allEcpVersions?.items.sort().map((azV1) => (
                      <Select.Option key={azV1} value={azV1}>
                        {azV1}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="useOam" label="Use OAM to Deploy" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="useQuota" label="Add to Quota Management" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </StyledContent>
        <Submit onCancel={handleClose} onSubmit={handleSubmit} disableSubmit={!clusterIdValid} />
      </ContentWrapper>
    </StyledLayout>
  )
}

export default AddEKSCluster
