import * as React from 'react'
import { Prompt as RoutePrompt, withRouter, RouteComponentProps } from 'react-router-dom'
import { Location } from 'history'
import { Modal } from 'infrad'

interface IConfig {
  /** CancelText of PromptDialog */
  cancelText?: string
  /** OkText of PromptDialog */
  okText?: string
  /** Title of PromptDialog */
  title?: string
  /** Content of  PromptDialog */
  content?: string
}
interface IProps extends RouteComponentProps {
  /** If true, only show Prompt when location.pathname changes */
  onlyPathname?: boolean
  /** If true, allow navigation. If false, prevent navigation. */
  when?: boolean
  children?: React.ReactNode
}

type Callback = (e: React.MouseEvent<HTMLElement>) => void
interface IConfirm {
  onOk: Callback
  onCancel?: Callback
}

/**
 * When the route is changed and some conditions are met, a pop-up prompt will be given to ask the user whether to leave.
 */
export default (config: IConfig = {}) => {
  const defaultConfig: IConfig = {
    okText: 'Leave',
    cancelText: 'Cancel',
    title: 'Are you sure to leave?',
    content: 'Changes you made may not be saved.',
  }
  const { title, content, okText, cancelText } = {
    ...defaultConfig,
    ...config,
  }

  const Prompt: React.FC<IProps> = ({ when, children, location, onlyPathname = true }) => {
    const message = JSON.stringify({
      title,
      content,
      okText,
      cancelText,
    })

    return (
      <>
        <RoutePrompt
          when={when}
          message={(l: Location) => {
            if (onlyPathname && location.pathname === l.pathname) {
              return true
            }
            return message
          }}
        />
        {children}
      </>
    )
  }

  return {
    Confirm: (config: IConfirm) => {
      Modal.confirm({
        title,
        content,
        okText,
        cancelText,
        onOk: config.onOk,
        onCancel: config.onCancel,
      })
    },
    Prompt: withRouter(Prompt),
  }
}
