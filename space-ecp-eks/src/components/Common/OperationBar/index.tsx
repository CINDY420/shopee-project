import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button } from 'infrad'

import { Root, StyledCount } from './style'

interface IOperationsBarProps {
  /** The parent node to which the action bar is rendered */
  parent: Element
  /** If false, the action bar will be hidden */
  visible?: boolean
  /** If true, the Confirm button will be grayed out and not clickable */
  disabled?: boolean
  /** The count of selected resources during batch operation */
  selectedCount: number
  /** Callback function for Confirm operation */
  onSubmit: () => void
  /** Callback function for Cancel operation */
  onCancel: () => void
  /** Used to customize the buttons in the action bar */
  buttons?: React.ReactNode
  /** When it comes to form operations, formId is used to pass in the form attribute */
  formId?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

/**
 * BatchOperations component is used for batch operation resources
 */
const OperationBar: React.FC<IOperationsBarProps> = ({
  visible = true,
  parent,
  disabled,
  selectedCount,
  onSubmit,
  onCancel,
  buttons,
  children,
  formId,
  style,
}) => {
  const domNode = parent

  return domNode
    ? ReactDOM.createPortal(
        <div style={{ zIndex: 1, ...style }}>
          <Root visible={visible}>
            {children}
            <StyledCount>
              Selected <span>{selectedCount}</span> items
            </StyledCount>
            {buttons ? (
              buttons
            ) : (
              <div>
                <Button style={{ marginRight: 8 }} onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  key="submit"
                  htmlType="submit"
                  form={formId}
                  type="primary"
                  disabled={disabled}
                  onClick={onSubmit}
                >
                  Confirm
                </Button>
              </div>
            )}
          </Root>
        </div>,
        domNode,
      )
    : null
}

export default OperationBar
