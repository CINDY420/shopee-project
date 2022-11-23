import * as React from 'react'
import { useRecoilValue } from 'recoil'
import { selectedTenant } from 'states/applicationState/tenant'

import DetailLayout from 'components/App/ApplicationsManagement/Common/DetailLayout'
import { Root } from './style'
import Breadcrumbs from '../Common/Breadcrumbs'
import PipelineEditor from 'components/App/PipelinesManagement/PipelineEditor'
import { selectedPipeline } from 'states/pipelineState'

const EditPipeline: React.FC = () => {
  const tenant = useRecoilValue(selectedTenant)
  const { id: tenantId, name: tenantName } = tenant
  const pipeline = useRecoilValue(selectedPipeline)
  const { name: pipelineName } = pipeline
  return (
    <DetailLayout
      title={`Edit Pipeline: ${pipelineName}`}
      breadcrumbs={<Breadcrumbs />}
      tags={[]}
      body={
        <Root>
          <PipelineEditor tenantId={tenantId} tenantName={tenantName} pipeline={pipeline} isEdit={true} />
        </Root>
      }
    />
  )
}

export default EditPipeline
