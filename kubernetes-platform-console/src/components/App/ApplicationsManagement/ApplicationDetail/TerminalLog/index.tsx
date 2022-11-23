import * as React from 'react'
import { Radio, RadioChangeEvent } from 'infrad'
import { IApplication } from 'api/types/application/application'
import { Root, Header } from './style'
import { useQueryParam, StringParam } from 'use-query-params'
import Replay from 'components/App/ApplicationsManagement/ApplicationDetail/TerminalLog/Replay'
import Command from 'components/App/ApplicationsManagement/ApplicationDetail/TerminalLog/Command'

interface ITerminalLogProps {
  application: IApplication
}

const ACTION = {
  COMMAND: 'Command',
  REPLAY: 'Replay'
}
const TerminalLog: React.FC<ITerminalLogProps> = ({ application }) => {
  const [selectedAction, setSelectedAction] = useQueryParam('selectedAction', StringParam)
  const handleRadioChange = React.useCallback(
    (event: RadioChangeEvent) => {
      const value = event.target.value
      setSelectedAction(value)
    },
    [setSelectedAction]
  )

  return (
    <Root>
      <Header>
        <div>
          <Radio.Group value={selectedAction || ACTION.COMMAND} onChange={handleRadioChange}>
            {Object.entries(ACTION).map(([key, value]) => (
              <Radio.Button key={key} value={value}>
                {value}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        {selectedAction === ACTION.REPLAY ? (
          <Replay application={application} />
        ) : (
          <Command application={application} />
        )}
      </Header>
    </Root>
  )
}

export default TerminalLog
