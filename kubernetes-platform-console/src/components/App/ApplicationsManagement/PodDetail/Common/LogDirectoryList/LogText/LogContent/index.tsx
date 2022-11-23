/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Spin } from 'infrad'

import BackTopBottom from './BackTopBottom'
import ErrorTryAgain from 'components/Common/ErrorTryAgain'

import { Root, ContentRoot, Content, DummyDiv, StyledEmpty as Empty } from './style'

interface ILogsContentProps {
  tryAgain: () => void
  logs: string
  keyWord: string
  isLogFinished: boolean
  isError: boolean
}

const { useState, useEffect, useRef } = React

const scrollOptions = {
  behavior: 'auto'
}

const MIN_SCROLL_HEIGHT = 400
const scrollIntoView = (ele: any) => ele.scrollIntoView(scrollOptions)

const LogsContent: React.FC<ILogsContentProps> = props => {
  const { tryAgain, logs, isLogFinished, isError, keyWord } = props

  const [isBottom, setIsBottom] = useState(true)
  const [showToTopIcon, setShowToTopIcon] = useState(false)
  const [scrollTarget, setScrollTarget] = useState()

  const dummyBottomRef: any = useRef()

  const hasReachedBottom = () => {
    if (dummyBottomRef.current) {
      return dummyBottomRef.current.getBoundingClientRect().bottom <= window.innerHeight
    }

    return false
  }

  const handleWindowScroll = (event: any) => {
    window.requestAnimationFrame(() => {
      const isBottom = hasReachedBottom()
      setIsBottom(isBottom)
      setShowToTopIcon(event.target.scrollTop > MIN_SCROLL_HEIGHT)
      setScrollTarget(event.target)
    })
  }

  const scrollToBottom = (shouldScroll?: boolean) => {
    if (dummyBottomRef.current && shouldScroll) {
      scrollIntoView(dummyBottomRef.current)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll, true)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  useEffect(() => scrollToBottom(isBottom), [logs])

  const renderError = () =>
    isError && (
      <ErrorTryAgain
        tryAgain={() => {
          tryAgain()
          scrollToBottom(true)
        }}
      />
    )

  const heightLight = (target, options): any[] => {
    let result = [target]
    const { background, keyWord } = options

    if (keyWord) {
      const reg = new RegExp(keyWord, 'g')
      const list = target.split(reg)
      const length = list.length

      if (length > 1) {
        result = []

        list.forEach((item: string, index: number) => {
          result.push(item)

          if (index < length - 1) {
            result.push(<span style={{ background }}>{keyWord}</span>)
          }
        })
      }
    }

    return result
  }

  const renderContent = () => {
    // if (isError && !logs) {
    //   return null
    // }

    return (
      <ContentRoot>
        <Content>{heightLight(logs, { background: '#fadc0b', keyWord })}</Content>
        {!isLogFinished && !isError && <Spin size='small' />}
        <DummyDiv ref={dummyBottomRef} />
      </ContentRoot>
    )
  }

  if (!logs && isLogFinished) {
    return <Empty description='No logs yet' />
  }

  return (
    <Root>
      <BackTopBottom
        scrollTarget={scrollTarget}
        showToTopIcon={showToTopIcon}
        showToBottomIcon={!isBottom}
        onScrollBottomClick={() => scrollToBottom(true)}
      />
      {renderError()}
      {renderContent()}
    </Root>
  )
}

export default LogsContent
