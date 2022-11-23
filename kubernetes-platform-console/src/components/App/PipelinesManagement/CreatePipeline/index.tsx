import * as React from 'react'
import { useRecoilValue } from 'recoil'
import { selectedTenant } from 'states/applicationState/tenant'

import DetailLayout from 'components/App/ApplicationsManagement/Common/DetailLayout'
import { Root } from './style'
import Breadcrumbs from '../Common/Breadcrumbs'
import PipelineEditor from 'components/App/PipelinesManagement/PipelineEditor'

const CreatePipeline: React.FC = () => {
  const listPipelines = useRecoilValue(selectedTenant)
  const { id: tenantId, name: tenantName } = listPipelines

  return (
    <DetailLayout
      title='Create pipeline'
      breadcrumbs={<Breadcrumbs />}
      tags={[]}
      body={
        <Root>
          <PipelineEditor tenantId={tenantId} tenantName={tenantName} isEdit={false} />
        </Root>
      }
    />
  )
}

export default CreatePipeline
