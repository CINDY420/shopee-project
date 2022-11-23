import * as React from 'react'
import { GitlabOutlined } from 'infra-design-icons'

import TemplateEditor from './TemplateEditor'
import DetailLayout from 'components/App/GatewayManagement/Common/DetailLayout'

import { StyledCard } from './style'

const GitTemplateRender: React.FC = () => {
  return (
    <DetailLayout
      title='Git Template Render'
      body={
        <StyledCard>
          <TemplateEditor />
        </StyledCard>
      }
      tags={[]}
      buttons={[
        {
          icon: <GitlabOutlined />,
          text: 'To GitLab',
          click: () =>
            window.open('https://git.garena.com/shopee/sz-devops/kubernetes/kube-haproxy/-/tree/master/overlay')
        }
      ]}
    />
  )
}

export default GitTemplateRender
