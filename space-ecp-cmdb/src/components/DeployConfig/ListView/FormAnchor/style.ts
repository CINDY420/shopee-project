import styled from 'styled-components'
import { Anchor, AnchorLinkProps } from 'infrad'

export const StyledAnchor = styled(Anchor)`
  background: #ffffff;
  width: 160px;
  position: absolute;
  right: 0;
  margin-top: 20px;
`

interface IStyledLink extends AnchorLinkProps {
  hasError: boolean
}

export const StyledLink = styled(Anchor.Link)`
  .ant-anchor-ink {
    left: 16px;

    &:before {
      width: 1px;
    }
  }

  .ant-anchor-link {
    padding: 7px 0 7px 24px;
  }

  .ant-anchor-link-title {
    width: 120px;
    white-space: normal;
    color: ${(props: IStyledLink) => (props.hasError ? '#FF4742' : '#333333')};
  }

  .ant-anchor-link-title-active {
    color: ${(props: IStyledLink) => (props.hasError ? '#FF4742' : '#2673DD')};
  }
`
