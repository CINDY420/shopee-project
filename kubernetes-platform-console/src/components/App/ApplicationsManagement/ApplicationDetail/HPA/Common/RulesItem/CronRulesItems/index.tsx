import React, { useCallback } from 'react'
import { Form, InputNumber, Checkbox, Cascader, DatePicker, TimePicker, FormInstance, Tooltip } from 'infrad'
import TableFormList from 'components/Common/TableFormList'
import InfoToolTip from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/InfoToolTip'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { ColumnsType } from 'infrad/lib/table'
import { RangePickerProps } from 'infrad/lib/date-picker'
import {
  DisabledAddNewButton,
  TimeWrapper,
  YearWrapper
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/RulesItem/CronRulesItems/style'
import { IFormHpaCronRule } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer/CreateEditRuleForm/interface'
import {
  HPA_CRON_RULE_REPEAT_TYPE,
  hpaCronRuleWeekdayDisplayMap,
  ONCE_TYPE_TIME_FORM_FORMAT,
  OTHER_TYPES_TIME_FORMAT
} from 'constants/hpa'
import { IHpaCronRule } from 'swagger-api/v1/models'

const { Item } = Form

interface ICascaderOption {
  value: string
  label: string
  children?: ICascaderOption[]
}

const CRON_RULES_TABLE_ID = 'cron-rules-table'
const MAX_CRON_RULES_COUNT = 20

// Infrad Form List and Item name
const CRON_RULES_SELECTED_ITEM_NAME = 'cronRulesSelected'
const CRON_RULES_LIST_NAME = 'cronRules'
enum CRON_RULE_ITEM_NAME {
  REPEAT_TYPES = 'repeatTypes',
  TIME = 'timeMoments',
  TARGET_COUNT = 'targetCount'
}

const repeatCascaderOptions: ICascaderOption[] = Object.values(HPA_CRON_RULE_REPEAT_TYPE).map(repeatType => {
  let children: ICascaderOption[]
  if (repeatType === HPA_CRON_RULE_REPEAT_TYPE.WEEKLY) {
    children = Object.entries(hpaCronRuleWeekdayDisplayMap).map(([weekday, weekdayDisplay]) => ({
      value: weekday,
      label: weekdayDisplay
    }))
  }
  return { value: repeatType, label: repeatType, children }
})

interface ICronRulesItemsProps {
  form: FormInstance
  fatherNamePath: string[]
  cronRules: IFormHpaCronRule[]
}
const CronRulesItems: React.FC<ICronRulesItemsProps> = ({ form, fatherNamePath, cronRules = [] }) => {
  const getRepeatTypeByIndex = useCallback(
    (index): IHpaCronRule['repeatType'] => {
      const currentRepeatType = cronRules[index]?.repeatTypes
      // Cascader value is like [firstItem, secondItem], and the firstItem is the repeatType
      return currentRepeatType?.length > 0 ? currentRepeatType[0] : undefined
    },
    [cronRules]
  )

  const shouldDisableAddNew = cronRules?.length >= MAX_CRON_RULES_COUNT
  const disabledAddNewRender = () => (
    <DisabledAddNewButton>Up to {MAX_CRON_RULES_COUNT} Cron Rules can be added</DisabledAddNewButton>
  )

  const cronRulesSelected = form.getFieldValue([...fatherNamePath, CRON_RULES_SELECTED_ITEM_NAME])

  // Only support current year when repeatType===once
  const currentYear = new Date().getFullYear()
  const checkDisabledDate: RangePickerProps['disabledDate'] = selectDate => selectDate.year() !== currentYear

  const columns: ColumnsType<FormListFieldData> = [
    {
      title: 'Repeat',
      width: '88px',
      render: (_, { name, ...restField }) => {
        return (
          <Item
            {...restField}
            name={[name, CRON_RULE_ITEM_NAME.REPEAT_TYPES]}
            rules={[{ required: true, message: 'Required!' }]}
          >
            <Cascader
              options={repeatCascaderOptions}
              displayRender={(_, selectedOptions) => {
                const lastOption = selectedOptions[selectedOptions.length - 1]
                return lastOption?.label
              }}
            />
          </Item>
        )
      }
    },
    {
      title: 'Time',
      width: '220px',
      render: (_, { name, ...restField }, index) => {
        return (
          <TimeWrapper>
            {getRepeatTypeByIndex(index) === HPA_CRON_RULE_REPEAT_TYPE.ONCE && (
              <Tooltip title='Current year only.'>
                <YearWrapper>{currentYear}</YearWrapper>
              </Tooltip>
            )}
            <Item
              {...restField}
              name={[name, CRON_RULE_ITEM_NAME.TIME]}
              rules={[{ required: true, message: 'Required!' }]}
            >
              {getRepeatTypeByIndex(index) === HPA_CRON_RULE_REPEAT_TYPE.ONCE ? (
                <DatePicker.RangePicker
                  showTime
                  format={ONCE_TYPE_TIME_FORM_FORMAT}
                  getPopupContainer={() => document.getElementById(CRON_RULES_TABLE_ID)}
                  disabledDate={checkDisabledDate}
                />
              ) : (
                <TimePicker.RangePicker order={false} format={OTHER_TYPES_TIME_FORMAT} />
              )}
            </Item>
          </TimeWrapper>
        )
      }
    },
    {
      title: 'Target Count',
      render: (_, { name, ...restField }) => {
        return (
          <Item
            {...restField}
            name={[name, CRON_RULE_ITEM_NAME.TARGET_COUNT]}
            rules={[
              { required: true, message: 'Required' },
              { type: 'number', min: 0, message: 'Should >= 0!' }
            ]}
          >
            <InputNumber />
          </Item>
        )
      }
    }
  ]

  const handleBeforeAddNew = async () => {
    const cronRules = form.getFieldValue([...fatherNamePath, CRON_RULES_LIST_NAME])
    if (!cronRules || cronRules?.length <= 0) return
    const lastRuleIndex = cronRules.length - 1
    const cronRuleItemFormNames = Object.values(CRON_RULE_ITEM_NAME).map(formItemName => [
      ...fatherNamePath,
      CRON_RULES_LIST_NAME,
      lastRuleIndex,
      formItemName
    ])
    await form.validateFields(cronRuleItemFormNames)
  }

  return (
    <>
      <Item name={[...fatherNamePath, CRON_RULES_SELECTED_ITEM_NAME]} valuePropName='checked'>
        <Checkbox>
          <InfoToolTip title='Cron Rules' info='Configure a cronjob to scale.' />
        </Checkbox>
      </Item>
      {cronRulesSelected && (
        <div id={CRON_RULES_TABLE_ID}>
          <TableFormList
            name={[...fatherNamePath, CRON_RULES_LIST_NAME]}
            columns={columns}
            rules={[
              {
                validator: async (_, cronRules) => {
                  if (!cronRules || cronRules.length < 1) {
                    return Promise.reject(new Error('At least 1 rule!'))
                  }
                }
              }
            ]}
            addNewRender={shouldDisableAddNew ? disabledAddNewRender : undefined}
            beforeAddNew={handleBeforeAddNew}
          />
        </div>
      )}
    </>
  )
}

export default CronRulesItems
