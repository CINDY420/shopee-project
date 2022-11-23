import fetch from 'helpers/fetch'
import * as types from '../models'

export interface INodesControllerListNodesParams {
  clusterName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type NodesControllerListNodesFn = (params: INodesControllerListNodesParams) => Promise<types.INodeListResponse>

export const nodesControllerListNodes: NodesControllerListNodesFn = async ({
  clusterName,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/nodes`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface INodesControllerGetNodeByNameParams {
  clusterName: string
  nodeName: string
}

type NodesControllerGetNodeByNameFn = (params: INodesControllerGetNodeByNameParams) => Promise<types.IINode>

export const nodesControllerGetNodeByName: NodesControllerGetNodeByNameFn = async ({ clusterName, nodeName }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/nodes/${nodeName}`,
    method: 'GET'
  })

  return body
}

export interface INodesControllerCordonNodeParams {
  clusterName: string
  payload: types.INodeActionBasePayload
}

type NodesControllerCordonNodeFn = (params: INodesControllerCordonNodeParams) => Promise<types.INodeActionResponse>

export const nodesControllerCordonNode: NodesControllerCordonNodeFn = async ({ clusterName, payload }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/nodes/action/cordon`,
    method: 'PUT',
    payload
  })

  return body
}

export interface INodesControllerUnCordonNodeParams {
  clusterName: string
  payload: types.INodeActionBasePayload
}

type NodesControllerUnCordonNodeFn = (params: INodesControllerUnCordonNodeParams) => Promise<types.INodeActionResponse>

export const nodesControllerUnCordonNode: NodesControllerUnCordonNodeFn = async ({ clusterName, payload }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/nodes/action/uncordon`,
    method: 'PUT',
    payload
  })

  return body
}

export interface INodesControllerDrainNodeParams {
  clusterName: string
  payload: types.INodeActionBasePayload
}

type NodesControllerDrainNodeFn = (params: INodesControllerDrainNodeParams) => Promise<types.INodeActionResponse>

export const nodesControllerDrainNode: NodesControllerDrainNodeFn = async ({ clusterName, payload }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/nodes/action/drain`,
    method: 'PUT',
    payload
  })

  return body
}

export interface INodesControllerLabelNodeParams {
  clusterName: string
  payload: types.INodeLabelPayload
}

type NodesControllerLabelNodeFn = (params: INodesControllerLabelNodeParams) => Promise<types.INodeActionResponse>

export const nodesControllerLabelNode: NodesControllerLabelNodeFn = async ({ clusterName, payload }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/nodes/action/label`,
    method: 'PUT',
    payload
  })

  return body
}

export interface INodesControllerTaintNodeParams {
  clusterName: string
  payload: types.INodeTaintPayload
}

type NodesControllerTaintNodeFn = (params: INodesControllerTaintNodeParams) => Promise<types.INodeActionResponse>

export const nodesControllerTaintNode: NodesControllerTaintNodeFn = async ({ clusterName, payload }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/nodes/action/taint`,
    method: 'PUT',
    payload
  })

  return body
}

export interface INodesControllerGetNodePodListParams {
  clusterName: string
  nodeName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type NodesControllerGetNodePodListFn = (
  params: INodesControllerGetNodePodListParams
) => Promise<types.IINodePodListResponse>

export const nodesControllerGetNodePodList: NodesControllerGetNodePodListFn = async ({
  clusterName,
  nodeName,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/nodes/${nodeName}/pods`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}
