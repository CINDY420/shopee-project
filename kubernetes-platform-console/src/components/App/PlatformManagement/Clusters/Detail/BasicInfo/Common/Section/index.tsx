import React from 'react'
import { StyledSection, TitleWrapper } from './style'

interface ISection {
  title: string | React.ReactNode
  body: React.ReactNode
}

const Section: React.FC<ISection> = ({ title, body }) => {
  return (
    <StyledSection>
      <TitleWrapper>{title}</TitleWrapper>
      <div>{body}</div>
    </StyledSection>
  )
}

export default Section
