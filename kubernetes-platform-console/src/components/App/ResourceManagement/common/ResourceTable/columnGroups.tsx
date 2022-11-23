import { FormItemType, IExpandGroup } from 'components/App/ResourceManagement/common/ResourceTableExpand'
import { StyledInputNumber } from 'components/App/ResourceManagement/common/ResourceTableExpand/ExpandGroupForm/style'
import { NON_NEGATIVE_NUMBER, NON_ZERO_PERCENTAGE } from 'helpers/validate'
import { Select, Tag } from 'infrad'
import * as React from 'react'

export enum EVALUATION_METRICS_TYPE {
  CPU = 'CPU',
  MEM = 'MEM',
  QPS = 'QPS'
}
export const STOCK_GROUPS = (envs: string[], machineModels: string[], isPlatformAdmin: boolean) => {
  const STOCK_BASIC_INFO: IExpandGroup = {
    title: 'Basic Info',
    name: 'basicInfo',
    flexValue: '0 0 140px',
    items: [
      {
        name: 'cid',
        label: 'Cid'
      },
      {
        name: 'displayEnv',
        label: 'Env',
        editable: true,
        type: FormItemType.SELECT,
        options: Object.values(envs).map(env => {
          return {
            label: env,
            key: env,
            value: env
          }
        })
      },
      {
        name: 'az',
        label: 'Az'
      },
      {
        name: 'cluster',
        label: 'Cluster'
      },
      {
        name: 'segment',
        label: 'Segment'
      }
    ]
  }
  const REFERENCE: IExpandGroup = {
    title: 'Reference',
    name: 'reference',
    items: [
      {
        name: 'insCountPeak',
        label: 'Instance count at peak'
      },
      {
        name: 'cpuReqOneInsPeak',
        label: 'CPU request per instance at peak (Cores)'
      },
      {
        name: 'memLimitOneInsPeak',
        label: 'Memory limit per instance at peak (GB)'
      },
      {
        name: 'gpuCardLimitOneInsPeak',
        label: 'GPU cards limit per instance at peak',
        editable: true,
        type: FormItemType.INPUT_NUMBER,
        rules: [
          { type: 'number', min: 0, message: 'non-negative number' },
          { required: true, message: 'input a value' }
        ],
        component: ({ isItemEditing }) => <StyledInputNumber disabled={!isItemEditing} controls={false} />
      },
      {
        name: 'cpuLimitOneInsPeak',
        label: 'CPU limit per instance at peak (Cores)'
      },
      {
        name: 'memUsedOneInsPeak',
        label: 'memory usage per instance at peak (GB)'
      },
      {
        name: 'cpuAllocatedTotalPeak',
        label: 'Total CPU allocated at peak (Cores)'
      },
      {
        name: 'memAllocatedTotalPeak',
        label: 'Total memory allocated at peak (GB)'
      },
      {
        name: 'gpuCardAllocatedTotalPeak',
        label: 'Total GPU allocated at peak',
        type: FormItemType.CALCULATED
      },
      {
        name: 'cpuUsedOneInsPeak',
        label: 'Max CPU usage per instance at peak (Cores)'
      },
      {
        name: 'memReqOneInsPeak',
        label: 'memory request per instance at peak (GB)'
      },
      {
        name: 'cpuUsedTotalPeak',
        label: 'Total CPU usage at peak (Cores)'
      },
      {
        name: 'memUsedTotalPeak',
        label: 'Total Memory usage at peak (GB)'
      }
    ]
  }
  const GROWTH_EXPECTATION: IExpandGroup = {
    title: 'Growth Expectation',
    name: 'growthExpectation',
    flexValue: '0 0 90px',
    items: [
      {
        name: 'evaluationMetrics',
        label: 'Evaluation metrics',
        editable: true,
        type: FormItemType.SELECT,
        options: Object.values(EVALUATION_METRICS_TYPE).map(type => {
          return {
            label: type,
            key: type,
            value: type
          }
        }),
        rules: [{ required: true, message: 'input a value' }]
      },
      {
        name: 'qpsTotalPeak',
        label: 'Total QPS at peak',
        editable: true,
        type: FormItemType.CONDITIONAL_EVALUATION_METRICS_RENDER,
        conditions: [EVALUATION_METRICS_TYPE.QPS],
        rules: [
          { pattern: NON_NEGATIVE_NUMBER, message: 'non-negative integer' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'qpsMaxOneIns',
        label: 'Max safe QPS for support per instance',
        editable: true,
        type: FormItemType.CONDITIONAL_EVALUATION_METRICS_RENDER,
        conditions: [EVALUATION_METRICS_TYPE.QPS],
        rules: [
          { pattern: NON_NEGATIVE_NUMBER, message: 'non-negative integer' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'inUse',
        label: 'In use',
        editable: true,
        type: FormItemType.SELECT,
        tooltip: 'Default 1, please select 0 if no longer in use.',
        options: [
          {
            label: '0',
            key: '0',
            value: 0
          },
          {
            label: '1',
            key: '1',
            value: 1
          }
        ],
        rules: [{ required: true, message: 'input a value' }]
      },
      {
        name: 'growthRatio',
        label: 'Growth ratio',
        editable: true,
        type: FormItemType.INPUT_NUMBER,
        rules: [
          { type: 'number', min: 0, message: 'non-negative number' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'growthRatioAnnotation',
        label: 'Justification for higher growth ratio proposed by App',
        editable: true,
        type: FormItemType.INPUT
      },
      {
        name: 'minInsCount',
        label: 'Minimum instance count',
        editable: true,
        type: FormItemType.INPUT_NUMBER,
        rules: [
          { pattern: NON_NEGATIVE_NUMBER, message: 'non-negative integer' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'safetyThreshold',
        label: 'Application CPU/MEM safety threshold (per instance)',
        editable: true,
        type: FormItemType.CONDITIONAL_EVALUATION_METRICS_RENDER,
        conditions: [EVALUATION_METRICS_TYPE.CPU, EVALUATION_METRICS_TYPE.MEM],
        normalize: value => `${value}%`,
        rules: [
          { pattern: NON_ZERO_PERCENTAGE, message: 'percentage between 1 and 100' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'remark',
        label: 'Remark',
        editable: true,
        type: FormItemType.INPUT
      },
      {
        name: 'machineModel',
        label: 'Machine model',
        editable: true,
        type: FormItemType.SELECT,
        options: Object.values(machineModels).map(machineModel => {
          return {
            label: machineModel,
            key: machineModel,
            value: machineModel
          }
        }),
        visible: isPlatformAdmin
      }
    ]
  }
  const STOCK_ESTIMATED: IExpandGroup = {
    title: 'Estimated',
    name: 'estimated',
    items: [
      {
        name: 'estimatedInsCountTotal',
        label: 'Estimated instance count',
        type: FormItemType.CALCULATED
      },
      {
        name: 'estimatedInsCountIncrement',
        label: 'Estimated instance count increment',
        type: FormItemType.CALCULATED
      },
      {
        name: 'estimatedCpuIncrement',
        label: 'Estimated CPU increment (Cores)',
        type: FormItemType.CALCULATED,
        dependency: 'cpuLimitOneInsPeak'
      },
      {
        name: 'estimatedMemIncrement',
        label: 'Estimated memory increment (GB)',
        type: FormItemType.CALCULATED,
        dependency: 'memLimitOneInsPeak'
      },
      {
        name: 'estimatedGpuCardIncrement',
        label: 'Estimated GPU increment',
        type: FormItemType.CALCULATED,
        dependency: 'gpuCardLimitOneInsPeak'
      }
    ]
  }
  return [STOCK_BASIC_INFO, REFERENCE, GROWTH_EXPECTATION, STOCK_ESTIMATED]
}

export const INCREMENTAL_GROUPS = (
  cids: string[],
  azs: string[],
  envs: string[],
  clusters: string[],
  segments: string[],
  machineModels: string[],
  isPlatformAdmin: boolean
) => {
  const INCREMENTAL_BASIC_INFO: IExpandGroup = {
    title: 'Basic Info',
    name: 'basicInfo',
    flexValue: '0 0 190px',
    items: [
      {
        name: 'cid',
        label: 'Cid',
        editable: true,
        type: FormItemType.SELECT,
        options: Object.values(cids).map(cid => {
          return {
            label: cid,
            key: cid,
            value: cid
          }
        })
      },
      {
        name: 'displayEnv',
        label: 'Env',
        editable: true,
        type: FormItemType.SELECT,
        options: Object.values(envs).map(env => {
          return {
            label: env,
            key: env,
            value: env
          }
        }),
        rules: [{ required: true, message: 'input a value' }]
      },
      {
        name: 'az',
        label: 'Az',
        editable: true,
        component: ({ isItemEditing }) => (
          <Select disabled={!isItemEditing} style={{ width: '160px' }}>
            {Object.values(azs).map(az => (
              <Select.Option value={az} key={az}>
                {az}
              </Select.Option>
            ))}
          </Select>
        ),
        rules: [{ required: true, message: 'input a value' }]
      },
      {
        name: 'cluster',
        label: 'Cluster',
        editable: true,
        tooltip:
          'If you have special requirements, enter the cluster name. Otherwise, resources will be allocated to the cluster that meets the requirements in the AZ',
        component: ({ isItemEditing }) => (
          <Select allowClear={true} disabled={!isItemEditing} style={{ width: '210px' }}>
            {Object.values(clusters).map(cluster => (
              <Select.Option value={cluster} key={cluster}>
                {cluster}
              </Select.Option>
            ))}
          </Select>
        )
      },
      {
        name: 'segment',
        label: 'Segment',
        editable: true,
        component: ({ isItemEditing }) => (
          <Select allowClear={true} disabled={!isItemEditing} style={{ width: '160px' }}>
            {Object.values(segments).map(segment => (
              <Select.Option value={segment} key={segment}>
                {segment}
              </Select.Option>
            ))}
          </Select>
        ),
        rules: [{ required: true, message: 'input a value' }]
      }
    ]
  }
  const INCREMENTAL_ESTIMATED: IExpandGroup = {
    title: 'Estimated',
    name: 'estimated',
    items: [
      {
        name: 'evaluationMetrics',
        label: 'Evaluation metrics',
        editable: true,
        type: FormItemType.SELECT,
        options: Object.values(EVALUATION_METRICS_TYPE).map(type => {
          return {
            label: type,
            key: type,
            value: type
          }
        }),
        rules: [{ required: true, message: 'input a value' }]
      },
      {
        name: 'cpuLimitOneInsPeak',
        label: 'CPU limit per instance (Cores)',
        editable: true,
        type: FormItemType.INPUT_NUMBER,
        rules: [
          { type: 'number', min: 0, message: 'non-negative number' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'memLimitOneInsPeak',
        label: 'Memory limit per instance (GB)',
        editable: true,
        rules: [
          { type: 'number', min: 0, message: 'non-negative number' },
          { required: true, message: 'input a value' }
        ],
        component: ({ isItemEditing }) => <StyledInputNumber disabled={!isItemEditing} controls={false} precision={0} />
      },
      {
        name: 'gpuCardLimitOneInsPeak',
        label: 'GPU cards limit per instance (Cards)',
        editable: true,
        type: FormItemType.INPUT_NUMBER,
        rules: [
          { type: 'number', min: 0, message: 'non-negative number' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'minInsCount',
        label: 'Minimum instance count',
        editable: true,
        type: FormItemType.INPUT_NUMBER,
        rules: [
          { pattern: NON_NEGATIVE_NUMBER, message: 'non-negative integer' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'remark',
        label: 'Remark',
        editable: true,
        type: FormItemType.INPUT
      },
      {
        name: 'machineModel',
        label: 'Machine model',
        editable: true,
        type: FormItemType.SELECT,
        options: Object.values(machineModels).map(machineModel => {
          return {
            label: machineModel,
            key: machineModel,
            value: machineModel
          }
        }),
        visible: isPlatformAdmin,
        rules: [{ required: true, message: 'input a value' }]
      },
      {
        name: 'estimatedCpuIncrementTotal',
        label: 'Required CPU increment (Cores)',
        editable: true,
        type: FormItemType.CONDITIONAL_EVALUATION_METRICS_RENDER,
        conditions: [EVALUATION_METRICS_TYPE.CPU],
        rules: [
          { type: 'number', min: 0, message: 'non-negative number' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'estimatedMemIncrementTotal',
        label: 'Required memory increment(GB)',
        editable: true,
        type: FormItemType.CONDITIONAL_EVALUATION_METRICS_RENDER,
        conditions: [EVALUATION_METRICS_TYPE.MEM],
        rules: [
          { type: 'number', min: 0, message: 'non-negative number' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'qpsMaxOneIns',
        label: 'Max safe QPS for support per instance',
        editable: true,
        type: FormItemType.CONDITIONAL_EVALUATION_METRICS_RENDER,
        conditions: [EVALUATION_METRICS_TYPE.QPS],
        rules: [
          { type: 'number', min: 0, message: 'non-negative number' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'estimatedQpsTotal',
        label: 'Total required QPS',
        editable: true,
        type: FormItemType.CONDITIONAL_EVALUATION_METRICS_RENDER,
        conditions: [EVALUATION_METRICS_TYPE.QPS],
        rules: [
          { type: 'number', min: 0, message: 'non-negative number' },
          { required: true, message: 'input a value' }
        ]
      },
      {
        name: 'estimatedLogic',
        label: 'Required logic description',
        editable: true,
        type: FormItemType.INPUT,
        rules: [{ required: true, message: 'input a value' }]
      },
      {
        name: 'estimatedInsCountTotal',
        label: 'Estimated instance count',
        editable: false,
        type: FormItemType.CALCULATED
      },
      {
        name: 'estimatedCpuIncrement',
        label: 'Estimated CPU increment (Cores)',
        editable: false,
        type: FormItemType.CALCULATED,
        dependency: 'cpuLimitOneInsPeak'
      },
      {
        name: 'estimatedMemIncrement',
        label: 'Estimated memory increment (GB)',
        editable: false,
        type: FormItemType.CALCULATED,
        dependency: 'memLimitOneInsPeak'
      },
      {
        name: 'estimatedGpuCardIncrement',
        label: 'Estimated GPU increment (Cards)',
        editable: false,
        type: FormItemType.CALCULATED,
        dependency: 'gpuCardLimitOneInsPeak'
      }
    ]
  }
  return [INCREMENTAL_BASIC_INFO, INCREMENTAL_ESTIMATED]
}
export enum TITLE {
  SDU = 'SDU',
  LEVEL_1_PROJECT = 'Level 1 Project',
  LEVEL_2_PROJECT = 'Level 2 Project',
  LEVEL_3_PROJECT = 'Level 3 Project',
  VERSION = 'Version',
  STATUS = 'Status'
}

export const STOCK_COLUMNS = [
  {
    title: TITLE.SDU,
    dataIndex: ['metaData', 'sdu']
  },
  {
    title: TITLE.LEVEL_1_PROJECT,
    dataIndex: ['metaData', 'level1']
  },
  {
    title: TITLE.LEVEL_2_PROJECT,
    dataIndex: ['metaData', 'level2']
  },
  {
    title: TITLE.LEVEL_3_PROJECT,
    dataIndex: ['metaData', 'level3']
  },
  {
    title: TITLE.VERSION,
    dataIndex: ['metaData', 'version']
  },
  {
    title: TITLE.STATUS,
    dataIndex: ['metaData', 'editStatus'],
    filters: [
      {
        text: 'Edited',
        value: 1
      },
      {
        text: 'Unedited',
        value: 0
      }
    ],
    render: (_, record) =>
      record?.metaData?.editStatus ? <Tag color='processing'>Edited</Tag> : <Tag color='default'>Unedited</Tag>
  }
]

const isIncrementalColumn = (title: TITLE) => {
  return (
    title === TITLE.LEVEL_1_PROJECT ||
    title === TITLE.LEVEL_2_PROJECT ||
    title === TITLE.LEVEL_3_PROJECT ||
    title === TITLE.VERSION
  )
}
export const INCREMENTAL_COLUMNS = STOCK_COLUMNS.filter(column => isIncrementalColumn(column.title))

export const GPU_RELATED_ITEM_LABELS = [
  'GPU cards limit per instance at peak',
  'Total GPU allocated at peak',
  'GPU cards limit per instance (Cards)',
  'Estimated GPU increment',
  'Estimated GPU increment (Cards)'
]
