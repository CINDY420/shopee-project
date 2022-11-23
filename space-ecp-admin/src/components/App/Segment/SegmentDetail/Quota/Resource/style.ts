import Usage from 'src/components/Common/Usage'
import styled from 'styled-components'
import { Tooltip } from 'infrad'

export const UsagesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
`

export const StyledUsage = styled(Usage)`
  padding-right: 36px;
  border-right: 1px solid #f0f0f0;
  flex: 1;
  &:last-child {
    margin-left: 36px;
    padding-right: 0;
    border: none;
  }
`

export const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const EnvWrapper = styled.span`
  text-transform: capitalize;
`

export const StyledTooltip = styled(Tooltip)`
  margin-left: 6px;
  color: #00000073;
`
export const UsageHeaderWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
  align-items: center;
  gap: 12px;
`

export const ResourceTitleWrapper = styled.span`
  font-weight: 500;
  font-size: 22px;
  line-height: 26px;
  margin-right: 16px;
`
