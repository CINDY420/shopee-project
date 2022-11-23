import React from 'react'
import { Modal, Button, Space } from 'infrad'

import { Wrapper, Top, Content, FeaturesWrapper, FeatureTagWrapper, BugFixesTagWrapper } from './style'

import newVersionSvg from 'assets/newVersion.svg'

import { RELEASE_VERSION_KEY } from 'constants/versionControl'

const version = __RELEASE__
const features = __RELEASE_FEATURES__ || []
const bugfixes = __RELEASE_BUGFIXES__ || []

// version example: 1.1.3
const isBigRelease = (newVersion: string) => {
  const storageVersion = localStorage.getItem(RELEASE_VERSION_KEY)

  if (!storageVersion) return true
  if (newVersion === storageVersion) return false

  const newVersionItems = newVersion.split('.')
  const storageVersionItems = storageVersion.split('.')
  for (let index = 0; index < 3; index++) {
    const newVersionItem = newVersionItems[index]
    const storageVersionItem = storageVersionItems[index]
    if (newVersionItem !== storageVersionItem && index !== 2 && Number(newVersionItem) >= Number(storageVersionItem)) {
      return true
    }
  }

  return false
}

const FeatureModal: React.FC = () => {
  const shouldShowModal = (features.length || bugfixes.length) && isBigRelease(version)

  const [visible, setVisible] = React.useState(shouldShowModal)

  const handleConfirm = () => {
    setVisible(false)
    localStorage.setItem(RELEASE_VERSION_KEY, version)
  }
  return (
    <Modal
      visible={visible}
      centered={true}
      getContainer={() => document.body}
      closable={false}
      footer={null}
      bodyStyle={{ padding: 0 }}
      width={480}
    >
      <Wrapper>
        <Top>
          <img src={newVersionSvg} width='100%' />
        </Top>
        <Content>
          <h3>We have a fresh new version</h3>
          <FeaturesWrapper>
            <Space direction='vertical' style={{ width: '100%' }}>
              {features.map(feature => {
                return (
                  <div key={feature}>
                    <FeatureTagWrapper>Feature</FeatureTagWrapper> {feature}
                  </div>
                )
              })}
            </Space>
            <Space direction='vertical' style={{ marginTop: '24px', width: '100%' }}>
              {bugfixes.map(bug => {
                return (
                  <div key={bug}>
                    <BugFixesTagWrapper>Bug Fixes</BugFixesTagWrapper> {bug}
                  </div>
                )
              })}
            </Space>
          </FeaturesWrapper>
          <Button style={{ padding: '0 40px', marginTop: '25px' }} type='primary' onClick={handleConfirm}>
            Confirm
          </Button>
        </Content>
      </Wrapper>
    </Modal>
  )
}

export default FeatureModal
