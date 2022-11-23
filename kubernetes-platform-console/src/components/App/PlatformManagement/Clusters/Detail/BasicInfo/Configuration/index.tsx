import React from 'react'
import Section from '../Common/Section'
import LabelItem from '../Common/LabelItem'

import { selectedCluster } from 'states/clusterState'
import { useRecoilValue } from 'recoil'

const Configuration: React.FC = () => {
  const cluster = useRecoilValue(selectedCluster)
  const { envs = [], cids = [], tenants = [] } = cluster || {}

  const body = (
    <>
      <LabelItem label='Environment' item={envs?.join(', ')} />
      <LabelItem label='CID' item={cids?.join(', ')} />
      <LabelItem label='Tenant' item={tenants?.join(', ')} />
    </>
  )
  return <Section title='Configuration' body={body} />
}

export default Configuration
