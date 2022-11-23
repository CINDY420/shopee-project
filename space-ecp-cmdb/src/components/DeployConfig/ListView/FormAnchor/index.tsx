import * as React from 'react'

import {
  FormType,
  FormAnchorKey,
  DeployConfigContext,
} from 'src/components/DeployConfig/useDeployConfigContext'
import { StyledAnchor, StyledLink } from 'src/components/DeployConfig/ListView/FormAnchor/style'

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

  const handleClick = (e: React.MouseEvent<HTMLElement>, link: { href: string }) => {
    e.preventDefault()
    /*
     * When Root in /DeployConfig/style.ts has a height of percentage, and outer container is scrolling as well,
     * you need to handle scrollIntoView by hand.
     * On the other hand, you can also set a fixed height for Root to remove this chunk
     */
    if (link.href) {
      const element = document.getElementById(link.href.slice(1))
      element.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }

  return (
    <StyledAnchor
      getContainer={() => containerNode || document.body}
      onClick={handleClick}
      targetOffset={targetOffset}
    >
      {Object.entries(FormType).map(([key, value]) => {
        const hasError = errors[value]
        return (
          deployConfigForms?.[value] && (
            <StyledLink
              key={key}
              href={`#${FormAnchorKey[value]}`}
              hasError={hasError}
              title={value}
            />
          )
        )
      })}
    </StyledAnchor>
  )
}

export default FormAnchor
