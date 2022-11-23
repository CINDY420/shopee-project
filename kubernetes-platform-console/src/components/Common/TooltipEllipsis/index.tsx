import React, { useState, useCallback } from 'react'
import { Tooltip } from 'infrad'
import { TooltipPropsWithTitle } from 'infrad/lib/tooltip'
import { Container } from 'components/Common/TooltipEllipsis/style'

interface ITooltipEllipsisProps extends TooltipPropsWithTitle {
  title: string
  containerStyle?: React.CSSProperties
  maxWidth?: string
  largeScreenMaxWidth?: string
}

const TooltipEllipsis: React.FC<ITooltipEllipsisProps> = props => {
  const {
    containerStyle,
    autoAdjustOverflow = false,
    getPopupContainer = () => document.body,
    overlayInnerStyle = { padding: '6px 8px' },
    title,
    maxWidth,
    largeScreenMaxWidth,
    ...tooltipProps
  } = props
  const [parentHeight, setParentHeight] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(false)

  const parentDom = useCallback(node => {
    if (node !== null) {
      const height = node.getBoundingClientRect().height
      setParentHeight(height)
    }
  }, [])

  const childDom = useCallback(
    node => {
      if (node !== null && parentHeight) {
        const height = node.getBoundingClientRect().height

        if (height > parentHeight) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }
    },
    [parentHeight]
  )

  return (
    <Container ref={parentDom} style={containerStyle} maxWidth={maxWidth} largeScreenMaxWidth={largeScreenMaxWidth}>
      {visible ? (
        <Tooltip
          {...tooltipProps}
          title={title}
          autoAdjustOverflow={autoAdjustOverflow}
          getPopupContainer={getPopupContainer}
          overlayInnerStyle={overlayInnerStyle}
        >
          <span>{title}</span>
        </Tooltip>
      ) : (
        <span ref={childDom}>{title}</span>
      )}
    </Container>
  )
}

export default TooltipEllipsis
