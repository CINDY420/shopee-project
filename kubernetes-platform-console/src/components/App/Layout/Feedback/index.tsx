import React from 'react'
import { Popover } from 'infrad'
import { FixedBlock, StyledFeedbackIcon, StyledLink } from 'components/App/Layout/Feedback/style'

const FEEDBACK_PLATFORM_TEST_URL = 'https://space.test.shopee.io/infra/feedback/product'
const FEEDBACK_PLATFORM_LIVE_URL = 'https://space.shopee.io/infra/feedback/product'

const Feedback: React.FC = () => {
  const isLive = __SERVER_ENV__ === 'live'
  return (
    <FixedBlock>
      <Popover
        placement='left'
        trigger='hover'
        content={
          <StyledLink
            href={isLive ? FEEDBACK_PLATFORM_LIVE_URL : FEEDBACK_PLATFORM_TEST_URL}
            target='_blank'
            rel='noreferrer'
          >
            Go to Feedback Portal
          </StyledLink>
        }
        getPopupContainer={() => document.body}
      >
        <StyledFeedbackIcon />
      </Popover>
    </FixedBlock>
  )
}

export default Feedback
