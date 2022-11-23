import React from 'react'

import { Button, Popover } from 'infrad'
import { FileSearchOutlined } from 'infra-design-icons'

import FileTransferGuide from './FileTransferGuide'

const FILE_TRANSFER_GUIDE_KEY = 'has_view_file_transfer_guide'
const FILE_TRANSFER_GUIDE_VALUE = 'yes'

const setFileTransferGuideViewed = () => localStorage.setItem(FILE_TRANSFER_GUIDE_KEY, FILE_TRANSFER_GUIDE_VALUE)

const FileTransferGuidePopover: React.FC = () => {
  const hasViewFileTransferGuide = localStorage.getItem(FILE_TRANSFER_GUIDE_KEY) === FILE_TRANSFER_GUIDE_VALUE
  return (
    <Popover
      content={<FileTransferGuide />}
      trigger='click'
      defaultVisible={!hasViewFileTransferGuide}
      onVisibleChange={() => !hasViewFileTransferGuide && setFileTransferGuideViewed()}
    >
      <Button icon={<FileSearchOutlined />} type='link'>
        File Transfer Guide
      </Button>
    </Popover>
  )
}

export default FileTransferGuidePopover
