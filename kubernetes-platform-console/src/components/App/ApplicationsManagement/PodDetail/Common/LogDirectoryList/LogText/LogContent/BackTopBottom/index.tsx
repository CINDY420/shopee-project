import * as React from 'react'

import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from 'infra-design-icons'

import { Root, IconToTop } from './style'

interface IBackTopBottompProps {
  topEle?: React.ReactNode
  bottomEle?: React.ReactNode
  scrollTarget?: HTMLElement
  scrollOptions?: any
  showToTopIcon?: boolean
  showToBottomIcon?: boolean
  onScrollTopClick?: () => void
  onScrollBottomClick?: () => void
}

const defaultScrollOptions = {
  behavior: 'auto'
}

const BackTopBottom: React.FC<IBackTopBottompProps> = props => {
  const {
    topEle,
    scrollTarget,
    bottomEle,
    scrollOptions,
    showToTopIcon,
    showToBottomIcon,
    onScrollTopClick,
    onScrollBottomClick
  } = props

  const scrollIntoView = (ele: any) => {
    if (ele) {
      ele.scrollIntoView(scrollOptions || defaultScrollOptions)
    }
  }

  const scrollToTop = () => {
    if (onScrollTopClick) {
      onScrollTopClick()
      return
    }

    if (scrollTarget) {
      scrollTarget.scrollTo(0, 0)
    }

    if (topEle) {
      scrollIntoView(topEle)
    }
  }

  const scrollToBottom = () => {
    if (onScrollBottomClick) {
      onScrollBottomClick()
      return
    }

    scrollIntoView(bottomEle)
  }

  return (
    <Root>
      {showToTopIcon && (
        <IconToTop onClick={scrollToTop}>
          <VerticalAlignTopOutlined />
        </IconToTop>
      )}
      {showToBottomIcon && (
        <IconToTop onClick={scrollToBottom}>
          <VerticalAlignBottomOutlined />
        </IconToTop>
      )}
    </Root>
  )
}

export default BackTopBottom
