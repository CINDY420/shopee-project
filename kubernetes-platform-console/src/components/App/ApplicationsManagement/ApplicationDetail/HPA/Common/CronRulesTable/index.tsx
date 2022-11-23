import React from 'react'
import { Table, TableColumnType } from 'infrad'
import { Title } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/CronRulesTable/style'
import { SwapRightOutlined } from 'infra-design-icons'
import { CSSProperties } from 'styled-components'
import { IHpaCronRule } from 'swagger-api/v1/models'
import {
  HPA_CRON_RULE_REPEAT_TYPE,
  hpaCronRuleWeekdayDisplayMap,
  ONCE_TYPE_TIME_API_FORMAT,
  OTHER_TYPES_TIME_FORMAT
} from 'constants/hpa'
import {
  transformCronRuleTimeToMoment,
  formatUtcWeekdayToLocal,
  formatWeekday,
  transformUtcToLocalMoment
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/helper/cronRules'

interface ICronRulesTableProps {
  cronRules: IHpaCronRule[]
  style?: CSSProperties
}

const CronRulesTable: React.FC<ICronRulesTableProps> = ({ cronRules = [], style }) => {
  const CronRulesColumn: TableColumnType<IHpaCronRule>[] = [
    {
      title: 'Repeat',
      dataIndex: 'repeatType',
      key: 'repeatType',
      width: '76px',
      render: (repeatType: string, record) => {
        if (repeatType === HPA_CRON_RULE_REPEAT_TYPE.WEEKLY) {
          const {
            startWeekday: utcStartWeekday,
            startTime: utcStartTime,
            endTime: utcEndTime,
            endWeekday: utcEndWeekday
          } = record
          const utcStartTimeMoment = transformCronRuleTimeToMoment(repeatType, utcStartTime)
          const utcEndTimeMoment = transformCronRuleTimeToMoment(repeatType, utcEndTime)
          const localStartWeekday = formatUtcWeekdayToLocal(utcStartWeekday, utcStartTimeMoment)
          const localEndWeekday = formatUtcWeekdayToLocal(utcEndWeekday, utcEndTimeMoment)
          const localWeekday = formatWeekday(localStartWeekday, localEndWeekday)
          return hpaCronRuleWeekdayDisplayMap[localWeekday]
        }
        return repeatType
      }
    },
    {
      title: 'Date &Time',
      key: 'time',
      render: (_, record) => {
        const { repeatType, startTime, endTime } = record
        const startTimeMoment = transformCronRuleTimeToMoment(repeatType, startTime)
        const endTimeMoment = transformCronRuleTimeToMoment(repeatType, endTime)
        const localStartTimeMoment = transformUtcToLocalMoment(startTimeMoment)
        const localEndTimeMoment = transformUtcToLocalMoment(endTimeMoment)
        const timeFormat =
          repeatType === HPA_CRON_RULE_REPEAT_TYPE.ONCE ? ONCE_TYPE_TIME_API_FORMAT : OTHER_TYPES_TIME_FORMAT
        return (
          <>
            {localStartTimeMoment.format(timeFormat)} <SwapRightOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />{' '}
            {localEndTimeMoment.format(timeFormat)}
          </>
        )
      }
    },
    {
      title: 'Target Count',
      dataIndex: 'targetCount',
      key: 'targetCount',
      width: '120px'
    }
  ]

  return (
    <div style={style}>
      <Title>CronRules</Title>
      <Table
        columns={CronRulesColumn}
        dataSource={cronRules}
        bordered
        pagination={false}
        style={{ marginTop: '16px' }}
        rowKey={record => `${record.repeatType}-${record.startTime}-${record.endTime}`}
      />
    </div>
  )
}

export default CronRulesTable
