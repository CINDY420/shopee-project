import * as React from 'react'
import { Divider } from 'infrad'
import { IModels } from 'src/rapper/request'
import {
  FormulContainer,
  StyledFormItem,
  StyledVersionDiv,
} from 'src/components/Container/Action/Scale/Common/ScaleFormItem/style'
import Formula from 'src/components/Container/Action/Scale/Common/Formula'
import DeploymentLabel from 'src/components/Common/DeploymentLabel'
import { DEPLOY_ENGINE } from 'src/constants/deployment'
import { Stage } from 'src/components/Common/StageModal'
import ScaleNotice from 'src/components/Container/Action/Scale/Common/ScaleNotice'
import { DiffData } from 'src/components/Container/Action/Scale'

type Deployment = IModels['GET/api/ecp-cmdb/sdus/{sduName}/deploys']['Res']['items'][0]

interface IScaleFormItemProps {
  deployment: Deployment
  stage: Stage
  hpaAZs: string[]
  enabledAutoScale: boolean
  disabledScaleClusters: string[]
  diffData?: DiffData
}

const isBromoDeployment = (deployment: Deployment) =>
  deployment.deployEngine === DEPLOY_ENGINE.BROMO

const ScaleFormItem: React.FC<IScaleFormItemProps> = ({
  deployment,
  stage,
  hpaAZs,
  enabledAutoScale,
  disabledScaleClusters,
  diffData,
}) => {
  const {
    deployId,
    status: { containers },
    azV1,
    cluster,
  } = deployment

  const diffInstances = diffData?.[deployId]?.instances
  const hasDataChanged = diffInstances && Object.keys(diffInstances).length > 0

  return (
    <>
      <StyledFormItem>
        <DeploymentLabel
          deployment={deployment}
          style={{ width: '345px', margin: '12px 16px 0' }}
        />
        <FormulContainer>
          <div>
            <ScaleNotice
              isBromoDeployment={isBromoDeployment(deployment)}
              enabledHpa={hpaAZs.includes(azV1)}
              enabledAutoScale={enabledAutoScale}
              style={{ marginBottom: '16px', maxWidth: '528px' }}
            />
            {stage === Stage.CONFIRM && hasDataChanged && (
              <>
                <StyledVersionDiv>Before</StyledVersionDiv>
                <Formula
                  formItemPath={[deployId, 'beforeInstances']}
                  containers={containers}
                  stage={stage}
                  isBromo={isBromoDeployment(deployment)}
                  enabledAutoScale={enabledAutoScale}
                  isDisabledScaleCluster={disabledScaleClusters.includes(cluster)}
                  showChange={false}
                />
                <Divider style={{ margin: '12px 0' }} />
                <StyledVersionDiv>After</StyledVersionDiv>
              </>
            )}
            <Formula
              formItemPath={[deployId, 'instances']}
              containers={containers}
              stage={stage}
              isBromo={isBromoDeployment(deployment)}
              enabledAutoScale={enabledAutoScale}
              isDisabledScaleCluster={disabledScaleClusters.includes(cluster)}
              diffData={diffData}
            />
          </div>
        </FormulContainer>
      </StyledFormItem>
      <Divider style={{ margin: 0 }} />
    </>
  )
}

export default ScaleFormItem
