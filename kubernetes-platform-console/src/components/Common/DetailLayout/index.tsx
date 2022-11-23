import * as React from 'react'
import { Popover } from 'infrad'
import ReactResizeDetector from 'react-resize-detector'

import { Root, Header, State, Title, TagsWrapper, Tag, ButtonsWrapper, StyledButton, HeaderBody } from './style'
import DetailTabs, { IDetailTabsProps } from './Tabs'
import { HorizontalDivider } from 'common-styles/divider'

interface IDetailLayoutButtonProps {
  icon: any
  text: string
  disabled?: boolean
  visible?: boolean
  loading?: boolean
  click: () => void
}

export interface IDetailLayoutProps extends IDetailTabsProps {
  /** The title of detail page, including item type and item name. */
  title: React.ReactNode
  /** Default active tab key */
  defaultActiveKey?: string
  /** The state of item (only for pod detail) */
  state?: string
  /** The tags of item */
  tags: string[]
  /** Functional buttons in detail page header */
  buttons?: IDetailLayoutButtonProps[]
  ExtraButton?: any
  CustomButton?: any
  extraDetail?: any
  headerExtraMessage?: any
  /** Detail page body content(detail page without tab) */
  body?: any
  /** Breadcrumbs over detail page header */
  breadcrumbs?: React.ReactNode
  /** Content of tab(tab detail page body) */
  tabBarExtraContent?: React.ReactNode
  isHeaderWithBottomLine?: boolean
  headerBodyStyle?: React.CSSProperties
  announcement?: React.ReactNode
}

const DetailLayout: React.FC<IDetailLayoutProps> = props => {
  const {
    title,
    state,
    tags,
    buttons,
    ExtraButton,
    CustomButton,
    extraDetail,
    headerExtraMessage,
    body,
    breadcrumbs,
    tabs,
    defaultActiveKey,
    tabBarExtraContent,
    isHeaderWithBottomLine = true,
    headerBodyStyle = { marginTop: 24 },
    announcement
  } = props
  const headerRef = React.useRef<HTMLDivElement>()
  const headerHeight = (headerRef.current && headerRef.current.offsetHeight) || 0
  const [top, setTop] = React.useState(headerHeight)

  const handleHeaderResize = () => {
    const currentHeight = (headerRef.current && headerRef.current.offsetHeight) || 0
    if (currentHeight !== top) {
      setTop(currentHeight)
    }
  }

  React.useEffect(() => {
    handleHeaderResize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags])

  return (
    <Root>
      <ReactResizeDetector handleWidth onResize={handleHeaderResize}>
        <Header ref={headerRef} isHeaderWithBottomLine={isHeaderWithBottomLine}>
          {announcement}
          {breadcrumbs}
          <HeaderBody style={breadcrumbs ? {} : headerBodyStyle}>
            {state ? <State title={state}>[{state}]</State> : null}
            <Title title={title}>{title}</Title>
            <TagsWrapper>
              {tags.map((tag, i) => {
                if (tag.length >= 45) {
                  return (
                    <Popover placement='bottom' content={tag} key={i}>
                      <Tag>{tag}</Tag>
                    </Popover>
                  )
                } else return <Tag key={i}>{tag}</Tag>
              })}
            </TagsWrapper>
            {extraDetail}
            {CustomButton && <CustomButton />}
            {buttons ? (
              <ButtonsWrapper>
                {buttons.map((button, i) => {
                  const { click, icon, text, disabled, visible = true, loading } = button
                  return (
                    visible && (
                      <StyledButton key={i} disabled={disabled} onClick={click} loading={loading}>
                        {icon} {text}
                      </StyledButton>
                    )
                  )
                })}
              </ButtonsWrapper>
            ) : null}
            {ExtraButton && <ExtraButton />}
          </HeaderBody>
          {headerExtraMessage}
          {tabs ? (
            <DetailTabs
              top={`${top}px`}
              tabs={tabs}
              defaultActiveKey={defaultActiveKey}
              tabBarExtraContent={tabBarExtraContent}
            />
          ) : (
            <HorizontalDivider size='24px' />
          )}
        </Header>
      </ReactResizeDetector>
      <>{body}</>
    </Root>
  )
}

export default DetailLayout
