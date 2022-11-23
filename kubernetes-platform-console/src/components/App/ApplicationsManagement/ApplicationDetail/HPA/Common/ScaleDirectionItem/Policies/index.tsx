import React from 'react'
import TableFormList from 'components/Common/TableFormList'
import { Form, FormInstance, FormItemProps, Select, InputNumber, Row, Col } from 'infrad'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { ColumnsType } from 'infrad/lib/table'
import InfoToolTip from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/InfoToolTip'
import { Rule } from 'infrad/lib/form'
import { IHpaSpecScalePolicy } from 'swagger-api/v1/models'

const { Item } = Form

interface IPoliciesProps extends FormItemProps {
  fatherNamePath: string[]
  form: FormInstance
  policiesRules: IHpaSpecScalePolicy[]
}

export const policyTextMap = {
  PERCENT: 'Percent',
  PODS: 'Pods'
}

enum POLICY_ITEM_NAME {
  TYPE = 'type',
  VALUE = 'value',
  PERIODSECONDS = 'periodSeconds'
}

const SELECT_POLICY_TYPE = {
  MAX: 'Max',
  MIN: 'Min'
}

const Policies: React.FC<IPoliciesProps> = ({ fatherNamePath, form, policiesRules }) => {
  const [selectedPolicies, setSelectedPolicies] = React.useState<string[]>([])
  const [showSelectPolicy, setShowSelectPolicy] = React.useState(false)

  const handleValuesChange = (policiesRules: IHpaSpecScalePolicy[]) => {
    const selectedPolicies = policiesRules?.filter(item => !!item)
    const selectedPoliciesTypes = selectedPolicies?.map(({ type }) => type)

    selectedPolicies && setSelectedPolicies(selectedPoliciesTypes)

    setShowSelectPolicy(policiesRules?.length >= 2)
  }

  React.useEffect(() => {
    handleValuesChange(policiesRules)
  }, [policiesRules])

  const handleBeforeAddNew = async () => {
    const policiesRules = form.getFieldValue([...fatherNamePath, 'policies'])
    if (!policiesRules || policiesRules?.length === 0) {
      return
    }
    const lastRuleIndex = policiesRules.length - 1
    const policiesRulesItemFormNames = Object.values(POLICY_ITEM_NAME).map(formItemName => [
      ...fatherNamePath,
      'policies',
      lastRuleIndex,
      formItemName
    ])
    await form.validateFields(policiesRulesItemFormNames)
  }

  const columns: ColumnsType<FormListFieldData> = [
    {
      title: 'Type',
      dataIndex: 'type',
      width: '200px',
      render: (_, { name, ...restField }) => (
        <Item
          {...restField}
          name={[name, POLICY_ITEM_NAME.TYPE]}
          rules={[{ required: true, message: 'Please select type!' }]}
        >
          <Select>
            <Select.Option
              key-={policyTextMap.PERCENT}
              value={policyTextMap.PERCENT}
              disabled={selectedPolicies.includes(policyTextMap.PERCENT)}
            >
              {policyTextMap.PERCENT}
            </Select.Option>
            <Select.Option
              key-={policyTextMap.PODS}
              value={policyTextMap.PODS}
              disabled={selectedPolicies.includes(policyTextMap.PODS)}
            >
              {policyTextMap.PODS}
            </Select.Option>
          </Select>
        </Item>
      )
    },
    {
      title: 'Value',
      dataIndex: 'value',
      render: (_, { name, ...restField }) => {
        const selectedPolicyType = policiesRules?.[name]?.type
        const isSelectedPolicyPercentType = selectedPolicyType === policyTextMap.PERCENT

        const rules: Rule[] = isSelectedPolicyPercentType
          ? [{ required: true, type: 'integer', min: 0, max: 100, message: 'Must be an integer between 0-100' }]
          : [
              {
                required: true,
                type: 'integer',
                min: 0,
                message: <div style={{ whiteSpace: 'pre-line' }}>Must be non-negative integer.</div>
              }
            ]
        return (
          <Item {...restField} name={[name, POLICY_ITEM_NAME.VALUE]} rules={rules}>
            <InputNumber style={{ width: 88 }} addonAfter={isSelectedPolicyPercentType && '%'} />
          </Item>
        )
      }
    },
    {
      title: 'PeriodSeconds',
      dataIndex: 'periodSeconds',
      render: (_, { name, ...restField }) => (
        <Item
          {...restField}
          name={[name, POLICY_ITEM_NAME.PERIODSECONDS]}
          rules={[
            {
              required: true,
              type: 'integer',
              min: 1,
              message: <div style={{ whiteSpace: 'pre-line' }}>Must be positive integer.</div>
            }
          ]}
        >
          <InputNumber style={{ width: 88 }} />
        </Item>
      )
    }
  ]
  return (
    <Row>
      <Col span={24}>
        <InfoToolTip
          title='Policies'
          info='Define the number of pods changed in the sepcified period of time.'
          placement='bottom'
        />{' '}
        :
      </Col>
      <Col span={24}>
        <Item name={[...fatherNamePath, 'policies']}>
          <TableFormList
            name={[...fatherNamePath, 'policies']}
            columns={columns}
            beforeAddNew={handleBeforeAddNew}
            addNewVisible={!showSelectPolicy}
            rules={[
              {
                validator: async (_, policiesRules) => {
                  if (!policiesRules || policiesRules.length < 1) {
                    return Promise.reject(new Error('At least 1 rule!'))
                  }
                }
              }
            ]}
          />
        </Item>
      </Col>
      {showSelectPolicy && (
        <>
          <Col span={12}>
            <InfoToolTip
              title='SelectPolicy'
              info='Define how to select the changed number of pods when multiple policies are specified.'
              placement='bottom'
            />{' '}
            :
          </Col>
          <Col span={12}>
            <Item
              name={[...fatherNamePath, 'selectPolicy']}
              rules={[{ required: true, message: 'Please select SelectPolicy' }]}
            >
              <Select style={{ width: '120px' }}>
                <Select.Option value={SELECT_POLICY_TYPE.MAX}>{SELECT_POLICY_TYPE.MAX}</Select.Option>
                <Select.Option value={SELECT_POLICY_TYPE.MIN}>{SELECT_POLICY_TYPE.MIN}</Select.Option>
              </Select>
            </Item>
          </Col>
        </>
      )}
    </Row>
  )
}

export default Policies
