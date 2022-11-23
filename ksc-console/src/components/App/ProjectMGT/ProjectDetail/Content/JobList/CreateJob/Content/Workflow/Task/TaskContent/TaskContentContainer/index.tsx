import {
  StyledCard,
  StyledDeleteButton,
  StyledFormItem,
  StyledRow,
} from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content/Workflow/Task/TaskContent/TaskContentContainer/style'
import { RESOURCE_CONFIG_LIST, RESOURCE_FORM_RULES } from 'constants/resource'
import { generateContainerEnv } from 'helpers/job'
import { Input, Switch } from 'infrad'
import * as ramda from 'ramda'

const ResourceInitialValue = {
  cpu: 1,
  memory: 1,
  gpu: 0,
}
const { TextArea } = Input
interface ITaskContentContainerProps {
  fieldName: number
  onDelete?: (fieldName) => void
}
const TaskContentContainer: React.FC<ITaskContentContainerProps> = ({ fieldName, onDelete }) => {
  const handleDelete = () => {
    onDelete?.(fieldName)
  }
  return (
    <StyledCard
      title={`Container ${fieldName + 1}`}
      extra={onDelete && <StyledDeleteButton onClick={handleDelete}>Delete</StyledDeleteButton>}
    >
      <StyledFormItem
        label="Init Container"
        name={[fieldName, 'isInitContainer']}
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </StyledFormItem>
      <StyledFormItem label="Request Resource" style={{ marginBottom: '0' }}>
        <StyledRow>
          {RESOURCE_CONFIG_LIST.map((resource) => (
            <StyledFormItem
              key={resource.key}
              name={[fieldName, 'resource', 'requests', resource.key]}
              initialValue={ResourceInitialValue[resource.key]}
              rules={RESOURCE_FORM_RULES[resource.key]}
            >
              <Input suffix={resource.suffix} addonBefore={resource.before} />
            </StyledFormItem>
          ))}
        </StyledRow>
      </StyledFormItem>
      <StyledRow>
        <StyledFormItem
          label="Launch-cmd"
          name={[fieldName, 'command']}
          rules={[
            {
              required: true,
              message: 'Please input launch-cmd',
            },
          ]}
        >
          <TextArea autoSize={{ minRows: 1 }} placeholder="Example: command1,command2,command3" />
        </StyledFormItem>
        <StyledFormItem
          label="Environments"
          name={[fieldName, 'env']}
          rules={[
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.resolve()
                }
                const envs = generateContainerEnv(value)
                if (ramda.isEmpty(envs)) {
                  return Promise.reject(
                    new Error('Please check if the input is the same as the example'),
                  )
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <TextArea autoSize={{ minRows: 1 }} placeholder="Example: key1:value1;key2:value2" />
        </StyledFormItem>
      </StyledRow>
      <StyledFormItem
        label="Image"
        name={[fieldName, 'image']}
        rules={[
          {
            required: true,
            message: 'Please input image',
          },
        ]}
      >
        <TextArea autoSize={{ minRows: 1 }} placeholder="Input" />
      </StyledFormItem>
      <StyledFormItem label="Volume Mounts" style={{ marginBottom: '0' }}>
        <StyledRow>
          <StyledFormItem name={[fieldName, 'volumeMounts', 0, 'subPath']}>
            <Input addonBefore="SubPath" />
          </StyledFormItem>
          <StyledFormItem name={[fieldName, 'volumeMounts', 0, 'mountPath']}>
            <Input addonBefore="MountPath" />
          </StyledFormItem>
        </StyledRow>
      </StyledFormItem>
    </StyledCard>
  )
}

export default TaskContentContainer
