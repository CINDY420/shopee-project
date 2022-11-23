import React, { useState } from 'react'

interface IExtendSubMenu {
  visible: boolean
  component: React.ReactNode
  top?: number
  left?: number
}

const ExtendSubMenu: React.FC<IExtendSubMenu> = ({ visible, top, left, component }) => {
  const [visibility, setVisibility] = useState(false)
  return (
    <div
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: 1000,
        padding: '4px 0px 10px 4px',
        visibility: visible || visibility ? 'visible' : 'hidden'
      }}
    >
      <div style={{ boxShadow: '0 0 16px rgba(0, 0, 0, 0.1)' }}>{component}</div>
    </div>
  )
}

export default ExtendSubMenu
