import { Result } from 'infrad'
import { ResultStatusType } from 'infrad/lib/result'

interface IErrorComponentProps {
  status: ResultStatusType
}
interface IErrorConfig {
  title: string
  subTitle: string
}

const ERROR_MAP: Record<string, IErrorConfig> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention -- TODO: tiancheng.zhang 辛苦确认下这里一定要用数字Key吗
  404: {
    title: '404',
    subTitle: 'Sorry, the page you visited does not exist.',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention -- TODO: tiancheng.zhang 辛苦确认下这里一定要用数字Key吗
  403: {
    title: '403',
    subTitle: 'Sorry, you are not authorized to access this page.',
  },
  error: {
    title: 'error',
    subTitle: 'Sorry, an error occurred.',
  },
}

const ErrorComponent = ({ status }: IErrorComponentProps) => (
  <Result status={status} title={ERROR_MAP[status].title} subTitle={ERROR_MAP[status].subTitle} />
)

export default ErrorComponent
