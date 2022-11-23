import Resource from 'src/components/App/Segment/SegmentDetail/Quota/Resource'
import QuotaTable from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable'
import { ENV } from 'src/constants/quota'
import { useRequest } from 'ahooks'
import {
  quotaController_getSegmentQuota,
  quotaController_listTenantsQuotableEnvs,
} from 'src/swagger-api/apis/SegmentQuota'
import { SegmentDetailContext } from 'src/components/App/Segment/SegmentDetail/context'
import { useContext } from 'react'
import { Spin } from 'infrad'
import { IGetSegmentQuotaResponse } from 'src/swagger-api/models'

const Quota: React.FC = () => {
  const segmentDetailContext = useContext(SegmentDetailContext)
  const { azKey, segmentKey } = segmentDetailContext
  const {
    data: liveSegmentQuota,
    refresh: liveQuotaRefresh,
    loading: liveLoading,
  } = useRequest(() => quotaController_getSegmentQuota({ azKey, segmentKey, env: ENV.LIVE }))
  const {
    data: liveishSegmentQuota,
    refresh: liveishQuotaRefresh,
    loading: liveishLoading,
  } = useRequest(() => quotaController_getSegmentQuota({ azKey, segmentKey, env: ENV.LIVEISH }))
  const {
    data: testSegmentQuota,
    refresh: testQuotaRefresh,
    loading: testLoading,
  } = useRequest(() => quotaController_getSegmentQuota({ azKey, segmentKey, env: ENV.TEST }))
  const {
    data: uatSegmentQuota,
    refresh: uatQuotaRefresh,
    loading: uatLoading,
  } = useRequest(() => quotaController_getSegmentQuota({ azKey, segmentKey, env: ENV.UAT }))
  const {
    data: stagingSegmentQuota,
    refresh: stagingQuotaRefresh,
    loading: stagingLoading,
  } = useRequest(() => quotaController_getSegmentQuota({ azKey, segmentKey, env: ENV.STAGING }))
  const {
    data: stableSegmentQuota,
    refresh: stableQuotaRefresh,
    loading: stableLoading,
  } = useRequest(() => quotaController_getSegmentQuota({ azKey, segmentKey, env: ENV.STABLE }))

  const segmentQuotaList = [
    liveSegmentQuota,
    liveishSegmentQuota,
    testSegmentQuota,
    uatSegmentQuota,
    stagingSegmentQuota,
    stableSegmentQuota,
  ].filter((item): item is IGetSegmentQuotaResponse => !!item)

  const envRefreshSegmentQuotaMap = {
    [ENV.LIVE]: liveQuotaRefresh,
    [ENV.LIVEISH]: liveishQuotaRefresh,
    [ENV.TEST]: testQuotaRefresh,
    [ENV.UAT]: uatQuotaRefresh,
    [ENV.STAGING]: stagingQuotaRefresh,
    [ENV.STABLE]: stableQuotaRefresh,
  }
  const refreshSegmentQuotaList = (env?: ENV) => {
    if (env) {
      const refresh = envRefreshSegmentQuotaMap[env]
      refresh && refresh()
    } else {
      Object.values(envRefreshSegmentQuotaMap).map((refresh) => refresh())
    }
  }
  const listSegmentQuotaLoading =
    liveLoading || liveishLoading || testLoading || uatLoading || stagingLoading || stableLoading

  const { data: quotableEnvsRes, loading: quotableEnvsLoading } = useRequest(() =>
    quotaController_listTenantsQuotableEnvs({ azKey, segmentKey }),
  )

  return (
    <>
      <Resource
        style={{ marginBottom: '16px' }}
        listSegmentQuota={segmentQuotaList}
        refreshEnvTotalQuotaList={refreshSegmentQuotaList}
        loading={listSegmentQuotaLoading}
      />
      {quotableEnvsLoading ? (
        <Spin />
      ) : (
        <QuotaTable
          initialEnvTotalQuotaList={segmentQuotaList}
          refreshEnvTotalQuotaList={refreshSegmentQuotaList}
          defaultSelectedEnvs={quotableEnvsRes?.quotableEnvs}
        />
      )}
    </>
  )
}

export default Quota
