import * as React from 'react'
import { Button, notification } from 'infrad'
import { ExpandOutlined, CompressOutlined } from 'infra-design-icons'
import { Root, Start, Close } from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/FullScreen/style'

interface ITerminalProps {
  terminalContainer: HTMLElement
  isFullScreen: boolean
  onFullScreenChange: (isFullScreen: boolean) => void
}

const ERROR_NAME = 'Terminal Full Screen Error'
const ERROR_MESSAGE =
  'This may be due to an inappropriate browser, please use Firefox, Chrome or Safari to open this page.'

const FullScreenButton: React.FC<ITerminalProps> = props => {
  const { terminalContainer, isFullScreen, onFullScreenChange } = props

  const handleStartFullScreen = async () => {
    try {
      await requestFullscreenPromise()
      onFullScreenChange(true)
      document.onfullscreenchange = handleFullscreenchange
    } catch (err) {
      handleTerminalFullScreenError(err)
    }
  }

  const handleTerminalFullScreenError = (error: { name: string; message: string }) => {
    const terminalError = {
      message: error.name || ERROR_NAME,
      description: error.message || ERROR_MESSAGE
    }
    notification.error(terminalError)
  }

  const requestFullscreenPromise = async () => {
    if (terminalContainer.requestFullscreen) {
      return terminalContainer.requestFullscreen()
    } else if (terminalContainer.mozRequestFullScreen) {
      /* Firefox */
      return terminalContainer.mozRequestFullScreen()
    } else if (terminalContainer.webkitRequestFullscreen) {
      /* Chrome, Safari */
      return terminalContainer.webkitRequestFullscreen()
    }

    throw new Error(ERROR_MESSAGE)
  }

  const handleFullscreenchange = () => {
    const fullscreenElement = document.fullscreenElement
    if (fullscreenElement === null) {
      resetFullScreenState()
    }
  }

  const resetFullScreenState = () => {
    onFullScreenChange(false)
    document.onfullscreenchange = null
  }

  const handleCloseFullScreen = async () => {
    try {
      await requestCloseFullScreenPromise()
      resetFullScreenState()
    } catch (err) {
      alert(err)
    }
  }

  const requestCloseFullScreenPromise = async () => {
    if (document.exitFullscreen) {
      return document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      return document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari */
      return document.webkitExitFullscreen()
    }

    throw new Error(ERROR_MESSAGE)
  }

  return (
    <Root>
      {isFullScreen ? (
        <Close onClick={handleCloseFullScreen}>
          <Button ghost>
            <CompressOutlined translate='yes' />
            Exit Full Screen
          </Button>
        </Close>
      ) : (
        <Start onClick={handleStartFullScreen}>
          <Button>
            <ExpandOutlined translate='yes' />
            Full Screen
          </Button>
        </Start>
      )}
    </Root>
  )
}

export default FullScreenButton
