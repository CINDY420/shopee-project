export enum ERROR_MESSAGE {
  ELASTICSEARCH_ERROR = 'Request elasticsearch error',
  REQUEST_OFFSET_INVALID = 'Request offset invalid',
  REQUEST_FILTER_INVALID = 'Request filter expression invalid',
  REQUEST_ORDER_INVALID = 'Request order expression invalid',
  REQUEST_LIMIT_INVALID = 'Request limit invalid',
  REQUEST_BODY_INVALID = 'Request body invalid',
  REQUEST_KUBECONFIG_INVALID = 'Request kubeconfig is invalid',
  REQUEST_NAME_EXIST = 'New Name already exist',
  REQUEST_KUBECONFIG_DUPLICATE = 'Cluster defined by kubeconfig already exists',
  REQUEST_CLUSTER_NOT_EXIST = 'Request cluster not exist',
  REQUEST_INVALID = 'Request invalid',
  ACCESS_FORBIDDEN = 'Access to this resource is forbidden',
  REQUEST_DEPLOYMENT_NOT_EXIST = 'Request deployment not exist',
  REQUEST_DEPLOYMENT_UNKNOWN_PHASE = 'Error: Unable to determine the phase of the current deployment',
  REQUEST_APPLICATION_NOT_EXIST = 'Request application not exist',
  REQUEST_POD_NOT_EXIST = 'Request pod not exist',
  REQUEST_CONTAINER_NOT_EXIST = 'Request container not exist',
  TIMEOUT_EXCEPTION = 'timeout exception'
}