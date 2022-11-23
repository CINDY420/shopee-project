import React from 'react'

import { Button, Modal, message } from 'infrad'

import { Container, StyledIcon, StyledTitle, Content, Name, ButtonContainer } from './style'

import { CopyToClipboard } from 'react-copy-to-clipboard'

interface IModalProps {
  visible: boolean
  sessionKey: string
  handleOk: () => void
  handleCancel: () => void
}

const SuccessModal: React.FC<IModalProps> = ({ visible, sessionKey, handleOk, handleCancel }) => {
  const handleCopy = () => {
    message.success('Copy Successfully!')
  }

  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      getContainer={() => document.body}
      footer={null}
      width={400}
    >
      <Container>
        <StyledIcon />
        <StyledTitle>Successfully</StyledTitle>
        <Content>
          <Name>Session key: </Name>
          {sessionKey}
        </Content>
        <ButtonContainer>
          <Button key='cancel' onClick={handleCancel}>
            Cancel
          </Button>
          <CopyToClipboard onCopy={handleCopy} text={sessionKey}>
            <Button key='comfirm' type='primary' onClick={handleOk}>
              Copy Session Key
            </Button>
          </CopyToClipboard>
        </ButtonContainer>
      </Container>
    </Modal>
  )
}

export default SuccessModal
