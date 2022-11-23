import React from 'react'
import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'

import { Form } from 'infrad'
import {
  DeployConfigContext,
  DEPLOYMENT_STRATEGY_TYPE,
  FormType,
  getDispatchers,
  InPlaceType,
  StrategyEngine,
  StrategyType,
} from 'src/components/DeployConfig/useDeployConfigContext'
import StrategyA from 'src/components/DeployConfig/ListView/Strategy/StrategyA'
import StrategyB from 'src/components/DeployConfig/ListView/Strategy/StrategyB'
import { find } from 'lodash'
import { DashedDivider } from 'src/components/DeployConfig/ListView/Strategy/style'

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

  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { countryAzsOptions, newDeployConfig, componentType, env, strategyEngine } = state
  const { strategy_override, strategy } = newDeployConfig

  const generateDefaultStrategy = React.useCallback(() => {
    if (strategyEngine === StrategyEngine.BROMO_AND_KUBERNETES) {
      return {
        k8sStrategy:
          strategy_override?.find((item) => item.cid === 'default')?.data?.name ??
          StrategyType.ROLLING_UPDATE,
        maxUnavailable:
          strategy_override?.find((item) => item.cid === 'default')?.data?.parameters
            ?.max_unavailable ?? '0',
        maxSurge:
          strategy_override?.find((item) => item.cid === 'default')?.data?.parameters?.max_surge ??
          '25%',
        deploymentStrategy: strategy_override?.find((item) => item.cid === 'default')
          ? strategy?.name
          : DEPLOYMENT_STRATEGY_TYPE.BLUE_GREEN_STRATEGY,
      }
    }
    if (strategyEngine === StrategyEngine.KUBERNETES) {
      return {
        k8sStrategy: strategy?.name,
        maxUnavailable: strategy?.parameters?.max_unavailable,
        maxSurge: strategy?.parameters?.max_surge,
        deploymentStrategy: DEPLOYMENT_STRATEGY_TYPE.BLUE_GREEN_STRATEGY,
      }
    }
    if (strategyEngine === StrategyEngine.BROMO) {
      return {
        k8sStrategy: StrategyType.ROLLING_UPDATE,
        maxUnavailable: '0',
        maxSurge: '25%',
        deploymentStrategy: strategy?.name,
      }
    }
  }, [
    strategyEngine,
    strategy?.name,
    strategy?.parameters?.max_surge,
    strategy?.parameters?.max_unavailable,
    strategy_override,
  ])
  React.useEffect(() => {
    const defaultStrategy = generateDefaultStrategy()

    const { k8sStrategy, maxUnavailable, maxSurge, deploymentStrategy } = defaultStrategy

    const inPlace = strategy?.parameters?.in_place
    const strictInPlace = strategy?.parameters?.strict_in_place
    const stepDown = strategy?.parameters?.step_down
    const threshold = strategy?.parameters?.threshold
    const enableCanaryReplacement = strategy?.parameters?.enable_canary_replacement
    const formatStrategyOverride = strategy_override?.reduce((acc: IOverrideFormValue[], curr) => {
      const { cid, data, idc } = curr
      if (cid === 'default') {
        return acc
      }
      const item = find(acc, { cid, data })
      if (item) {
        item.idcs.push(idc)
      } else {
        acc.push({
          ...curr,
          idcs: [idc],
        })
      }
      return acc
    }, [])

    const handleInPlaceValue = () => {
      if (strictInPlace) return InPlaceType.STRICT_IN_PLACE
      if (inPlace) return InPlaceType.IN_PLACE
      return InPlaceType.NOT_IN_PLACE
    }

    form.setFieldsValue({
      override: formatStrategyOverride,
      k8sStrategy,
      max_unavailable: maxUnavailable,
      max_surge: maxSurge,
      deploymentStrategy,
      step_down: stepDown || (threshold && `${threshold}%`),
      enable_canary_replacement: enableCanaryReplacement,
      in_place: handleInPlaceValue(),
    })

    dispatchers.updateDeployConfigForms({ [FormType.STRAEGY]: form })
    dispatchers.updateErrors(FormType.STRAEGY)
  }, [
    dispatchers,
    form,
    env,
    generateDefaultStrategy,
    strategy?.parameters?.enable_canary_replacement,
    strategy?.parameters?.in_place,
    strategy?.parameters?.step_down,
    strategy?.parameters?.strict_in_place,
    strategy?.parameters?.threshold,
    strategy_override,
  ])

  React.useEffect(() => {
    const strategyOverrides = form
      .getFieldValue('override')
      ?.filter(
        (override: IOverrideFormValue) =>
          override && Object.keys(countryAzsOptions).includes(override.cid),
      )
      .map((override: IOverrideFormValue) => {
        const idcs = override?.idcs?.filter((idc) => countryAzsOptions[override.cid].includes(idc))
        return { cid: override.cid, idcs, data: override.data }
      })
    form.setFieldsValue({
      override: strategyOverrides,
    })
  }, [countryAzsOptions, form])

  return (
    <Form
      form={form}
      requiredMark={false}
      onFieldsChange={() => dispatchers.updateErrors(FormType.STRAEGY)}
    >
      <SectionWrapper
        title="Strategy"
        notice={
          <>
            Click <a href={NOTICE_ADDRESS}>here</a> to view Deployment Strategy Guideline
          </>
        }
        anchorKey={FormType.STRAEGY}
      >
        {componentType.nonBromo?.length ? (
          <StrategyA countryAzsOptions={countryAzsOptions} />
        ) : null}
        {componentType.nonBromo?.length !== 0 && componentType.bromo?.length !== 0 && (
          <DashedDivider />
        )}
        {componentType.bromo?.length ? <StrategyB /> : null}
      </SectionWrapper>
    </Form>
  )
}

export default Strategy
