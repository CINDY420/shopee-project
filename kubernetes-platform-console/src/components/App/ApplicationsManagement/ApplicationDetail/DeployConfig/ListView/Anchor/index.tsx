import * as React from 'react'

import {
  FORM_TYPE,
  FORM_ANCHOR_KEY,
  DeployConfigContext
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import {
  StyledAnchor,
  StyledLink
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Anchor/style'

interface IFormAnchorProps {
  containerNode: HTMLElement
}

const FormAnchor: React.FC<IFormAnchorProps> = ({ containerNode }) => {
  const { state } = React.useContext(DeployConfigContext)
  const { errors, deployConfigForms } = state

  const [targetOffset, setTargetOffset] = React.useState<number | undefined>(undefined)

  React.useEffect(() => {
    setTargetOffset(window.innerHeight / 2 - 100)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
  }

  return (
    <StyledAnchor getContainer={() => containerNode || document.body} onClick={handleClick} targetOffset={targetOffset}>
      {Object.entries(FORM_TYPE).map(([key, value]) => {
        const hasError = errors[value]
        return (
          deployConfigForms?.[value] && (
            <StyledLink key={key} href={`#${FORM_ANCHOR_KEY[value]}`} hasError={hasError} title={value} />
          )
        )
      })}
    </StyledAnchor>
  )
}

export default FormAnchor
