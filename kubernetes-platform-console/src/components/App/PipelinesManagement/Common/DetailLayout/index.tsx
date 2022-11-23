import * as React from 'react'
import BaseDetailLayout, { IDetailLayoutProps as IBaseDetailLayoutProps } from 'components/Common/DetailLayout'

export type IDetailLayoutProps = IBaseDetailLayoutProps

const DetailLayout: React.FC<IDetailLayoutProps> = props => {
  return <BaseDetailLayout {...props} />
}

export default DetailLayout
