import React from 'react'
import {
  Root,
  Header,
  ResourceWrapper,
  HeaderBody,
  TitleText,
  TagsWrapper,
  StyledTag,
} from 'src/components/Common/DetailLayout/style'
import { ArrowLeftOutlined } from 'infra-design-icons'
import { Typography, Button, Space } from 'infrad'
import { useHistory } from 'react-router-dom'
import DetailTabs from 'src/components/Common/DetailLayout/DetailTabs'
import { HorizontalDivider } from 'src/common-styles/divider'
import ReactResizeDetector from 'react-resize-detector'

const { Text } = Typography

interface ITab {
  name: string
  Component: React.ComponentType
  props: { [name: string]: any }
}

interface IDetailLayoutButtonProps {
  icon: React.ReactNode
  text: string
  disabled?: boolean
  visible?: boolean
  loading?: boolean
  click: () => void
}

interface IDetailLayoutProps {
  resourceType?: string
  resource?: string
  superiorRoute: string
  title: React.ReactNode
  tags?: string[]
  buttons?: IDetailLayoutButtonProps[]
  ExtraButton?: React.ReactNode
  tabs?: ITab[]
  body?: React.ReactElement
  defaultActiveTabKey?: string
  tabBarExtraContent?: React.ReactNode
}

const DetailLayout: React.FC<IDetailLayoutProps> = (props) => {
  const {
    resourceType,
    resource,
    superiorRoute,
    title,
    tags,
    buttons,
    ExtraButton,
    tabs,
    body,
    defaultActiveTabKey,
    tabBarExtraContent,
  } = props
  const history = useHistory()

  const headerRef = React.useRef<HTMLDivElement>()
  const headerHeight = (headerRef.current && headerRef.current.offsetHeight) || 0

  const [top, setTop] = React.useState(headerHeight)

  const handleHeaderResize = React.useCallback(() => {
    const currentHeight = (headerRef.current && headerRef.current.offsetHeight) || 0
    if (currentHeight !== top) {
      setTop(currentHeight)
    }
  }, [top])

  React.useEffect(() => {
    handleHeaderResize()
  }, [handleHeaderResize])

  return (
    <Root>
      <ReactResizeDetector handleWidth onResize={handleHeaderResize}>
        <Header ref={headerRef}>
          {resource && (
            <ResourceWrapper>
              <Text>{`${resourceType}:`}</Text>
              <Text type="secondary" style={{ marginLeft: '8px' }}>
                {resource}
              </Text>
            </ResourceWrapper>
          )}
          <HeaderBody>
            <Button
              size="large"
              shape="circle"
              icon={<ArrowLeftOutlined style={{ color: '#2673DD' }} />}
              onClick={() => history.push(superiorRoute)}
            />
            <TitleText>{title}</TitleText>
            <TagsWrapper>
              {tags.map((tag) => (
                <StyledTag key={tag}>{tag}</StyledTag>
              ))}
            </TagsWrapper>
            <Space size="middle">
              {buttons ? (
                <Space size="middle">
                  {buttons.map((button) => {
                    const { click, icon, text, disabled, visible = true, loading } = button
                    return (
                      visible && (
                        <Button
                          type="link"
                          key={text}
                          disabled={disabled}
                          onClick={click}
                          loading={loading}
                          style={{ padding: '4px 0' }}
                        >
                          {icon} {text}
                        </Button>
                      )
                    )
                  })}
                </Space>
              ) : null}
              {ExtraButton && ExtraButton}
            </Space>
          </HeaderBody>
          {tabs ? (
            <DetailTabs
              top={`${top}px`}
              tabs={tabs}
              defaultActiveKey={defaultActiveTabKey}
              tabBarExtraContent={tabBarExtraContent}
            />
          ) : (
            <HorizontalDivider size="24px" />
          )}
        </Header>
      </ReactResizeDetector>
      {body}
    </Root>
  )
}

export default DetailLayout
