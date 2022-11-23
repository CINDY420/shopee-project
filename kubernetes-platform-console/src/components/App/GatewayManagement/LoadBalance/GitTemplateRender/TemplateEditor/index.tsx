import * as React from 'react'

import GitTemplate from './GitTemplate'
import { RadiosTabs, RadiosTabPane } from 'components/Common/RadiosTabs'

export enum ENVS {
  NON_LIVE = 'nonlive',
  LIVE = 'live'
}

const TemplateEditor: React.FC = () => {
  const [selectedEnv, setSelectedEnv] = React.useState(ENVS.NON_LIVE)

  const envs = React.useMemo(
    () => [
      {
        key: ENVS.NON_LIVE,
        label: 'Nonlive'
      },
      {
        key: ENVS.LIVE,
        label: 'Live'
      }
    ],
    []
  )

  const handleEnvChange = React.useCallback(newEnv => {
    setSelectedEnv(newEnv)
  }, [])

  return (
    <RadiosTabs activeKey={selectedEnv} onChange={handleEnvChange} optionType='default'>
      {envs.map(env => {
        const { key, label } = env
        return (
          <RadiosTabPane key={key} name={label} value={key}>
            <GitTemplate selectedEnv={key} />
          </RadiosTabPane>
        )
      })}
    </RadiosTabs>
  )
}

export default TemplateEditor
