export enum PERMISSION_RESOURCE {
  CLUSTER = 'cluster',
  TENANT = 'tenant',
  PROJECT = 'project',
  USER = 'user',
  ROLE_BINDING = 'rolebinding',
  SHOPEE_JOB = 'shopeejob',
  POD = 'pod',
}

export enum PERMISSION_ACTION {
  GET = 'get',
  LIST = 'list',
  PATCH = 'patch',
  // 暂时不使用
  UPDATE = 'update',
  // 暂时不使用
  WATCH = 'watch',
  CREATE = 'create',
  DELETE = 'delete',
}
