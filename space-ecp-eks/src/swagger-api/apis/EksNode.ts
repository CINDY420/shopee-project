/* eslint-disable */
import fetch from 'src/helpers/fetch'
import * as types from '../models'

export interface IEksNodeController_listNodesParams {
  clusterId: number
  offset?: string
  limit?: string
  labelSelector?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EksNodeController_listNodesFn = (
  params: IEksNodeController_listNodesParams
) => Promise<types.IEksListNodesResponse>

export const eksNodeController_listNodes: EksNodeController_listNodesFn = async ({
  clusterId,
  offset,
  limit,
  labelSelector,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/nodes`,
    method: 'GET',
    params: { offset, limit, labelSelector, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IEksNodeController_cordonNodesParams {
  clusterId: number
  payload: types.IEksCordonNodesBody
}

type EksNodeController_cordonNodesFn = (
  params: IEksNodeController_cordonNodesParams
) => Promise<any>

export const eksNodeController_cordonNodes: EksNodeController_cordonNodesFn = async ({
  clusterId,
  payload
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/nodes/cordon`,
    method: 'POST',
    payload
  })

  return body
}

export interface IEksNodeController_unCordonNodesParams {
  clusterId: number
  payload: types.IEksUnCordonNodesBody
}

type EksNodeController_unCordonNodesFn = (
  params: IEksNodeController_unCordonNodesParams
) => Promise<any>

export const eksNodeController_unCordonNodes: EksNodeController_unCordonNodesFn = async ({
  clusterId,
  payload
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/nodes/unCordon`,
    method: 'POST',
    payload
  })

  return body
}

export interface IEksNodeController_drainNodesParams {
  clusterId: number
  payload: types.IEksDrainNodesBody
}

type EksNodeController_drainNodesFn = (params: IEksNodeController_drainNodesParams) => Promise<any>

export const eksNodeController_drainNodes: EksNodeController_drainNodesFn = async ({
  clusterId,
  payload
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/nodes/drain`,
    method: 'POST',
    payload
  })

  return body
}

export interface IEksNodeController_addNodesParams {
  clusterId: number
  payload: types.IEksAddNodesBody
}

type EksNodeController_addNodesFn = (
  params: IEksNodeController_addNodesParams
) => Promise<types.IINodegroupScaleNodeGroupResp>

export const eksNodeController_addNodes: EksNodeController_addNodesFn = async ({
  clusterId,
  payload
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/nodes/add`,
    method: 'POST',
    payload
  })

  return body
}

export interface IEksNodeController_deleteNodesParams {
  clusterId: number
  payload: types.IEksDeleteNodesBody
}

type EksNodeController_deleteNodesFn = (
  params: IEksNodeController_deleteNodesParams
) => Promise<types.IINodegroupScaleNodeGroupResp>

export const eksNodeController_deleteNodes: EksNodeController_deleteNodesFn = async ({
  clusterId,
  payload
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/nodes/delete`,
    method: 'DELETE',
    payload
  })

  return body
}

export interface IEksNodeController_getNodeGroupListParams {
  clusterId: number
}

type EksNodeController_getNodeGroupListFn = (
  params: IEksNodeController_getNodeGroupListParams
) => Promise<types.IEksGetNodeGroupListResponse>

export const eksNodeController_getNodeGroupList: EksNodeController_getNodeGroupListFn = async ({
  clusterId
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/nodes/nodeGroups`,
    method: 'GET'
  })

  return body
}

export interface IEksNodeController_setNodeLabelsParams {
  clusterId: number
  payload: types.IEksSetNodesLabelsBody
}

type EksNodeController_setNodeLabelsFn = (
  params: IEksNodeController_setNodeLabelsParams
) => Promise<any>

export const eksNodeController_setNodeLabels: EksNodeController_setNodeLabelsFn = async ({
  clusterId,
  payload
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/nodes/labels`,
    method: 'POST',
    payload
  })

  return body
}

export interface IEksNodeController_setNodeTiantsParams {
  clusterId: number
  payload: types.IEksSetNodesTiantsBody
}

type EksNodeController_setNodeTiantsFn = (
  params: IEksNodeController_setNodeTiantsParams
) => Promise<any>

export const eksNodeController_setNodeTiants: EksNodeController_setNodeTiantsFn = async ({
  clusterId,
  payload
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/nodes/tiants`,
    method: 'POST',
    payload
  })

  return body
}
