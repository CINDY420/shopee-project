import React from 'react'
import { StyledForm } from './style'
import { Input } from 'infrad'
import { IConfig } from 'api/types/application/pipeline'
const { Item } = StyledForm
interface INonK8sTemplateProps {
  isEdit: boolean
  config: IConfig
}

const CustomTemplate: React.FC<INonK8sTemplateProps> = ({ isEdit, config }) => {
  return (
    <Item
      label='Detail Config'
      name={['config', 'extraHosts']}
      initialValue={isEdit ? config.EXTRA_HOSTS || '' : ''}
      colon={false}
    >
      <Input.TextArea rows={6} placeholder='Input a value' style={{ width: 480 }} />
    </Item>
  )
}

export default CustomTemplate
