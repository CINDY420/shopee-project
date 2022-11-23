/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
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
  params: IEksNodeController_listNodesParams,
  extra?: any
) => Promise<types.IEksListNodesResponse>

export const eksNodeController_listNodes: EksNodeController_listNodesFn = async (
  { clusterId, offset, limit, labelSelector, orderBy, filterBy, searchBy },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/nodes`,
      method: 'GET',
      params: { offset, limit, labelSelector, orderBy, filterBy, searchBy }
    },
    extra
  )

  return body
}

export interface IEksNodeController_cordonNodesParams {
  clusterId: number
  payload: types.IEksCordonNodesBody
}

type EksNodeController_cordonNodesFn = (
  params: IEksNodeController_cordonNodesParams,
  extra?: any
) => Promise<any>

export const eksNodeController_cordonNodes: EksNodeController_cordonNodesFn = async (
  { clusterId, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/nodes/cordon`,
      method: 'POST',
      payload
    },
    extra
  )

  return body
}

export interface IEksNodeController_unCordonNodesParams {
  clusterId: number
  payload: types.IEksUnCordonNodesBody
}

type EksNodeController_unCordonNodesFn = (
  params: IEksNodeController_unCordonNodesParams,
  extra?: any
) => Promise<any>

export const eksNodeController_unCordonNodes: EksNodeController_unCordonNodesFn = async (
  { clusterId, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/nodes/unCordon`,
      method: 'POST',
      payload
    },
    extra
  )

  return body
}

export interface IEksNodeController_drainNodesParams {
  clusterId: number
  payload: types.IEksDrainNodesBody
}

type EksNodeController_drainNodesFn = (
  params: IEksNodeController_drainNodesParams,
  extra?: any
) => Promise<any>

export const eksNodeController_drainNodes: EksNodeController_drainNodesFn = async (
  { clusterId, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/nodes/drain`,
      method: 'POST',
      payload
    },
    extra
  )

  return body
}

export interface IEksNodeController_addNodesParams {
  clusterId: number
  payload: types.IEksAddNodesBody
}

type EksNodeController_addNodesFn = (
  params: IEksNodeController_addNodesParams,
  extra?: any
) => Promise<types.IINodegroupScaleNodeGroupResp>

export const eksNodeController_addNodes: EksNodeController_addNodesFn = async (
  { clusterId, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/nodes/add`,
      method: 'POST',
      payload
    },
    extra
  )

  return body
}

export interface IEksNodeController_deleteNodesParams {
  clusterId: number
  payload: types.IEksDeleteNodesBody
}

type EksNodeController_deleteNodesFn = (
  params: IEksNodeController_deleteNodesParams,
  extra?: any
) => Promise<types.IINodegroupScaleNodeGroupResp>

export const eksNodeController_deleteNodes: EksNodeController_deleteNodesFn = async (
  { clusterId, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/nodes/delete`,
      method: 'DELETE',
      payload
    },
    extra
  )

  return body
}

export interface IEksNodeController_getNodeGroupListParams {
  clusterId: number
}

type EksNodeController_getNodeGroupListFn = (
  params: IEksNodeController_getNodeGroupListParams,
  extra?: any
) => Promise<types.IEksGetNodeGroupListResponse>

export const eksNodeController_getNodeGroupList: EksNodeController_getNodeGroupListFn = async (
  { clusterId },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/nodes/nodeGroups`,
      method: 'GET'
    },
    extra
  )

  return body
}

export interface IEksNodeController_setNodeLabelsParams {
  clusterId: number
  payload: types.IEksSetNodesLabelsBody
}

type EksNodeController_setNodeLabelsFn = (
  params: IEksNodeController_setNodeLabelsParams,
  extra?: any
) => Promise<any>

export const eksNodeController_setNodeLabels: EksNodeController_setNodeLabelsFn = async (
  { clusterId, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/nodes/labels`,
      method: 'POST',
      payload
    },
    extra
  )

  return body
}

export interface IEksNodeController_setNodeTiantsParams {
  clusterId: number
  payload: types.IEksSetNodesTiantsBody
}

type EksNodeController_setNodeTiantsFn = (
  params: IEksNodeController_setNodeTiantsParams,
  extra?: any
) => Promise<any>

export const eksNodeController_setNodeTiants: EksNodeController_setNodeTiantsFn = async (
  { clusterId, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/nodes/tiants`,
      method: 'POST',
      payload
    },
    extra
  )

  return body
}
