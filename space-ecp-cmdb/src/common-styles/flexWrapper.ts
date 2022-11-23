import styled from 'styled-components'

export const HorizonCenterWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const HorizonBaselineWrapper = styled.div`
  display: flex;
  align-items: baseline;
`

export const CenterWrapper: any = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const RowWrapper: any = styled(CenterWrapper)`
  justify-content: space-between;
  padding: ${(props: any) => props.padding || '3em 2em 4em'};
  align-items: ${(props: any) => props.alignItems};
`

export const FlexWrapper: any = styled.div`
  display: flex;
  justify-content: ${(props: any) => props.justifyContent || 'center'};
  align-items: ${(props: any) => props.alignItems || 'center'};
  flex-wrap: ${(props: any) => props.flexWrap || 'no-wrap'};
  margin: ${(props: any) => props.margin || '0'};
`
