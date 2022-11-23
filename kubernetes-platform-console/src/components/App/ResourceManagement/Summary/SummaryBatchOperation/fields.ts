export const SUMMARY_LEVEL_1_DOWANLOAD_DATA_FIELDS = [
  {
    label: 'Level 1 Project',
    value: 'level1DisplayName'
  }
]

export const SUMMARY_LEVEL_2_DOWANLOAD_DATA_FIELDS = SUMMARY_LEVEL_1_DOWANLOAD_DATA_FIELDS.concat([
  {
    label: 'Level 2 Project',
    value: 'level2DisplayName'
  }
])

export const SUMMARY_LEVEL_3_DOWANLOAD_DATA_FIELDS = SUMMARY_LEVEL_2_DOWANLOAD_DATA_FIELDS.concat([
  {
    label: 'Level 3 Project',
    value: 'level3DisplayName'
  }
])

export const SUMMARY_DETAILED_DOWANLOAD_DATA_FIELDS = SUMMARY_LEVEL_3_DOWANLOAD_DATA_FIELDS.concat([
  {
    label: 'AZ',
    value: 'az'
  },
  {
    label: 'Env',
    value: 'displayEnv'
  },
  {
    label: 'Machine Model',
    value: 'machineModel'
  }
])

export const SUMMARY_QUOTA_DOWNLOAD_DATA_FIELDS = [
  {
    label: 'CPU (Core) Stock',
    value: 'cpuStock'
  },
  {
    label: 'CPU (Core) Incremental',
    value: 'cpuIncrement'
  },
  {
    label: 'CPU (Core) Target',
    value: 'cpuTarget'
  },
  {
    label: 'CPU (Core) Ratio',
    value: 'cpuIncrementRatio'
  },
  {
    label: 'MEM (GB) Stock',
    value: 'memStock'
  },
  {
    label: 'MEM (GB) Incremental',
    value: 'memIncrement'
  },
  {
    label: 'MEM (GB) Target',
    value: 'memTarget'
  },
  {
    label: 'MEM (GB) Ratio',
    value: 'memIncrementRatio'
  },
  {
    label: 'Pods Stock',
    value: 'insCountStock'
  },
  {
    label: 'Pods Incremental',
    value: 'insCountIncrement'
  },
  {
    label: 'Pods Target',
    value: 'insCountTarget'
  },
  {
    label: 'Pods Ratio',
    value: 'insCountIncrementRatio'
  }
]
