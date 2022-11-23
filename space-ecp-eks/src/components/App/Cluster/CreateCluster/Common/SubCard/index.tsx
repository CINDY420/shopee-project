import React from 'react'
import { SubTitle } from 'src/components/App/Cluster/CreateCluster/Common/SubCard/style'
import { CSSProperties } from 'styled-components'

export interface ISubCardProps {
  title: string
  titleStyle?: CSSProperties
}

const SubCard: React.FC<ISubCardProps> = ({ title, titleStyle, children }) => (
  <div>
    <SubTitle style={titleStyle}>{title}</SubTitle>
    <div>{children}</div>
  </div>
)

export default SubCard
