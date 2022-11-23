import React from 'react'
import { Form, Card, Select, FormInstance } from 'infrad'
import InfoTooltip from 'src/components/Common/InfoTooltip'
import ResourceInfo from 'src/components/App/Cluster/CreateCluster/Common/ResourceInfo'
import {
  IServerForm,
  SERVER_LIST_ITEM_NAME,
} from 'src/components/App/Cluster/CreateCluster/constant'
import { antdFormIPV4ListValidator } from 'src/components/App/Cluster/CreateCluster/helper'

interface IServerFormProps {
  form: FormInstance<IServerForm>
  onValuesChange?: (changedValues: IServerForm, values: IServerForm) => Promise<void>
}

const ServerForm: React.FC<IServerFormProps> = ({ form, onValuesChange }) => (
  <Form
    layout="vertical"
    form={form}
    onValuesChange={(changedValues, values) => void onValuesChange(changedValues, values)}
  >
    <ResourceInfo />
    <Card
      title={
        <span>
          Server List
          <InfoTooltip info="Please ensure that the AZ and Env of all selected servers are the same as you inputted." />
        </span>
      }
      style={{ marginTop: 16 }}
    >
      <Form.Item
        label="Master IP List"
        name={SERVER_LIST_ITEM_NAME.MASTER_IPS}
        rules={[
          { required: true },
          {
            validator: (_, ips: string[]) => antdFormIPV4ListValidator(ips),
          },
        ]}
        normalize={(ips: string[]) => ips.map((ip) => ip.trim())}
      >
        <Select
          mode="tags"
          tokenSeparators={[',']}
          open={false}
          allowClear
          placeholder='Please enter the target IPs, separated by commas(",")'
        />
      </Form.Item>
      <Form.Item
        label="Worker IP List"
        name={SERVER_LIST_ITEM_NAME.WORK_IPS}
        normalize={(ips: string[]) => ips.map((ip) => ip.trim())}
        rules={[
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
    </Card>
  </Form>
)

export default ServerForm
