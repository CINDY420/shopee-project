import * as React from 'react'
import BaseDetailLayout, { IDetailLayoutProps as IBaseDetailLayoutProps } from 'components/Common/DetailLayout'
import Breadcrumbs from '../Breadcrumbs'

export type IDetailLayoutProps = IBaseDetailLayoutProps

const DetailLayout: React.FC<IDetailLayoutProps> = props => {
  return <BaseDetailLayout breadcrumbs={<Breadcrumbs />} {...props} />
}

export default DetailLayout
