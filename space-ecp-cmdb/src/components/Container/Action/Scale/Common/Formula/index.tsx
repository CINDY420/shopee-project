import * as React from 'react'
import {
  DiffInputNumber,
  FormulaContainer,
  FormulaInner,
  Phase,
  Sign,
} from 'src/components/Container/Action/Scale/Common/Formula/style'
import { IModels } from 'src/rapper/request'
import { Form } from 'infrad'
import { isEqual, get, hasIn } from 'lodash'
import { DEPLOYMENT_CANARY_PHASE } from 'src/constants/deployment'
import { SDUInstancesData } from 'src/components/Container/Action/Scale'
import { Stage } from 'src/components/Common/StageModal'

type Containers =
  IModels['GET/api/ecp-cmdb/services/{serviceName}/sdus']['Res']['items'][0]['deployments'][0]['status']['containers']
interface IFormulaProps {
  formItemPath: string[]
  containers: Containers
  stage: Stage
  isBromo: boolean
  diffData?: Object
  enabledAutoScale?: boolean
  children?: React.ReactNode
  isDisabledScaleCluster?: boolean
  showChange?: boolean
}

const Formula: React.FC<IFormulaProps> = ({
  formItemPath,
  containers,
  isBromo,
  stage,
  diffData,
  enabledAutoScale = false,
  isDisabledScaleCluster,
  showChange = true,
}) => {
  const isConfirmStage = stage === Stage.CONFIRM

  const shouldTotalUpdate = (prevValue: SDUInstancesData, curValue: SDUInstancesData) =>
    !isEqual(get(prevValue, [...formItemPath]), get(curValue, [...formItemPath]))

  const isCanary = (phase: string) => {
    if (isBromo && phase.startsWith(`${DEPLOYMENT_CANARY_PHASE}_`)) {
      return true
    }
    if (!isBromo && phase === DEPLOYMENT_CANARY_PHASE) {
      return true
    }
    return false
  }

  const deduplicatedPhases = React.useMemo(() => {
    const phases = containers?.map((item) => item.phase)
    return Array.from(new Set(phases))
  }, [containers])

  return (
    <FormulaContainer>
      {deduplicatedPhases.map((phase, index: number) => {
        const formItemName = isCanary(phase) ? 'canaryReplicas' : 'releaseReplicas'
        const namePath = [...formItemPath, formItemName]
        return (
          <FormulaInner key={phase}>
            {index !== 0 && <Sign>+</Sign>}
            <div>
              <Phase>{phase}</Phase>
              <Form.Item name={namePath} noStyle>
                <DiffInputNumber
                  disabled={
                    isDisabledScaleCluster ||
                    isConfirmStage ||
                    (isBromo && (enabledAutoScale || isCanary(phase)))
                  }
                  controls={false}
                  min={0}
                  precision={0}
                  $changed={isConfirmStage && showChange && hasIn(diffData, namePath)}
                />
              </Form.Item>
            </div>
          </FormulaInner>
        )
      })}
      <Sign>=</Sign>
      <div>
        <Phase>Total</Phase>
        <Form.Item noStyle shouldUpdate={shouldTotalUpdate}>
          {({ getFieldValue }) => {
            const instances: Record<string, number> = getFieldValue([...formItemPath]) || {}
            const total = Object.values(instances).reduce((prev = 0, cur = 0) => prev + cur, 0)

            return <DiffInputNumber disabled value={total} />
          }}
        </Form.Item>
      </div>
    </FormulaContainer>
  )
}

export default Formula
