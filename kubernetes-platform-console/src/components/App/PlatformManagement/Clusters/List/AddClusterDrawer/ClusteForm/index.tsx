import * as React from 'react'
import { Input } from 'infrad'

import { WORD } from 'helpers/validate'
import Editor from 'components/Common/Editor'
import { StyledForm } from 'common-styles/form'
import { throttle } from 'helpers/functionUtils'

interface IClusterFormProps {
  name: string
  kubeconfig: string
  form: any
  isEditing?: boolean
  setName: (name: string) => void
  setKubeconfig: (kubeconfig: string) => void
}

const ClusterForm: React.FC<IClusterFormProps> = (props: IClusterFormProps) => {
  const { name, kubeconfig, form, isEditing, setName, setKubeconfig } = props

  return (
    <StyledForm form={form} layout='vertical'>
      {isEditing ? null : (
        <StyledForm.Item
          name={['name']}
          label='Name'
          rules={[
            {
              required: true,
              message: 'Please input cluster name'
            },
            {
              pattern: WORD,
              message: 'Name must be some format'
            },
            {
              min: 2,
              message: 'The name must be at least two characters'
            }
          ]}
          initialValue={name}
        >
          <Input
            placeholder='Must consist of only alphanumeric(a-z0-9) and "-"'
            autoFocus
            onChange={event => {
              const callback = throttle(500, setName)
              callback(event.target.value)
            }}
          />
        </StyledForm.Item>
      )}
      <StyledForm.Item
        name={['kubeconfig']}
        label='Kubeconfig'
        initialValue={kubeconfig}
        rules={[
          {
            required: true,
            message: 'Please input kube config'
          }
        ]}
        extra='Must use YAML format'
      >
        <Editor
          mode='yaml'
          height='746px'
          onChange={(newValue: string) => {
            const callback = throttle(500, setKubeconfig)
            callback(newValue)
          }}
        />
      </StyledForm.Item>
    </StyledForm>
  )
}

export default ClusterForm
