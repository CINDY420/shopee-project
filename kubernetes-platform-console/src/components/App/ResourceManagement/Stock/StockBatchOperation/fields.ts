import { IFrontEndStock } from 'swagger-api/v1/models'

export const STOCK_DOWNLOAD_DATA_FIELDS = [
  {
    label: 'SDU',
    value: 'metaData.sdu'
  },
  {
    label: 'Level 1 Project',
    value: 'metaData.level1'
  },
  {
    label: 'Level 2 Project',
    value: 'metaData.level2'
  },
  {
    label: 'Level 3 Project',
    value: 'metaData.level3'
  },
  {
    label: 'Version',
    value: 'metaData.version'
  },
  {
    label: 'Status',
    value: (row: IFrontEndStock) => (row?.metaData?.editStatus === 1 ? 'Edited' : 'Unedited ')
  },
  {
    label: 'Cid',
    value: 'data.basicInfo.cid'
  },
  {
    label: 'Env',
    value: 'data.basicInfo.displayEnv'
  },
  {
    label: 'AZ',
    value: 'data.basicInfo.az'
  },
  {
    label: 'Cluster',
    value: 'data.basicInfo.cluster'
  },
  {
    label: 'Segment',
    value: 'data.basicInfo.segment'
  },
  {
    value: 'data.reference.insCountPeak',
    label: 'Instance count at peak'
  },
  {
    value: 'data.reference.cpuReqOneInsPeak',
    label: 'CPU request per instance at peak'
  },
  {
    value: 'data.reference.memLimitOneInsPeak',
    label: 'Memory limit per instance at peak'
  },
  {
    value: 'data.reference.gpuCardLimitOneInsPeak',
    label: 'GPU card limit per instance at peak'
  },
  {
    value: 'data.reference.cpuLimitOneInsPeak',
    label: 'CPU limit per instance at peak'
  },
  {
    value: 'data.reference.memUsedOneInsPeak',
    label: 'Memory usage per instance at peak'
  },
  {
    value: 'data.reference.cpuAllocatedTotalPeak',
    label: 'Total CPU allocated at peak'
  },
  {
    value: 'data.reference.memAllocatedTotalPeak',
    label: 'Total memory allocated at peak'
  },
  {
    value: 'data.reference.gpuCardAllocatedTotalPeak',
    label: 'Total GPU allocated at peak'
  },
  {
    value: 'data.reference.cpuUsedOneInsPeak',
    label: 'Max CPU usage per instance at peak'
  },
  {
    value: 'data.reference.memReqOneInsPeak',
    label: 'Memory request per instance at peak'
  },
  {
    value: 'data.reference.cpuUsedTotalPeak',
    label: 'Total CPU usage at peak'
  },
  {
    value: 'data.reference.memUsedTotalPeak',
    label: 'Total Memory usage at peak'
  },
  {
    value: 'data.growthExpectation.qpsTotalPeak',
    label: 'Total QPS at peak'
  },
  {
    value: 'data.growthExpectation.qpsMaxOneIns',
    label: 'Max safe QPS for support per instance'
  },
  {
    value: 'data.growthExpectation.inUse',
    label: 'In use'
  },
  {
    value: 'data.growthExpectation.evaluationMetrics',
    label: 'Evaluation metrics'
  },
  {
    value: 'data.growthExpectation.growthRatio',
    label: 'Growth ratio'
  },
  {
    value: 'data.growthExpectation.growthRatioAnnotation',
    label: 'Justification for higher growth ratio proposed by App'
  },
  {
    value: 'data.growthExpectation.minInsCount',
    label: 'Minimum instance count'
  },
  {
    value: 'data.growthExpectation.safetyThreshold',
    label: 'Application CPU/MEM safety threshold (per instance)'
  },
  {
    value: 'data.growthExpectation.remark',
    label: 'Remark'
  },
  {
    value: 'data.growthExpectation.machineModel',
    label: 'Machine model'
  },
  {
    value: 'data.estimated.estimatedInsCountTotal',
    label: 'Estimated instance count'
  },
  {
    value: 'data.estimated.estimatedInsCountIncrement',
    label: 'Estimated instance count increment'
  },
  {
    value: 'data.estimated.estimatedCpuIncrement',
    label: 'Estimated CPU increment'
  },
  {
    value: 'data.estimated.estimatedMemIncrement',
    label: 'Estimated memory increment'
  },
  {
    value: 'data.estimated.estimatedGpuCardIncrement',
    label: 'Estimated GPU increment'
  }
]
