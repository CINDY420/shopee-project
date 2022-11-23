import { IFormHpaCronRule } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer/CreateEditRuleForm/interface'
import { IHpaCronRule } from 'swagger-api/v1/models'
import moment, { Moment } from 'moment-timezone'
import {
  HPA_CRON_RULE_REPEAT_TYPE,
  ONCE_TYPE_TIME_API_FORMAT,
  OTHER_TYPES_TIME_FORMAT,
  HPA_CRON_RULE_WEEK_DAY
} from 'constants/hpa'

const weekdayList = Object.values(HPA_CRON_RULE_WEEK_DAY)

export const formatMomentTime = (repeatType: IHpaCronRule['repeatType'], time: Moment): string => {
  const timeFormat = repeatType === HPA_CRON_RULE_REPEAT_TYPE.ONCE ? ONCE_TYPE_TIME_API_FORMAT : OTHER_TYPES_TIME_FORMAT
  // local time to utc
  const localTimezone = moment.tz.guess()
  const utcMoment = moment.tz(time, localTimezone).utc()
  return utcMoment.format(timeFormat)
}

// Transform time of 'MM-DD HH:mm' or 'HH:mm' format to 'YYYY-MM-DD HH:mm' of moment format
export const transformCronRuleTimeToMoment = (repeatType: IHpaCronRule['repeatType'], time: string): Moment => {
  const currentDate = new Date()
  const timePrefix = repeatType === HPA_CRON_RULE_REPEAT_TYPE.ONCE ? '' : moment(currentDate).format('YYYY-MM-DD ')
  const momentTime = `${timePrefix}${time}`
  // transform utc time to local time
  const timeMoment = moment(momentTime)
  return timeMoment
}

export const transformUtcToLocalMoment = (utcTimeMoment: Moment): Moment => {
  const localTimezone = moment.tz.guess()
  const utcLocalZoneDiffMinutes = moment.tz.zone(localTimezone).parse(Date.now())
  const localTimeMoment = utcTimeMoment.clone().add(-utcLocalZoneDiffMinutes, 'minutes')
  return localTimeMoment
}

const transformWeekdayToUtc = (
  localWeekday: IHpaCronRule['startWeekday'],
  localTimeMoment: Moment
): HPA_CRON_RULE_WEEK_DAY => {
  const localTimezone = moment.tz.guess()
  const utcTimeMoment = moment.tz(localTimeMoment, localTimezone).utc()
  const localTimeHour = localTimeMoment.hour()
  const utcTimeHour = utcTimeMoment.hour()
  const utcLocalDiffMinutes = moment.tz.zone(localTimezone).parse(Date.now())

  const localWeekdayIndex = weekdayList.findIndex(value => value === localWeekday)
  let utcWeekdayIndex = localWeekdayIndex
  if (utcLocalDiffMinutes < 0 && utcTimeHour > localTimeHour) {
    utcWeekdayIndex -= 1
    // Monday -> Sunday
    if (utcWeekdayIndex < 0) {
      utcWeekdayIndex = weekdayList.length - 1
    }
  } else if (utcLocalDiffMinutes > 0 && utcTimeHour < localTimeHour) {
    utcWeekdayIndex += 1
    // Sunday -> Monday
    if (utcWeekdayIndex > weekdayList.length - 1) {
      utcWeekdayIndex = 0
    }
  }

  return weekdayList[utcWeekdayIndex]
}

export const formatUtcWeekdayToLocal = (
  utcStartWeekday: IHpaCronRule['startWeekday'],
  utcTimeMoment: Moment
): IHpaCronRule['startWeekday'] => {
  const localTimeMoment = transformUtcToLocalMoment(utcTimeMoment)

  const localTimezone = moment.tz.guess()
  const utcLocalDiffMinutes = moment.tz.zone(localTimezone).parse(Date.now())
  let localUtcDayOffset = 0
  if (utcLocalDiffMinutes < 0 && utcTimeMoment.hour() > localTimeMoment.hour()) {
    localUtcDayOffset = 1
  } else if (utcLocalDiffMinutes > 0 && utcTimeMoment.hour() < localTimeMoment.hour()) {
    localUtcDayOffset = -1
  }
  const utcStartWeekdayIndex = weekdayList.findIndex(value => value === utcStartWeekday)
  let localWeekdayIndex = utcStartWeekdayIndex + localUtcDayOffset
  if (localWeekdayIndex >= weekdayList.length) {
    localWeekdayIndex = 0
  } else if (localWeekdayIndex < 0) {
    localWeekdayIndex = weekdayList.length - 1
  }
  return weekdayList[localWeekdayIndex]
}

