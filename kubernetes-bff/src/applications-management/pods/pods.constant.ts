export const EPHEMERAL_CONTAINER_VOLUME_MOUNT_NAME = 'docker-path'
export const EPHEMERAL_CONTAINER_NAME = 'szdevops-debugger'
export const EPHEMERAL_CONTAINER_VOLUME_MOUNT_PATH = '/docker-path'

export const METRIC_NAME_POD_CPU_REQUEST = 'pod:pod_cpu_request_core'
export const METRIC_NAME_POD_MEMORY_REQUEST = 'pod:pod_memory_request_bytes'
export const METRIC_NAME_POD_MEMORY_RSS = 'pod:pod_memory_rss_bytes'
export const METRIC_NAME_POD_FS_USAGE = 'pod:pod_filesystem_usage_bytes:sum'

export const MEMORY_USAGE_RE = '^(.+)(_memory_usage:rate)$'
export const MEMORY_LIMIT_RE = '^(.+)(_memory_limit_bytes)$'
export const CPU_LIMIT_RE = '^(.+)(_cpu_limit_core)$'
export const CPU_USAGE_RE = '^(.+)(_cpu_usage:rate)$'

export const GiB_2_BYTE = 1024.0 * 1024.0 * 1024.0

export const CPU_REQUEST_OR_LIMIT = 'CPURequestOrLimit'
export const MEM_REQUEST_OR_LIMIT = 'MemRequestOrLimit'
export const MEM_RSS = 'MemRss'
export const CPU_USAGE = 'CPUUsage'
export const MEM_USAGE = 'MemUsage'
export const FS_USAGE = 'FsUsage'

export const WEBSOCKET_SUCCESS = 1000
export const WEBSOCKET_ERROR = -1000
export const WEBSOCKET_CONFIG_ERROR = -1001
export const WEBSOCKET_INNER_SRV_ERROR = -1002

export const WEBSOCKET_AUTH_ERROR = -1003
export const WEBSOCKET_K8S_SRV_ERROR = -1004
export const WEBSOCKET_HTTP_NOT_FOUND = -1005
export const WEBSOCKET_UNKNOWN_ERROR = -1006
export const WEBSOCKET_CLOSE = -1007
export const TYPES = {
  MESSAGE_TYPE: 1
}

export const POD_TERMINAL_WEBSOCKET_URL =
  '/api/v3/tenants/:tenantId/projects/:projectName/apps/:appName/pods/:podName/containers/:containerName/terminal'
export const POD_LOGS_WEBSOCKET_URL =
  '/api/v3/tenants/:tenantId/projects/:projectName/apps/:appName/pods/:podName/containers/:containerName/logs'
