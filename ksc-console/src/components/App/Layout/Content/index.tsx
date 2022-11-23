import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { CenterWrapper } from './style'
import { Spin } from 'infrad'
import { CommonStyledContent } from 'common-styles/layout'

const Content: React.FC = () => {
  const { Suspense } = React

  return (
    <Suspense
      fallback={
        <CenterWrapper>
          <Spin />
        </CenterWrapper>
      }
    >
      <CommonStyledContent>
        <Outlet />
      </CommonStyledContent>
    </Suspense>
  )
}
export default Content
