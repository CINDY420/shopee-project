import React from 'react'
import { Form, FormInstance } from 'infrad'
import DeploymentLabel from 'src/components/Common/DeploymentLabel'
import { IModels } from 'src/rapper/request'
import { CheckboxChangeEvent } from 'infrad/es/checkbox'
import {
  StyledCheckbox,
  StyledCheckboxGroup,
} from 'src/components/Container/Action/Restart/EditForm/RestartItem/style'
import { DEPLOY_ENGINE } from 'src/constants/deployment'
import { isEqual } from 'lodash'

type Deployment =
  IModels['GET/api/ecp-cmdb/services/{serviceName}/sdus']['Res']['items'][0]['deployments'][0]

interface IRestartItemProps {
  deployment: Deployment
  form: FormInstance
  onFormValuesChange: () => void
}

const RestartItem: React.FC<IRestartItemProps> = (props) => {
  const { deployment, form, onFormValuesChange: handelFormValuesChange } = props
  const { deployId, deployEngine } = deployment

  const isBromoDeployment = deployEngine === DEPLOY_ENGINE.BROMO

  const phases = deployment?.status?.containers?.map((container) => container.phase)
  const deduplicatedPhases = Array.from(new Set(phases))

  const handleCheckAllPhase = (e: CheckboxChangeEvent) => {
    const list = e.target.checked ? deduplicatedPhases : undefined
    form.setFieldsValue({ [deployId]: list })
    handelFormValuesChange()
  }

  return (
    <Form.Item noStyle>
      <span>
        <Form.Item shouldUpdate={(prev, curr) => !isEqual(prev[deployId], curr[deployId])} noStyle>
          {({ getFieldValue }) => {
            const checkedList = getFieldValue(deployId)
            return (
              <StyledCheckbox
                indeterminate={
                  checkedList?.length && checkedList?.length < deduplicatedPhases?.length
                }
                onChange={handleCheckAllPhase}
                checked={checkedList?.length === deduplicatedPhases?.length}
              >
                <DeploymentLabel
                  deployment={deployment}
                  style={{ marginLeft: '8px', width: '367px' }}
                />
              </StyledCheckbox>
            )
          }}
        </Form.Item>
        <Form.Item name={deployId} noStyle hidden={isBromoDeployment}>
          <StyledCheckboxGroup options={deduplicatedPhases} />
        </Form.Item>
      </span>
    </Form.Item>
  )
}

export default RestartItem
