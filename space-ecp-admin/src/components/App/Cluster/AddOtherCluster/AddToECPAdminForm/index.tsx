import { useRequest } from 'ahooks'
import { Col, Form, FormInstance, Input, Row, Select, Switch, FormProps } from 'infrad'
import {
  globalController_listAllAZv1s,
  globalController_listAllEcpVersions,
} from 'src/swagger-api/apis/Global'
import { IAddClusterBody } from 'src/swagger-api/models'
import { disableOAMDeployEcpVersions } from 'src/constants/cluster'

interface IAddToECPAdminFormProps {
  form: FormInstance<IAddClusterBody>
}

const AddToECPAdminForm: React.FC<IAddToECPAdminFormProps> = ({ form }) => {
  const { data: allAZv1s } = useRequest(globalController_listAllAZv1s)
  const { data: allEcpVersions } = useRequest(globalController_listAllEcpVersions)
  const handleValuesChange: FormProps['onValuesChange'] = (values: IAddClusterBody) => {
    if (
      values?.ecpVersion &&
      !disableOAMDeployEcpVersions.includes(values?.ecpVersion.toLocaleLowerCase())
    ) {
      form.setFieldsValue({ ...values, useOam: true })
    }
  }
  return (
    <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
      <Row gutter={[24, 0]}>
        <Col span={8}>
          <Form.Item name="azV1" label="Belonging AZv1" rules={[{ required: true }]}>
            <Select
              placeholder="Please select Belonging AZv1"
              getPopupContainer={() => document.body}
            >
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
      <Row gutter={[24, 0]}>
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
  )
}

export default AddToECPAdminForm
