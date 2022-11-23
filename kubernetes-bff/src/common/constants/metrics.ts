export enum METRICS_KEY_MAP {
  cpu_usage = '_cpu_usage',
  memory_usage = '_memory_usage',
  filesystem_usage_bytes = '_filesystem_usage_bytes',
  cpu_limit_core = '_cpu_limit_core',
  memory_limit_bytes = '_memory_limit_bytes'
}

export enum METRICS_READY_KEY_MAP {
  _cpu_request_core = '_cpu_request_core',
  _cpu_usage_rate = '_cpu_usage:rate',
  _memory_request_byte = '_memory_request_byte',
  _memory_usage_rate = '_memory_usage:rate',
  _filesystem_usage_bytes_sum = '_filesystem_usage_bytes:sum',
  cpu_limit_core = '_cpu_limit_core',
  memory_limit_bytes = '_memory_limit_bytes'
}

export const USAGE_ALARM_BOTTOM = 0.2
export const USAGE_ALARM_UP = 0.6
export const USAGE_ALARM_FREE_MESSAGE = 'Too much free resources!'
export const USAGE_ALARM_USED_MESSAGE = 'Too much used resources!'
