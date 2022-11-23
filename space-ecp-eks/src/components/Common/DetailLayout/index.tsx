import React from 'react'
import { Root, Header } from 'src/components/Common/DetailLayout/style'
import { Button, Descriptions } from 'infrad'
import { ButtonProps } from 'infrad/lib/button'
import TabsDetail, { ITabsDetailProps } from 'src/components/Common/DetailLayout/Tabs'
import { StyledPageHeader } from 'src/common-styles/layout'
import { PageHeaderProps } from 'infrad/lib/page-header'
import ReactResizeDetector from 'react-resize-detector'

interface IDetailLayoutButtonProps extends ButtonProps {
  icon?: React.ReactNode
  text: string
  visible?: boolean
  loading?: boolean
  click: () => void
}

interface IDescriptionItem {
  label: string
  text: React.ReactNode
}

interface IDetailLayoutProps extends ITabsDetailProps, PageHeaderProps {
  backRoute?: string
  state?: string
  title: React.ReactNode
  buttons?: IDetailLayoutButtonProps[]
  descriptionItems?: IDescriptionItem[]
  body?: React.ReactElement
}

const DetailLayout: React.FC<IDetailLayoutProps> = (props) => {
  const { title, buttons, tabs, defaultActiveKey, descriptionItems, body, breadcrumb } = props
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
  }, [])

  return (
    <Root>
      <ReactResizeDetector handleWidth onResize={handleHeaderResize}>
        <Header ref={headerRef} hasTabs={!!tabs}>
          <StyledPageHeader
            style={{ paddingBottom: '0px' }}
            title={title}
            extra={buttons?.map((button) => {
              const { click, icon, text, disabled, visible = true, loading, type } = button
              return (
                visible && (
                  <Button
                    key={text}
                    disabled={disabled}
                    onClick={click}
                    loading={loading}
                    type={type}
                  >
                    {icon} {text}
                  </Button>
                )
              )
            })}
            breadcrumb={breadcrumb}
          >
            {descriptionItems && (
              <div>
                <Descriptions>
                  {descriptionItems.map(({ label, text }) => (
                    <Descriptions.Item key={label} label={label}>
                      {text}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            )}
          </StyledPageHeader>
          {tabs && <TabsDetail tabs={tabs} defaultActiveKey={defaultActiveKey} top={top} />}
        </Header>
      </ReactResizeDetector>
      {body}
    </Root>
  )
}

export default DetailLayout
