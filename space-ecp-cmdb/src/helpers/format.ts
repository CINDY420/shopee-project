import moment from 'moment'

export const formatTime = (t: number | string | Date) => {
  if (!t) {
    return '--'
  }

  const time = new Date(t).valueOf()
  if (time < 0) {
    return '--'
  }

  return moment(time * 1000).format('YYYY/MM/DD HH:mm:ss')
}
