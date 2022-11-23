/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { Spin, Empty } from 'infrad'

import QuotasTable from 'components/Common/QuotasTable'

import {
  projectsControllerUpdateResourceQuotas,
  projectsControllerGetResourceQuotas
} from 'swagger-api/v3/apis/Projects'

import useAsyncFn from 'hooks/useAsyncFn'

import { VerticalDivider } from 'common-styles/divider'
import { Root } from './style'

const { useEffect } = React

interface IClusterListProps {
  projectName: string
  tenantId: number
}

const ClusterList: React.FC<IClusterListProps> = ({ tenantId, projectName }) => {
  const [listQuotasState, listQuotasFn] = useAsyncFn(projectsControllerGetResourceQuotas)
  const [updateQuotasState, updateQuotasFn] = useAsyncFn(projectsControllerUpdateResourceQuotas)

  const { clusters = [] } = listQuotasState.value || {}

  const handleSaveCallback = () => {
    listQuotasFn({ tenantId, projectName })
  }

  const handleUpdateQuotas = ({ quotasConfig }) => {
    return updateQuotasFn({ tenantId, projectName, payload: { projectQuotas: quotasConfig } })
  }

  useEffect(() => {
    listQuotasFn({ tenantId, projectName })
  }, [])

  return (
    <Root>
      <Spin spinning={!clusters.length && listQuotasState.loading}>
        {clusters.length ? (
          clusters.map((cluster, idx) => (
            <div key={cluster.name}>
              <QuotasTable
                key={cluster.name}
                quotaData={cluster}
                isCluster={true}
                onUpdateQuotas={handleUpdateQuotas}
                isUpdating={updateQuotasState.loading}
                onSaveCallback={handleSaveCallback}
                hasMinimum={true}
                type='project'
              />
              {idx !== clusters.length - 1 && <VerticalDivider size='16px' />}
            </div>
          ))
        ) : (
          <Empty />
        )}
      </Spin>
    </Root>
  )
}

export default ClusterList
