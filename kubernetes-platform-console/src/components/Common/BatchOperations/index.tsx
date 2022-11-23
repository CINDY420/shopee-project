import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button } from 'infrad'

import { Root, Count, Title, Desc } from './style'

interface IBatchOperationsProps {
  /** The parent node to which the action bar is rendered */
  parent?: Element
  /** If false, the action bar will be hidden */
  visible?: boolean
  /** Title of the action bar */
  title: string
  /** Description of the action bar */
  desc?: string
  /** If true, the Confirm button will be grayed out and not clickable */
  disabled?: boolean
  /** The count of selected resources during batch operation */
  selectedCount: number
  /** Callback function for Confirm operation */
  onSubmit: () => void
  /** Callback function for Cancel operation */
  onCancel: () => void
  /** Used to customize the buttons in the action bar */
  renderButtons?: () => React.ReactNode
  /** When it comes to form operations, formId is used to pass in the form attribute */
  formId?: string
}

/**
 * BatchOperations component is used for batch operation resources
 */
const BatchOperations: React.FC<IBatchOperationsProps> = ({
  visible = true,
  parent,
  title,
  desc,
  disabled,
  selectedCount,
  onSubmit,
  onCancel,
  renderButtons,
  children,
  formId
}) => {
  const domNode = parent || document.querySelector('#root .ant-layout')

  const renderOperationButtons = () => {
    if (renderButtons && typeof renderButtons === 'function') {
      return renderButtons()
    }

    return (
      <>
        <Button style={{ marginRight: 8 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button key='submit' htmlType='submit' form={formId} type='primary' disabled={disabled} onClick={onSubmit}>
          Confirm
        </Button>
      </>
    )
  }

  return domNode
    ? ReactDOM.createPortal(
      <div style={{ zIndex: 1 }}>
        <Root visible={visible}>
          <Title>
            {title}
            {desc && <Desc>{desc}</Desc>}
          </Title>
          {children}
          <div style={{ minWidth: '300px' }}>
            <Count>
                Selected <span>{selectedCount}</span> items
            </Count>
            {renderOperationButtons()}
          </div>
        </Root>
      </div>,
      domNode
    )
    : null
}

export default BatchOperations
