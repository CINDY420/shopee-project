import * as React from 'react'
import copy from 'copy-to-clipboard'
import { message } from 'infrad'
import { CopyOutlined } from 'infra-design-icons'

import { TEMPLATE_TYPE } from '../index'

import BaseTextArea from './Common/BaseTextArea'

import { StyledButton } from './style'

interface IProps {
  loading: boolean
  value: any
  templateType: TEMPLATE_TYPE
}

const OutputTextArea: React.FC<IProps> = ({ loading, value, templateType }) => {
  const [result, setResult] = React.useState('')
  const title = `${templateType === TEMPLATE_TYPE.FRONTEND ? 'Frontend' : 'Backend'} Template`

  const formatValue = React.useCallback((): string => {
    if (typeof value === 'string') {
      return value
    }

    if (templateType === TEMPLATE_TYPE.FRONTEND) {
      const envs = Object.values(value)
      return envs.reduce<string>((result: string, currentEnv: string[]) => {
        const str = currentEnv.join('\n') + '\n\n'

        return result + str
      }, '')
    } else {
      const clustersStr = value.map(cluster => {
        const { clusterRenders } = cluster
        const envStr = clusterRenders.map(env => {
          const { envRenders } = env
          return envRenders.join('\n')
        })
        return envStr.join('\n\n')
      })

      return clustersStr.join('\n\n\n')
    }
  }, [templateType, value])

  const handleCopy = React.useCallback(() => {
    if (copy(result)) {
      message.success('copy successfully!')
    } else {
      message.error('copy failed!')
    }
  }, [result])

  React.useEffect(() => {
    if (value) {
      setResult(formatValue())
    }
  }, [formatValue, value])

  return (
    <BaseTextArea
      title={title}
      value={result}
      loading={loading}
      button={
        <StyledButton icon={<CopyOutlined />} onClick={handleCopy}>
          Copy
        </StyledButton>
      }
    />
  )
}

export default OutputTextArea
