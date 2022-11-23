import styled from 'styled-components'
import { Card as AntCard } from 'infrad'

export const Card: any = styled(AntCard)`
  width: 100%;
  background-color: ${(props: any) => props.bgColor || '#ffffff'};
  box-shadow: ${(props: any) => props.boxShadow || '0 1px 4px 0 rgba(74,74,78,0.16)'};
  border: ${(props: any) => props.border || 'none'};
  height: ${(props: any) => props.height};
  overflow: ${(props: any) => props.overflow || 'auto'};

  & > .ant-card-body {
    padding: ${(props: any) => props.padding};
  }
`
