import {
  nodesControllerCordonNode,
  nodesControllerUnCordonNode,
  nodesControllerDrainNode,
  nodesControllerLabelNode,
  nodesControllerTaintNode
} from 'swagger-api/v3/apis/Nodes'
import {
  ticketControllerApproveTicket,
  ticketControllerCancelTicket,
  ticketControllerRejectTicket
} from 'swagger-api/v3/apis/Ticket'
import { directoryControllerGroupDirectoryGetGroups } from 'swagger-api/v3/apis/Directory'
import {
  directoryControllerListDirectoryProjects,
  directoryControllerListDirectoryApplications
} from 'swagger-api/v1/apis/Directory'
import { APPROVAL_ACTION_TYPE } from 'constants/requestAndApproval'

enum DirectoryType {
  TENANTS = 'tenants',
  PROJECTS = 'projects',
  APPLICATIONS = 'applications'
}

interface IDirectoryParams {
  tenantId?: string
  projectName?: string
}

interface ISearchResourcesParams {
  path: string
  searchBy?: string
}

export const getApplicationApiResource = ({
  tenantId,
  projectName,
  appName,
  podName,
  containerName
}: {
  tenantId: number
  projectName?: string
  appName?: string
  podName?: string
  containerName?: string
}) => {
  let resource = ''

  if (tenantId) {
    resource += `tenants/${tenantId}`
  }

  if (projectName) {
    resource += `/projects/${projectName}`
  }

  if (appName) {
    resource += `/apps/${appName}`
  }

  if (podName) {
    resource += `/pods/${podName}`
  }

  if (containerName) {
    resource += `/containers/${containerName}`
  }

  return resource
}

export const searchResources = async ({ path, searchBy }: ISearchResourcesParams) => {
  const methodsMap = {
    [DirectoryType.TENANTS]: async ({ searchBy, params }) => {
      return await directoryControllerGroupDirectoryGetGroups({ searchBy })
    },
    [DirectoryType.PROJECTS]: async ({ searchBy, params }) => {
      return await directoryControllerListDirectoryProjects({ tenantId: params.tenantId, searchBy })
    },
    [DirectoryType.APPLICATIONS]: async ({ searchBy, params }) => {
      return await directoryControllerListDirectoryApplications({
        tenantId: params.tenantId,
        projectName: params.projectName,
        searchBy
      })
    }
  }
  const { methodKey, params } = decodePath(path)
  if (methodsMap[methodKey]) {
    return await methodsMap[methodKey]({ params, searchBy })
  }

  function decodePath(path) {
    let methodKey = DirectoryType.TENANTS
    const params: IDirectoryParams = {}
    const splitData = path.split('/')
    if (splitData.length === 5) {
      methodKey = DirectoryType.APPLICATIONS
      params.tenantId = splitData[1]
      params.projectName = splitData[3]
    } else if (splitData.length === 3) {
      methodKey = DirectoryType.PROJECTS
      params.tenantId = splitData[1]
    }
    return {
      methodKey,
      params
    }
  }
}

export const putClusterNodeActions = async ({ actionType, clusterName, actionConfig }) => {
  const urlMap = {
    cordon: nodesControllerCordonNode,
    uncordon: nodesControllerUnCordonNode,
    drain: nodesControllerDrainNode,
    label: nodesControllerLabelNode,
    taint: nodesControllerTaintNode
  }
  if (urlMap[actionType]) {
    return await urlMap[actionType]({ clusterName, payload: actionConfig })
  }
}

export const processTerminalAccessRequest = async ({ access, action }) => {
  const ticketId = access
  if (action === APPROVAL_ACTION_TYPE.APPROVE) {
    return await ticketControllerApproveTicket({ ticketId })
  }
  if (action === APPROVAL_ACTION_TYPE.CANCEL) {
    return await ticketControllerCancelTicket({ ticketId })
  }
  return await ticketControllerRejectTicket({ ticketId })
}
