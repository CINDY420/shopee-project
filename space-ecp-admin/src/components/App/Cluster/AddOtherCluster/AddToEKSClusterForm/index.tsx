import { useRequest } from 'ahooks'
import { Col, Form, Input, Radio, Row, Select, FormInstance } from 'infrad'
import { Rule } from 'infrad/lib/form'
import { useState } from 'react'
import {
  ETCDWrapper,
  StyledTextArea,
  Title,
} from 'src/components/App/Cluster/AddOtherCluster/AddToEKSClusterForm/style'
import ServiceNameCascader from 'src/components/App/Cluster/AddOtherCluster/ServiceNameCascader'
import {
  eksEnumsController_listAllAzSegment,
  eksEnumsController_listAllEnvs,
} from 'src/swagger-api/apis/EksEnums'
import { IEksSegment, IAddToEKSClusterBody, IETCDConfig } from 'src/swagger-api/models'

export type IEKSForm = Omit<IAddToEKSClusterBody, 'etcdConfig'> & IETCDConfig

interface IAddToEksClusterFormProps {
  form: FormInstance<IEKSForm>
}

interface IEksFormItemProps {
  label: string
  name: string
  placeholder?: string
  rules?: Rule[]
}

const EksFormItemPropsMap: Record<
  keyof Omit<IEKSForm, 'serviceId' | 'azv2Key' | 'segmentKey'>,
  IEksFormItemProps
> = {
  serviceName: {
    label: 'Service Name',
    name: 'serviceName',
    placeholder: 'Please select Service Name',
    rules: [{ required: true, message: 'Please select Service Name' }],
  },
  displayName: {
    label: 'Display name',
    name: 'displayName',
    placeholder: 'Please input Display name, up to 256 characters',
    rules: [{ required: true, message: 'Please input Display name, up to 256 characters' }],
  },
  azv2: {
    label: 'Belonging AZv2',
    name: 'azv2',
    placeholder: 'Please select Belonging AZv2',
    rules: [{ required: true, message: 'Please select Belonging AZv2' }],
  },
  segment: {
    label: 'Belonging Segment',
    name: 'segment',
    placeholder: 'Please select Belonging Segment',
    rules: [{ required: true, message: 'Please select Belonging Segment' }],
  },
  env: {
    label: 'Env',
    name: 'env',
    placeholder: 'Please select Env',
    rules: [{ required: true, message: 'Please select Env' }],
  },
  uuid: {
    label: 'Cluster Uuid',
    name: 'uuid',
    placeholder: 'Please input Cluster Uuid',
    rules: [{ required: true, message: 'Please input Cluster Uuid' }],
  },
  deployedGalio: {
    label: 'Deployed by Galio',
    name: 'deployedGalio',
    rules: [{ required: true, message: 'Please select' }],
  },
  monitoringName: {
    label: 'Monitoring Platform Store Name',
    name: 'monitoringName',
    placeholder: 'Please input Monitoring URL',
    rules: [{ required: true, message: 'Please input Monitoring URL' }],
  },
  etcdIPs: {
    label: 'ETCD IPs',
    name: 'etcdIPs',
    placeholder: 'Please enter the ETCD IPs, separated by commas(",")',
    rules: [{ required: true, message: 'Please enter the ETCD IPs, separated by commas(",")' }],
  },
  sslCA: {
    label: 'SSL Certificate Authority file',
    name: 'sslCA',
    placeholder: 'Please input your target SSL Certificate Authority file',
  },
  sslCertificate: {
    label: 'Client SSL certification file',
    name: 'sslCertificate',
    placeholder: 'Please input your target Client SSL certification file',
  },
  sslKey: {
    label: 'Client SSL key file',
    name: 'sslKey',
    placeholder: 'Please input your target Client SSL key file',
  },
  labels: {
    label: 'Label',
    name: 'labels',
    placeholder: 'Please enter the labels, separated by commas(",")',
  },
  description: {
    label: 'Description',
    name: 'description',
    placeholder: 'Please input Description',
  },
  kubeConfig: {
    label: 'Kube Config',
    name: 'kubeConfig',
    placeholder: 'Please input kube config',
    rules: [{ required: true, message: 'Please input kube config' }],
  },
}

const listAllAzSegment = async () => {
  const data = await eksEnumsController_listAllAzSegment()
  return data?.items.sort((pre, cur) => (pre?.azName > cur?.azName ? 1 : -1))
}

