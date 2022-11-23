import { DeployConfigContext } from 'src/components/DeployConfig/useDeployConfigContext'
import React, { useContext } from 'react'

const withAutoDisabled =
  <T extends { disabled?: boolean; style?: React.CSSProperties }>(
    AutoDisabledComponent: React.ComponentType<T>,
  ) =>
  (props: T) => {
    const { state } = useContext(DeployConfigContext)
    const { isEditing } = state
    return (
      <AutoDisabledComponent
        {...props}
        disabled={props.disabled || !isEditing}
        style={{ ...props.style, color: '#333333' }}
      />
    )
  }

export default withAutoDisabled
