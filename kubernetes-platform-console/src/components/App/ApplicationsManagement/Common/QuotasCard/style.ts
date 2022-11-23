import styled from 'styled-components'
import { Alert, Progress as AntdProgress } from 'infrad'
import { primary, info } from 'constants/colors'

export const CardWrapper = styled.div`
  flex: 1;
`

export const CountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5em;
  height: 70px;
`

const Progress = styled(AntdProgress)`
  .ant-progress-inner,
  .ant-progress-success-bg,
  .ant-progress-bg {
    border-radius: 0 !important;
    height: 15px !important;
  }
`

export const SuccessProgress = styled(Progress)`
  .ant-progress-bg {
    background-color: ${info};
  }

  .ant-progress-success-bg {
    background-color: ${primary};
  }
`

export const NormalProgress = styled(Progress)`
  .ant-progress-bg {
    background-color: ${primary} !important;
  }
`

export const Warning: any = styled(Alert)`
  padding-bottom: 0;
  margin-left: -20px;
  border: 0;
  background-color: transparent;

  .ant-alert-message {
    color: #faad14;
  }
`
