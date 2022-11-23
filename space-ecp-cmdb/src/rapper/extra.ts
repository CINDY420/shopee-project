/* md5: 917447fbfdcd2706ae3b11737b6475e8 */
/* Rap repository id: 178 */
/* Rapper version: 2.1.13 */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

/**
 * This file is automatically generated by Rapper to synchronize the Rap platform interface, please do not modify
 * Rap repository url: http://rap.shopee.io/repository/editor?id=178
 */

export const IReqType = {
  'POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:rollback': {sduName: 2, deployId: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:restart': {sduName: 2, deployId: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:fullRelease': {sduName: 2, deployId: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:cancelCanary': {sduName: 2, deployId: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:suspend': {sduName: 2, deployId: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:stop': {sduName: 2, deployId: 2},
  'POST/api/ecp-cmdb/services/{serviceName}/sdus:bind': {serviceName: 2},
  'POST/api/ecp-cmdb/services/{serviceName}/sdus/{sduName}:unbind': {serviceName: 2, sduName: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}:restart': {sduName: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}:suspend': {sduName: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}:stop': {sduName: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill': {sduName: 2, deployId: 2, podName: 2},
  'POST/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods:batchKill': {sduName: 2, deployId: 2},
  'POST/api/ecp-cmdb/services/{serviceId}/pvs': {serviceId: 2},
  'POST/api/ecp-cmdb/services/{serviceId}/pvs/{uuid}': {serviceId: 2, uuid: 2},
  'DELETE/api/ecp-cmdb/pvs/{uuid}': {uuid: 2},
  'POST/api/ecp-cmdb/services/{serviceId}/pvSecrets': {serviceId: 2},
  'PUT/api/ecp-cmdb/services/{serviceId}/pvSecrets/{uuid}': {serviceId: 2, uuid: 2},
  'DELETE/api/ecp-cmdb/pvSecrets/{uuid}': {uuid: 2},
  'POST/api/ecp-cmdb/services/{serviceId}/pvSecrets/{ussAppid}:isExist': {serviceId: 2, ussAppid: 2},
}