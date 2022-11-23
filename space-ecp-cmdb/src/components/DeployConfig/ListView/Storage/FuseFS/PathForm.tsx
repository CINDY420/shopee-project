import { Form, FormInstance } from 'infrad'
import React from 'react'
import { AutoDisabledInput } from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import {
  StyledAutoDisabledInput,
  StyledFormItem,
} from 'src/components/DeployConfig/ListView/Storage/FuseFS/style'

interface IPathFormProps {
  form: FormInstance
  namePath: string[]
  isEditing: boolean
}
const PathForm: React.FC<IPathFormProps> = ({ form, namePath, isEditing }) => {
  const mountPath = Form.useWatch<string>(namePath.concat('mount_path'), form)
  const localMountPath = Form.useWatch<string>(namePath.concat('local_mount_path'), form)
  React.useEffect(() => {
    if (mountPath?.length + localMountPath?.length > 127) {
      form.setFieldsValue({ fusefs: { local_mount_path: '' } })
    }
  }, [form, localMountPath?.length, mountPath?.length])
  return (
    <>
      <StyledFormItem
        name={namePath.concat('mount_path')}
        label="MountPath"
        rules={[{ required: true, message: 'MountPath is required' }]}
      >
        <AutoDisabledInput style={{ width: 544 }} showCount maxLength={127} />
      </StyledFormItem>
      <StyledFormItem
        name={namePath.concat('local_mount_path')}
        label="LocalMountPath"
        dependencies={[namePath.concat('mount_path')]}
        rules={[
          () => ({
            validator(_, value: string) {
              if (value || mountPath) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('LocalMountPath is required'))
            },
          }),
        ]}
      >
        <StyledAutoDisabledInput
          style={{ width: 544 }}
          readOnly={mountPath?.length + localMountPath?.length >= 127}
          showCount={{
            formatter: ({ count, maxLength }) =>
              `${count + (mountPath ? mountPath.length : 0)} / ${maxLength}`,
          }}
          maxLength={127}
          addonBefore={mountPath}
          $isEditing={isEditing}
        />
      </StyledFormItem>
      <StyledFormItem
        name={namePath.concat('project_path')}
        label="ProjectPath"
        rules={[{ required: true, message: 'ProjectPath is required' }]}
      >
        <AutoDisabledInput style={{ width: 544 }} showCount maxLength={127} />
      </StyledFormItem>
    </>
  )
}

export default PathForm
