import React from 'react'
import {
  StyledRoot,
  StyledTitleCol,
  StyledStatusDiv,
  StyledSpan,
  StyledProgress,
} from 'components/Common/StatusBar/style'
import { Row, Col } from 'infrad'

export interface IStatus {
  statusName: string
  account: number
  unit: string
}

interface IStatusBarProps {
  title: string
  status?: IStatus[]
}
const STATUS_COLORS = ['#ff4d4f', '#d9f7be']
const StatusBar = (props: IStatusBarProps) => {
  const { title, status = [] } = props
  const [total, setTotal] = React.useState(0)

  const setTotalAccount = React.useCallback(() => {
    const total = status.reduce((result, item) => result + item.account, 0)
    setTotal(total)
  }, [status])

  React.useEffect(() => {
    setTotalAccount()
  }, [setTotalAccount])

  return (
    <StyledRoot>
      <Row justify="space-between">
        <StyledTitleCol span={6}>{title}</StyledTitleCol>
        <Col span={16}>
          <Row justify="end">
            {status.map((item, index) => (
              <StyledStatusDiv key={item.statusName} color={STATUS_COLORS[index]}>
                <StyledSpan fontSize={14}>{item.statusName}</StyledSpan>
                <StyledSpan fontSize={20}>{item.account}</StyledSpan>
                <StyledSpan>{item.unit}</StyledSpan>
              </StyledStatusDiv>
            ))}
            <StyledStatusDiv>
              <StyledSpan fontSize={14}>Total</StyledSpan>
              <StyledSpan fontSize={20}>{total}</StyledSpan>
              <StyledSpan>{status[0]?.unit}</StyledSpan>
            </StyledStatusDiv>
          </Row>
        </Col>
      </Row>
      <Row>
        <StyledProgress
          showInfo={false}
          strokeLinecap="square"
          percent={((status[0]?.account || 0) * 100) / total}
        />
      </Row>
    </StyledRoot>
  )
}

export default StatusBar
