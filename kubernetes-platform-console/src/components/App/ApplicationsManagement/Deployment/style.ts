import styled from 'styled-components'
import { Card, Button } from 'infrad'

import { primary } from 'constants/colors'
import MassUpdateSvg from 'assets/mass-update.svg'
import RollBackSvg from 'assets/rollback.svg'

export const CommonCard = styled(Card)`
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  /* padding: 24px 24px 32px; */
`

export const ScaleIcon: any = styled.span`
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-size: contain;
  margin-right: 7px;
  background-color: ${(props: any) => (props.disabled ? 'rgba(0, 0, 0, 0.25)' : primary)};
  mask-image: url(${MassUpdateSvg});
`

export const RollBackIcon = styled(ScaleIcon)`
  mask-image: url(${RollBackSvg});
`

export const StyledButton = styled(Button)`
  padding: 0;
`
