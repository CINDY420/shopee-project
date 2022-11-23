/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { Root, HeaderWrapper, Description, StepTitle, TipTitle, StyledUl } from './style'

const FileTransferGuide: React.FC = () => {
  return (
    <Root>
      <HeaderWrapper>File transfer guide (lrzsz)</HeaderWrapper>
      <Description>
        In the K8S platform, it's recommended to use lrzsz in the terminal for file upload and download operations. The
        following is the corresponding usage guide:
      </Description>
      <StepTitle>1. Install the package lrzsz:</StepTitle>
      <Description>
        Ubuntu: After entering the terminal, please execute ”apt-get update” first, then execute "apt-get install lrzsz"
        to install the software package.
      </Description>
      <StepTitle>
        2. Upload and download files (you can use "cd" to switch directories and use "ls" to query all files in the
        directory)
      </StepTitle>
      <Description>
        <TipTitle>Download files:</TipTitle>
        <StyledUl>
          <li>Download single file: sz [options] filename</li>
          <li>Download multiple files: sz [options] file1 file2 file3</li>
        </StyledUl>
        <TipTitle>Upload files:</TipTitle>
        <StyledUl>
          <li>
            Use the "rz [option]" command to upload a file to the current directory. After the operation, a file
            selection window will pop up, so you can upload the target file by clicking it.
          </li>
        </StyledUl>
        <TipTitle>Common options:</TipTitle>
        <StyledUl>
          <li>-b, --binary: binary transfer</li>
          <li>-e, --escape: escape all control characters</li>
          <li>-y, --overwrite: overwrite existing files</li>
        </StyledUl>
      </Description>
    </Root>
  )
}

export default FileTransferGuide
