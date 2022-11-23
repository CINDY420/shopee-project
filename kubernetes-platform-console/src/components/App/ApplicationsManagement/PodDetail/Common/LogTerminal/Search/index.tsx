import React from 'react'
import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined } from 'infra-design-icons'
import { ISearchOptions } from 'xterm-addon-search'

import {
  Root,
  Input,
  Operations,
  OperationIcon
} from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/Search/style'

import { KEY_ESC, KEY_ENTER } from 'constants/keyBoardCode'

import doublePressKeyHandler, { KEY } from 'helpers/terminal/doublePressKeyHandler'
import { LogTerminalContext } from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/useLogTerminalContext'

interface ISearchProps {
  show: boolean
  inputRef: React.Ref<HTMLInputElement>
  onClose: () => void
}

const Search: React.FC<ISearchProps> = props => {
  const { show, inputRef, onClose } = props

  const [isCloseClicked, setIsCloseClicked] = React.useState(false)
  const [input, setInput] = React.useState('')

  const { state, dispatch } = React.useContext(LogTerminalContext)
  const { xterm } = state

  const onDoublePressKeyStateMachine = React.useRef(doublePressKeyHandler(onClose))

  const handleClose = () => {
    onClose()
    xterm.focus()
    setIsCloseClicked(true)
  }

  const handlePreviousMatch = () => {
    xterm.searchAddon.findPrevious(input)
  }

  const handleNextMatch = () => {
    xterm.searchAddon.findNext(input)
  }

  const getSearchOptions = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const searchOptions: ISearchOptions = {
      incremental: event.key !== KEY_ENTER
    }

    return searchOptions
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const searchOPtions = getSearchOptions(event)
    xterm.searchAddon.findNext(input, searchOPtions)

    const keyCode = event.key
    if (keyCode === KEY_ESC) {
      onDoublePressKeyStateMachine.current.transition(KEY.PRESS_EVENT)
    }
  }

  return (
    <LogTerminalContext.Provider value={{ state, dispatch }}>
      <Root show={show} isCloseClicked={isCloseClicked}>
        <Input ref={inputRef} value={input} onChange={handleInputChange} onKeyUp={handleInputKeyUp} />
        <Operations>
          <OperationIcon onClick={handlePreviousMatch} title='Previous match'>
            <ArrowLeftOutlined />
          </OperationIcon>
          <OperationIcon onClick={handleNextMatch} title='Next match'>
            <ArrowRightOutlined />
          </OperationIcon>
          <OperationIcon onClick={handleClose}>
            <CloseOutlined />
          </OperationIcon>
        </Operations>
      </Root>
    </LogTerminalContext.Provider>
  )
}

export default Search