const AddToEksClusterForm: React.FC<IAddToEksClusterFormProps> = ({ form }) => {
  const { data: azv2SegmentResponse } = useRequest(listAllAzSegment)
  const { data: envs } = useRequest(eksEnumsController_listAllEnvs)
  const [segmentOptions, setSegmentOptions] = useState<
    (IEksSegment & { segmentKeyName: string })[]
  >([])

  const azv2Options = azv2SegmentResponse?.map(({ azName, azKey, segments }) => ({
    azKey,
    azName,
    segments,
    // Select get multi fields
    azKeyName: JSON.stringify({ azName, azKey }),
  }))

  const handleAZv2Change = (value: string) => {
    const selectedAZv2Segments = azv2Options?.find((item) => item.azKeyName === value)
    setSegmentOptions(
      selectedAZv2Segments?.segments.map(({ segmentKey, segmentName }) => ({
        segmentKey,
        segmentName,
        // Select get multi fields
        segmentKeyName: JSON.stringify({ segmentKey, segmentName }),
      })) || [],
    )
  }

  return (
    <Form layout="vertical" form={form}>
      <Form.Item {...EksFormItemPropsMap.serviceName}>
        <ServiceNameCascader placeholder={EksFormItemPropsMap.serviceName.placeholder} />
      </Form.Item>
      <Row gutter={[24, 0]}>
        <Col span={8}>
          <Form.Item {...EksFormItemPropsMap.displayName}>
            <Input placeholder={EksFormItemPropsMap.displayName.placeholder} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item {...EksFormItemPropsMap.azv2}>
            <Select
              showSearch
              placeholder={EksFormItemPropsMap.azv2.placeholder}
              onChange={handleAZv2Change}
            >
              {azv2Options?.map(({ azName, azKey, azKeyName }) => (
                <Select.Option key={azKey} value={azKeyName}>
                  {azName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item {...EksFormItemPropsMap.segment}>
            <Select
              showSearch
              placeholder={EksFormItemPropsMap.segment.placeholder}
              disabled={segmentOptions?.length === 0}
            >
              {segmentOptions?.map(({ segmentKey, segmentName, segmentKeyName }) => (
                <Select.Option key={segmentKey} value={segmentKeyName}>
                  {segmentName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[24, 0]}>
        <Col span={8}>
          <Form.Item {...EksFormItemPropsMap.env}>
            <Select placeholder={EksFormItemPropsMap.env.placeholder}>
              {envs?.items.map((val) => (
                <Select.Option key={val} value={val}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item {...EksFormItemPropsMap.uuid}>
            <Input placeholder={EksFormItemPropsMap.uuid.placeholder} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item {...EksFormItemPropsMap.deployedGalio}>
            <Radio.Group
              options={[
                {
                  label: 'Yes',
                  value: true,
                },
                {
                  label: 'No',
                  value: false,
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[24, 0]}>
        <Col span={8}>
          <Form.Item {...EksFormItemPropsMap.monitoringName}>
            <Input placeholder={EksFormItemPropsMap.monitoringName.placeholder} />
          </Form.Item>
        </Col>
      </Row>
      <ETCDWrapper>
        <Title>ETCD</Title>
        <Form.Item {...EksFormItemPropsMap.etcdIPs}>
          <Select
            mode="tags"
            tokenSeparators={[',']}
            open={false}
            allowClear
            placeholder={EksFormItemPropsMap.etcdIPs.placeholder}
          />
        </Form.Item>
        <div style={{ marginBottom: '16px' }}>Certificate :</div>
        <Form.Item {...EksFormItemPropsMap.sslCA}>
          <Input.TextArea placeholder={EksFormItemPropsMap.sslCA.placeholder} />
        </Form.Item>
        <Form.Item {...EksFormItemPropsMap.sslCertificate}>
          <Input.TextArea placeholder={EksFormItemPropsMap.sslCertificate.placeholder} />
        </Form.Item>
        <Form.Item {...EksFormItemPropsMap.sslKey}>
          <Input.TextArea placeholder={EksFormItemPropsMap.sslKey.placeholder} />
        </Form.Item>
      </ETCDWrapper>
      <Row gutter={[24, 0]}>
        <Col span={8}>
          <Form.Item {...EksFormItemPropsMap.labels}>
            <Select
              mode="tags"
              tokenSeparators={[',']}
              open={false}
              allowClear
              placeholder={EksFormItemPropsMap.labels.placeholder}
            />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item {...EksFormItemPropsMap.description}>
            <Input.TextArea placeholder={EksFormItemPropsMap.description.placeholder} autoSize />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item {...EksFormItemPropsMap.kubeConfig}>
        <StyledTextArea placeholder={EksFormItemPropsMap.kubeConfig.placeholder} autoSize />
      </Form.Item>
    </Form>
  )
}
export default AddToEksClusterForm
