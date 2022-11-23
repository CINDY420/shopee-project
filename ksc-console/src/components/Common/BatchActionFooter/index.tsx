import {
  StyledDivider,
  StyledRoot,
  StyledTitle,
  StyledSelected,
  StyledButton,
} from 'components/Common/BatchActionFooter/style'
import React from 'react'

interface IBatchActionFooterProps {
  title: string
  selectedAccount: number
  onCancel: () => void
  onOk: (selectedAccount: number) => void
}
const BatchActionFooter: React.FC<IBatchActionFooterProps> = ({
  title,
  selectedAccount,
  onCancel,
  onOk,
}) => {
  const handleCancel = () => {
    onCancel()
  }

  const handleOk = () => {
    onOk(selectedAccount)
  }

  return (
    <>
      <StyledDivider />
      <StyledRoot>
        <StyledTitle>{title}</StyledTitle>
        <div>
          <StyledSelected>Selected {selectedAccount} items</StyledSelected>
          <StyledButton onClick={handleCancel}>Cancel</StyledButton>
          <StyledButton onClick={handleOk} type="primary">
            Confirm
          </StyledButton>
        </div>
      </StyledRoot>
    </>
  )
}

export default BatchActionFooter
