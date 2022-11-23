import React from 'react'
import { StyledForm } from './style'
import { Input } from 'infrad'
const { Item } = StyledForm
interface INonK8sTemplateProps {
  isEdit: boolean
  detailConfig: string
}

const defaultDetailConfig = `@Library("deploy-shared-library") _
import com.shopee.*
env.DEPLOY_DEFINITION = ""
env.GIT_REPO = ""

new stdPipeline().execute()`
const NonK8sTemplate: React.FC<INonK8sTemplateProps> = ({ isEdit, detailConfig }) => {
  return (
    <>
      <Item
        label='Detail Config'
        name={['config', 'detailConfig']}
        initialValue={isEdit ? detailConfig || defaultDetailConfig : defaultDetailConfig}
        colon={false}
      >
        <Input.TextArea rows={6} placeholder='Input a value' style={{ width: 480 }} />
      </Item>
    </>
  )
}

export default NonK8sTemplate
