/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { Spin, Empty } from 'infrad'

import QuotasTable from 'components/Common/QuotasTable'

import { clustersControllerFindResourceQuotas, clustersControllerUpdateQuotas } from 'swagger-api/v3/apis/Cluster'
import useAsyncFn from 'hooks/useAsyncFn'

import { VerticalDivider } from 'common-styles/divider'
import { Root } from './style'

const { useEffect } = React

interface ITenantListProps {
  clusterName: string
}

const TenantList: React.FC<ITenantListProps> = ({ clusterName }) => {
  const [listQuotasState, listQuotasFn] = useAsyncFn(clustersControllerFindResourceQuotas)
  const [updateQuotasState, updateQuotasFn] = useAsyncFn(clustersControllerUpdateQuotas)

  const { loading, value } = listQuotasState
  const { groups = [] } = value || {}

  const handleSaveCallback = () => {
    listQuotasFn({ clusterName })
  }

  const handleUpdateQuotas = ({ quotasConfig }) => {
    return updateQuotasFn({ clusterName, payload: { quotasConfig } })
  }

  useEffect(() => {
    listQuotasFn({ clusterName })
  }, [])

  return (
    <Root>
      <Spin spinning={loading}>
        {groups.length ? (
          groups.map((group, idx) => (
            <div key={group.name}>
              <QuotasTable
                key={group.name}
                quotaData={group}
                onUpdateQuotas={handleUpdateQuotas}
                isUpdating={updateQuotasState.loading}
                onSaveCallback={handleSaveCallback}
                type='cluster'
              />
              {idx !== groups.length - 1 && <VerticalDivider size='16px' />}
            </div>
          ))
        ) : (
          <Empty />
        )}
      </Spin>
    </Root>
  )
}

export default TenantList
