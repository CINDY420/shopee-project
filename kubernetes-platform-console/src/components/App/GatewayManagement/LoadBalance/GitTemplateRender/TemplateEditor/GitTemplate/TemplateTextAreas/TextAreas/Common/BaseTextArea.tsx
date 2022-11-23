import * as React from 'react'
import { Row, Col, Spin } from 'infrad'

import { Wrapper, Title, StyledTextArea } from '../style'

interface IProps {
  loading: boolean
  title: string
  value: string
  button: React.ReactNode
  onChange?: (value: string) => void
}

const BaseTextArea: React.FC<IProps> = ({ loading, title, value, button, onChange }) => {
  const handleChange = React.useCallback(
    e => {
      const newValue = e.target.value
      onChange && onChange(newValue)
    },
    [onChange]
  )

  return (
    <Spin spinning={loading}>
      <Wrapper>
        <Title>{title}</Title>
        <StyledTextArea rows={18} value={value} onChange={handleChange} spellCheck={false} />
        <Row style={{ marginTop: '16px' }} justify='end'>
          <Col>{button}</Col>
        </Row>
      </Wrapper>
    </Spin>
  )
}

export default BaseTextArea
