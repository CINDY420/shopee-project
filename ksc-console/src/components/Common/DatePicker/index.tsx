import dateFnsGenerateConfig from 'rc-picker/es/generate/dateFns'
import generatePicker from 'infrad/es/date-picker/generatePicker'
import 'infrad/es/date-picker/style/index'

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig)

export default DatePicker
