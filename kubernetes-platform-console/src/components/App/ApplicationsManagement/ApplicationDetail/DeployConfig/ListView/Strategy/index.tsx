import React from 'react'
import SectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper'

import { Form } from 'infrad'
import {
  DeployConfigContext,
  FORM_TYPE,
  getDispatchers,
  IN_PLACE_TYPE
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import StrategyA from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Strategy/StrategyA'
import StrategyB from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Strategy/StrategyB'
import { StringParam, useQueryParam } from 'use-query-params'
import { find } from 'lodash'

export interface IOverrideFormValue {
  cid: string
  data: {
    name?: string
    pararmeters?: Record<string, string>
  }
  idcs: string[]
}

const NOTICE_ADDRESS =
  'https://confluence.shopee.io/pages/viewpage.action?pageId=917289060#heading-Currentcomponentsmanagement'
const Strategy: React.FC = () => {
  const [form] = Form.useForm()
  const [selectedEnv] = useQueryParam('selectedEnv', StringParam)
  const env = selectedEnv?.toLocaleLowerCase()
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { countryAzsOptions, newDeployConfig, componentType } = state
  const { strategy_override, strategy, k8s_strategy } = newDeployConfig

  React.useEffect(() => {
    const k8sStrategy = k8s_strategy?.name
    const maxUnavailable = k8s_strategy?.parameters?.max_unavailable
    const maxSurge = k8s_strategy?.parameters?.max_surge

    const deploymentStrategy = strategy?.name
    const inPlace = strategy?.parameters?.in_place
    const strictInPlace = strategy?.parameters?.strict_in_place
    const stepDown = strategy?.parameters?.step_down
    const threshold = strategy?.parameters?.threshold
    const enableCanaryReplacement = strategy?.parameters?.enable_canary_replacement
    const formatStrategyOverride = strategy_override?.reduce((acc: IOverrideFormValue[], curr) => {
      const { cid, data, idc } = curr
      const item = find(acc, { cid, data })
      if (item) {
        item.idcs.push(idc)
      } else {
        acc.push({
          ...curr,
          idcs: [idc]
        })
      }
      return acc
    }, [])

    const handleInPlaceValue = () => {
      if (inPlace) return IN_PLACE_TYPE.IN_PLACE
      if (strictInPlace) return IN_PLACE_TYPE.STRICT_IN_PLACE
      return IN_PLACE_TYPE.NOT_IN_PLACE
    }

    form.setFieldsValue({
      override: formatStrategyOverride,
      k8sStrategy,
      max_unavailable: maxUnavailable,
      max_surge: maxSurge,
      deploymentStrategy,
      step_down: stepDown || (threshold && `${threshold}%`),
      enable_canary_replacement: enableCanaryReplacement,
      in_place: handleInPlaceValue()
    })

    dispatchers.updateDeployConfigForms({ [FORM_TYPE.STRAEGY]: form })
    dispatchers.updateErrors(FORM_TYPE.STRAEGY)
  }, [
    dispatchers,
    env,
    form,
    k8s_strategy?.name,
    k8s_strategy?.parameters?.max_surge,
    k8s_strategy?.parameters?.max_unavailable,
    k8s_strategy?.parameters?.step_down,
    strategy?.name,
    strategy?.parameters,
    strategy_override
  ])

  React.useEffect(() => {
    const strategyOverrides = form
      .getFieldValue('override')
      ?.filter((override: IOverrideFormValue) => {
        return override && Object.keys(countryAzsOptions).includes(override.cid)
      })
      .map((override: IOverrideFormValue) => {
        const idcs = override?.idcs?.filter(idc => {
          return countryAzsOptions[override.cid].includes(idc)
        })
        return { cid: override.cid, idcs, data: override.data }
      })
    form.setFieldsValue({
      override: strategyOverrides
    })
  }, [countryAzsOptions, form])

  return (
    <Form form={form} requiredMark={false} onFieldsChange={() => dispatchers.updateErrors(FORM_TYPE.STRAEGY)}>
      <SectionWrapper
        title='Strategy'
        notice={
          <>
            Click <a href={NOTICE_ADDRESS}>here</a> to view Deployment Strategy Guideline
          </>
        }
        anchorKey={FORM_TYPE.STRAEGY}
      >
        {componentType.nonBromo?.length ? <StrategyA countryAzsOptions={countryAzsOptions} /> : null}
        {componentType.bromo?.length ? <StrategyB /> : null}
      </SectionWrapper>
    </Form>
  )
}

export default Strategy
