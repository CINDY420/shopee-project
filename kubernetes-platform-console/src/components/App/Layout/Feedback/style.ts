import styled from 'styled-components'
import feedbackSvg from 'assets/feedback.svg'
import feedbackHoverSvg from 'assets/feedback-hover.svg'

export const FixedBlock = styled.div`
  position: fixed;
  bottom: 80px;
  right: 2px;
  z-index: 1000;
`

export const StyledFeedbackIcon = styled.div`
  width: 58px;
  height: 58px;
  background-image: url(${feedbackSvg});

  :hover {
    background-image: url(${feedbackHoverSvg});
  }
`

export const StyledLink = styled.a`
  color: unset;

  :hover {
    color: unset;
  }
`
