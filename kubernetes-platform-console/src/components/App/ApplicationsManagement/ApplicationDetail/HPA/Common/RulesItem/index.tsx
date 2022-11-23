import React, { useState, useEffect } from 'react'
import { Form, FormItemProps, FormInstance } from 'infrad'
import AutoscalingRulesItems from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/RulesItem/AutoscalingRulesItems'
import CronRulesItems from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/RulesItem/CronRulesItems'
import { IHpaRulesWithSelected } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer/CreateEditRuleForm/interface'

const { Item } = Form

interface IRulesItemProps extends FormItemProps {
  form: FormInstance<IHpaRulesWithSelected>
  fatherNamePath: string[]
  triggerRules: IHpaRulesWithSelected
}

const RulesItem: React.FC<IRulesItemProps> = ({ form, triggerRules, fatherNamePath, ...others }) => {
  const [rules, setRules] = useState<IHpaRulesWithSelected>()
  useEffect(() => {
    setRules(triggerRules)
  }, [triggerRules])
  return (
    <Item {...others}>
      <AutoscalingRulesItems form={form} fatherNamePath={fatherNamePath} autoscalingRules={rules?.autoscalingRules} />
      <CronRulesItems form={form} fatherNamePath={fatherNamePath} cronRules={rules?.cronRules} />
    </Item>
  )
}

export default RulesItem
