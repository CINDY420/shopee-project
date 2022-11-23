import * as React from 'react'
import {
  StyledRoot,
  StyledHeader,
  StyledHeaderBody,
  StyledTitle,
  StyledTagsWrapper,
  StyledTag,
  StyledButtonsWrapper,
  StyledButton,
} from 'components/Common/DetailLayout/style'
import { HorizontalDivider } from 'common-styles/divider'
import { Tooltip } from 'infrad'

interface IDetailLayoutButtonProps {
  icon: React.ReactNode
  text: string
  disabled?: boolean
  visible?: boolean
  loading?: boolean
  tooltip?: string
  onClick: () => void
}

export interface IDetailLayoutProps {
  title: React.ReactNode
  resource?: React.ReactNode
  tags?: string[]
  buttons?: IDetailLayoutButtonProps[]
  breadcrumbs?: React.ReactNode
  body?: React.ReactNode
  isHeaderWithBottomLine: boolean
  isHeaderWithBreadcrumbs: boolean
}

const DetailLayout: React.FC<IDetailLayoutProps> = (props) => {
  const {
    title,
    resource,
    tags,
    buttons,
    breadcrumbs,
    body,
    isHeaderWithBottomLine,
    isHeaderWithBreadcrumbs,
  } = props

  return (
    <StyledRoot>
      <StyledHeader
        isHeaderWithBottomLine={isHeaderWithBottomLine}
        isHeaderWithBreadcrumbs={isHeaderWithBreadcrumbs}
      >
        {breadcrumbs}
        <StyledHeaderBody>
          <StyledTitle>{title}</StyledTitle>
          <HorizontalDivider size="4px" />
          <StyledTitle style={{ color: '#6FC9CA' }}>{resource}</StyledTitle>
          <StyledTagsWrapper>
            {tags?.map((tag) => (
              <StyledTag key={tag}>{tag}</StyledTag>
            ))}
          </StyledTagsWrapper>
          <StyledButtonsWrapper>
            {buttons?.map((button) => {
              const { icon, text, onClick, disabled, tooltip } = button
              return (
                <Tooltip key={text} placement="top" title={tooltip}>
                  <StyledButton onClick={onClick} disabled={disabled}>
                    {icon} {text}
                  </StyledButton>
                </Tooltip>
              )
            })}
          </StyledButtonsWrapper>
        </StyledHeaderBody>
      </StyledHeader>
      <>{body}</>
    </StyledRoot>
  )
}

export default DetailLayout
