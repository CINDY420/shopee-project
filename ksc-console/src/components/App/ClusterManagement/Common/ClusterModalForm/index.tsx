import { StyledRoot } from 'components/App/ClusterManagement/Common/ClusterModalForm/style'
import { Form, Input, FormInstance } from 'infrad'

interface IClusterModalFormProps {
  form: FormInstance
  isEdit: boolean
}
const ClusterModalForm: React.FC<IClusterModalFormProps> = ({ form, isEdit }) => {
  const handleKubeconfigChange = (e) => {
    const value = e.target.value
    if (value.indexOf('\\n') > -1) {
      const newValue = value.replace(/\\n/g, '\n')
      form.setFieldsValue({
        kubeconfig: newValue,
      })
    }
  }
  return (
    <StyledRoot>
      <Form labelCol={{ span: 4 }} form={form}>
        <Form.Item
          label="Cluster Name"
          name="displayName"
          rules={[{ required: true, message: 'Please input cluster name!' }]}
        >
          <Input placeholder="Please input cluster name" disabled={isEdit} />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Please input description" />
        </Form.Item>
        <Form.Item
          label="Kube Config"
          name="kubeconfig"
          rules={[{ required: true, message: 'Please input kubeconfig!' }]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Please input kubeconfig"
            onChange={handleKubeconfigChange}
          />
        </Form.Item>
      </Form>
    </StyledRoot>
  )
}

export default ClusterModalForm