export const formatWeekday = (
  utcStartWeekday: IHpaCronRule['startWeekday'],
  utcEndWeekday: IHpaCronRule['endWeekday']
): IHpaCronRule['startWeekday'] => {
  const localTimezone = moment.tz.guess()
  const utcLocalZoneDiffMinutes = moment.tz.zone(localTimezone).parse(Date.now())
  // If utcLocalZoneDiffMinutes > 0, utc time endWeekday is same with local time currentWeekday, and vice versa.
  const localWeekday = utcLocalZoneDiffMinutes > 0 ? utcEndWeekday : utcStartWeekday
  return localWeekday
}

export const extractCronRulesFromForm = (formCronRules: IFormHpaCronRule[]): IHpaCronRule[] => {
  // infrad Cascader repeatType value is [string, string] while api repeatType is string
  const cronRules = formCronRules.map(({ repeatTypes, timeMoments, ...others }) => {
    const [repeatType, weekday] = repeatTypes
    const [startTimeMoment, endTimeMoment] = timeMoments
    let utcStartWeekday = weekday
    let utcEndWeekday = weekday
    // transform local weekday to uct
    if (repeatType === HPA_CRON_RULE_REPEAT_TYPE.WEEKLY) {
      utcStartWeekday = transformWeekdayToUtc(weekday, startTimeMoment)
      const isSecondDay = startTimeMoment.hour() > endTimeMoment.hour()
      let endWeekday = weekday
      if (isSecondDay) {
        const localWeekdayIndex = weekdayList.findIndex(value => value === endWeekday)
        const endWeekdayIndex = localWeekdayIndex + 1 >= weekdayList.length ? 0 : localWeekdayIndex + 1
        endWeekday = weekdayList[endWeekdayIndex]
      }
      utcEndWeekday = transformWeekdayToUtc(endWeekday, endTimeMoment)
    }
    const startTimeUtcString = formatMomentTime(repeatType, startTimeMoment)
    const endTimeUtcString = formatMomentTime(repeatType, endTimeMoment)
    return {
      repeatType,
      startWeekday: utcStartWeekday,
      endWeekday: utcEndWeekday,
      startTime: startTimeUtcString,
      endTime: endTimeUtcString,
      ...others
    }
  })
  return cronRules
}

export const formatCronRulesToForm = (cronRules: IHpaCronRule[]): IFormHpaCronRule[] => {
  // repeatType is string while infrad Cascader repeatType value is string[]
  const formCronRules = cronRules.map(
    ({
      repeatType,
      startWeekday: utcStartWeekday,
      endWeekday: utcEndWeekday,
      startTime: utcStartTime,
      endTime: utcEndTime,
      ...others
    }) => {
      let formRepeatTypes: IFormHpaCronRule['repeatTypes'] = [repeatType]
      const utcStartTimeMoment = transformCronRuleTimeToMoment(repeatType, utcStartTime)
      const utcEndTimeMoment = transformCronRuleTimeToMoment(repeatType, utcEndTime)
      if (repeatType === HPA_CRON_RULE_REPEAT_TYPE.WEEKLY) {
        const localStartWeekday = formatUtcWeekdayToLocal(utcStartWeekday, utcStartTimeMoment)
        const localEndWeekday = formatUtcWeekdayToLocal(utcEndWeekday, utcEndTimeMoment)
        const localWeekday = formatWeekday(localStartWeekday, localEndWeekday)
        formRepeatTypes = [repeatType, localWeekday]
      }
      const localStartTimeMoment = transformUtcToLocalMoment(utcStartTimeMoment)
      const localEndTimeMoment = transformUtcToLocalMoment(utcEndTimeMoment)

      return { repeatTypes: formRepeatTypes, timeMoments: [localStartTimeMoment, localEndTimeMoment], ...others }
    }
  )
  return formCronRules
}
