import React from 'react'
import { Checkbox, Form, FormInstance } from 'infrad'
import ScaleUpItems from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/ScaleDirectionItem/ScaleUpItems'
import ScaleDownItems from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/ScaleDirectionItem/ScaleDownItems'
import { VerticalLine } from 'common-styles/divider'
import { CSSProperties } from 'styled-components'
import { IHpaSpecScaleDirection } from 'swagger-api/v1/models'
import { HPA_RULE_DRAWER_TYPE } from 'constants/application'

const { Item } = Form

interface IScaleDirectionItemProps {
  form: FormInstance
  fatherNamePath: string[]
  label?: string
  required?: boolean
  style?: CSSProperties
  crudType?: string
  triggerRules: IHpaSpecScaleDirection
}

export const SCALE_UP_FORM_NAME = 'scaleUp'
export const SCALE_DOWN_FORM_NAME = 'scaleDown'

const ScaleDirectionItem: React.FC<IScaleDirectionItemProps> = ({
  form,
  fatherNamePath,
  crudType,
  triggerRules,
  ...others
}) => {
  const scaleUpSelected = form.getFieldValue([...fatherNamePath, SCALE_UP_FORM_NAME, 'selected'])
  const scaleDownSelected = form.getFieldValue([...fatherNamePath, SCALE_DOWN_FORM_NAME, 'selected'])

  React.useEffect(() => {
    if (crudType === HPA_RULE_DRAWER_TYPE.CREATE) {
      form.setFieldsValue({
        scaleDirection: {
          scaleUp: {
            stabilizationWindowSeconds: triggerRules?.scaleUp?.stabilizationWindowSeconds,
            selectPolicy: triggerRules?.scaleUp?.selectPolicy,
            policies: triggerRules?.scaleUp?.policies
          },
          scaleDown: {
            stabilizationWindowSeconds: triggerRules?.scaleDown?.stabilizationWindowSeconds,
            selectPolicy: triggerRules?.scaleDown?.selectPolicy,
            policies: triggerRules?.scaleDown?.policies
          }
        }
      })
    }
  }, [crudType, form, triggerRules])

  return (
    <Item {...others}>
      <Item name={[...fatherNamePath, SCALE_UP_FORM_NAME, 'selected']} valuePropName='checked'>
        <Checkbox>Scale Up</Checkbox>
      </Item>
      {scaleUpSelected && (
        <ScaleUpItems
          fatherNamePath={[...fatherNamePath, SCALE_UP_FORM_NAME]}
          crudType={crudType}
          form={form}
          scaleUpRules={triggerRules?.scaleUp}
        />
      )}
      <VerticalLine size='24px' color='white' />
      <Item name={[...fatherNamePath, SCALE_DOWN_FORM_NAME, 'selected']} valuePropName='checked'>
        <Checkbox>Scale Down</Checkbox>
      </Item>
      {scaleDownSelected && (
        <ScaleDownItems
          fatherNamePath={[...fatherNamePath, SCALE_DOWN_FORM_NAME]}
          crudType={crudType}
          form={form}
          scaleDownRules={triggerRules?.scaleDown}
        />
      )}
    </Item>
  )
}

export default ScaleDirectionItem
