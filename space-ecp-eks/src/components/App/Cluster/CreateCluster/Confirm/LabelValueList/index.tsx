import React, { ReactElement } from 'react'
import { Row, Col } from 'infrad'
import {
  Root,
  LabelWrapper,
  ValueWrapper,
} from 'src/components/App/Cluster/CreateCluster/Confirm/LabelValueList/style'
import { CSSProperties } from 'styled-components'

export interface IItem {
  label: string
  value: ReactElement | string | number | boolean
  hidden?: boolean
}

interface ILabelValueListProps {
  items: IItem[]
  style?: CSSProperties
}

const LabelValueList: React.FC<ILabelValueListProps> = ({ items, style }) => (
  <Root style={style}>
    <Row gutter={[0, 24]}>
      {items
        .filter(({ hidden }) => !hidden)
        .map(({ label, value }) => (
          <>
            <Col span={12}>
              <LabelWrapper>{label}</LabelWrapper>
            </Col>
            <Col span={12}>
              <ValueWrapper>{value}</ValueWrapper>
            </Col>
          </>
        ))}
    </Row>
  </Root>
)

export default LabelValueList
