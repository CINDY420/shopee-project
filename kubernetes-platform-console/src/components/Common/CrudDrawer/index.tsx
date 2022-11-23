import * as React from 'react'
import { Button } from 'infrad'
import { DrawerProps } from 'infrad/lib/drawer'

import { StyledDrawer } from './style'

interface ICrudDrawerProps extends DrawerProps {
  /** Control the disabled state of submit button */
  isSubmitDisabled: boolean
  isLoading?: boolean
  /** Callback of drawer close event */
  closeDrawer: () => void
  /** Drawer body */
  body: any
  /** Callback of cancel btn click event */
  onCancel?: () => void
  /** Callback of submit btn click event */
  onSubmit?: () => void
  /** Id of drawer body form(if have) */
  formId?: string
  submitText?: string
}

const CrudDrawer: React.FC<ICrudDrawerProps> = props => {
  const {
    visible,
    closeDrawer,
    title,
    body,
    onCancel,
    onSubmit,
    width,
    isSubmitDisabled,
    isLoading,
    formId,
    submitText = 'Submit',
    ...otherDrawerProps
  } = props

  return (
    <>
      <StyledDrawer
        title={title}
        width={width || 528}
        onClose={closeDrawer}
        visible={visible}
        headerStyle={{ borderBottom: 'none', padding: '24px' }}
        bodyStyle={{ paddingBottom: 80, paddingTop: '8px' }}
        footer={
          <div
            style={{
              textAlign: 'right'
            }}
          >
            <Button
              onClick={() => {
                closeDrawer()
                if (onCancel) {
                  onCancel()
                }
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              key='submit'
              htmlType='submit'
              form={formId}
              onClick={() => {
                // closeDrawer()
                onSubmit && onSubmit()
              }}
              type='primary'
              disabled={isSubmitDisabled}
              loading={isLoading}
            >
              {submitText}
            </Button>
          </div>
        }
        footerStyle={{ borderTop: 'none' }}
        {...otherDrawerProps}
      >
        <>{body}</>
      </StyledDrawer>
    </>
  )
}

export default CrudDrawer
