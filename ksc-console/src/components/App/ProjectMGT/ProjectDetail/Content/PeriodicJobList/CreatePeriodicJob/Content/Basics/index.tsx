import {
  StyledRoot,
  StyledTimeInputNumber,
} from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Basics/style'
import { INSTANCE_TIMEOUT_POLICY, TIME_UNIT_LISTS, TIME_UNITS } from 'constants/periodicJob'
import { Form, Input, Radio, Switch, FormInstance, InputNumber, Select } from 'infrad'
import * as cronParser from 'cron-parser'

const { TextArea } = Input
const { Option } = Select
interface IBasicsStepContentProps {
  form: FormInstance
  isEdit: boolean
}
const BasicsStepContent: React.FC<IBasicsStepContentProps> = ({ isEdit }) => {
  const selectAfter = (key: string) => (
    <Form.Item noStyle name={key} initialValue={TIME_UNITS.MINUTES}>
      <Select style={{ width: 100 }}>
        {TIME_UNIT_LISTS.map((timeUnit) => (
          <Option key={timeUnit} value={timeUnit}>
            {timeUnit}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )

  return (
    <StyledRoot>
      <Form.Item
        label="Job Name"
        name="periodicJobName"
        rules={[
          {
            required: true,
            message: 'Please input job name',
          },
          {
            pattern: /^([a-z]([-a-z0-9]*[a-z0-9])){1,48}$/,
            message: 'Please input correct job name',
          },
        ]}
      >
        <Input
          placeholder="Must only consist of lowercase alphanumeric(a-z0-9)"
          maxLength={48}
          disabled={isEdit}
        />
      </Form.Item>
      <Form.Item
        label="Status"
        name="enable"
        initialValue={false}
        valuePropName="checked"
        extra="The switch to enable periodic job"
        rules={[
          {
            required: true,
            message: 'Please select status',
          },
        ]}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="Env"
        name={['jobTemplate', 'env']}
        rules={[
          {
            required: true,
            message: 'Please select env',
          },
        ]}
      >
        <Radio.Group disabled={isEdit}>
          <Radio value="test">Test</Radio>
          <Radio value="live">Live</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Priority"
        name={['jobTemplate', 'priority']}
        extra="The priority is the lowest by default"
        rules={[
          {
            required: true,
            message: 'Please input priority',
          },
        ]}
      >
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        label="Cron"
        name="period"
        rules={[
          {
            required: true,
            message: 'Please input cron',
          },
          () => ({
            validator(_, value) {
              try {
                cronParser.parseExpression(value)
                return Promise.resolve()
              } catch (error) {
                return Promise.reject(new Error(error.message))
              }
            },
          }),
        ]}
      >
        <Input placeholder="Please input cron expression, example: 0 0 0 * ?" />
      </Form.Item>
      <Form.Item label="Running Timeout" name="runningOvertime">
        <StyledTimeInputNumber
          min={0}
          placeholder="Timeout for Running Instance. Defaults to no timeout"
          addonAfter={selectAfter('runningOvertimeUnit')}
        />
      </Form.Item>
      <Form.Item label="Pending Timeout" name="pendingOvertime">
        <StyledTimeInputNumber
          min={0}
          placeholder="Timeout for Running Instance. Defaults to no timeout"
          addonAfter={selectAfter('pendingOvertimeUnit')}
        />
      </Form.Item>
      <Form.Item
        label="Notification"
        name="supportNotify"
        initialValue
        valuePropName="checked"
        extra="Receive email notifications when an instance is killed or failed"
        rules={[
          {
            required: true,
            message: 'Please input job name',
          },
        ]}
      >
        <Switch />
      </Form.Item>
      <Form.Item label="Instance Timeout" name="instanceTimeoutPolicy" initialValue="wait">
        <Radio.Group>
          {INSTANCE_TIMEOUT_POLICY.map((policy) => (
            <Radio key={policy.value} value={policy.value}>
              {policy.name}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Parameters"
        tooltip="Custom parameters, the format is: key1:value1;key2:value2"
        name="parameters"
      >
        <TextArea showCount rows={3} placeholder="Example: key1:value1;key2:value2" />
      </Form.Item>
    </StyledRoot>
  )
}

export default BasicsStepContent
