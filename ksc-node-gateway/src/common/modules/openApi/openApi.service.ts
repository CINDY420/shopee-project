import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { constants as HTTP_CONSTANTS } from 'http2'

import { Http, extractResponseErrorMessage } from '@/common/utils/http'
import { IOpenApiConfig } from '@/common/interfaces/config.interface'
import { IRequestParams } from '@/common/interfaces/http.interface'
import { Logger } from '@/common/utils/logger'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'

import { OpenApiInfoProvider } from '@/common/modules/openApi/openApiInfo.provider'

import {
  OpenApiListClustersQuery,
  ListClustersResponse,
  GetClusterResponse,
  OpenApiListClusterDetailsQuery,
  ListClusterDetailsResponse,
  GetClusterOverviewResponse,
  OpenApiListClusterTenantsQuery,
  OpenApiListClusterTenantsResponse,
  IOpenApiUpdateClusterPayloadWrapper,
  IOpenApiUpdateClusterPayload,
  UpdateClusterResponse,
  IOpenApiAddClusterPayload,
} from '@/common/dtos/openApi/cluster.dto'
import {
  OpenApiListTenantsQuery,
  OpenApiListTenantsResponse,
  ICreateTenantPayload,
  GetTenantResponse,
  IOpenApiUpdateTenantPayload,
  IOpenApiUpdateTenantPayloadWrapper,
  UpdateTenantResponse,
  ListAllProductLinesResponse,
  OpenApiListCMDBTenantsResponse,
  IOpenApiBatchUpdateTenantFusePayload,
  IOpenApiBatchUpdateTenantFuseResponse,
  IOpenApiBatchUpdateTenantFusePayloadWrapper,
} from '@/common/dtos/openApi/tenant.dto'
import {
  LoginPayload,
  LoginResponse,
  OpenApiListGlobalUsersQuery,
  ListGlobalUsersResponse,
  AddUserRoleBody,
  AddUserRoleResponse,
  GetUserResponse,
  GetRoleResponse,
  ListAllRolesResponse,
  ListRoleApproversQuery,
  ListRoleApproversResponse,
  DeleteUserRoleBody,
  CreateUsersBody,
  CreateUsersResponse,
} from '@/common/dtos/openApi/account.dto'
import {
  OpenApiListProjectsQuery,
  OpenApiListProjectsResponse,
  GetProjectResponse,
  IUpdateProjectPayload,
  IOpenApiUpdateProjectPayloadWrapper,
  UpdateProjectResponse,
  ICreateProjectBody,
} from '@/common/dtos/openApi/project.dto'
import {
  OpenApiListJobsQuery,
  ListJobsResponse,
  OpenApiGetJobResponse,
  OpenApiBatchHandleJobResopnse,
  OpenApiBatchKillJobBody,
  OpenApiBatchDeleteJobBody,
  OpenApiScaleJobBody,
  OpenApiCreateJobBody,
} from '@/common/dtos/openApi/job.dto'
import {
  OpenApiListPodsQuery,
  ListPodsResponse,
  ListPodContainersResponse,
  GetPodTerminalSessionId,
} from '@/common/dtos/openApi/pod.dto'
import {
  ListNodesResponse,
  OpenApiListNodesQuery,
  UpdateNodeBody,
  UpdateNodePayload,
  UpdateNodeResponse,
} from '@/common/dtos/openApi/node.dto'
import {
  GetPeriodicJobResponse,
  ListPeriodicJobsResponse,
  OpenApiBatchDeletePeriodicJobBody,
  OpenApiBatchEnablePeriodicJobBody,
  OpenApiBatchHandlePeriodicJobResopnse,
  OpenApiCreatePeriodicJobBody,
  OpenApiEnablePeriodicJobBody,
  OpenApiListPeriodicJobsQuery,
  OpenApiUpdatePeriodicJobBody,
} from '@/common/dtos/openApi/periodicJob.dto'
import {
  GetOperationRecordResponse,
  ListOperationRecordsResponse,
  OpenApiListOperationRecordsQuery,
} from '@/common/dtos/openApi/operation.dto'

@Injectable()
export class OpenApiService {
  constructor(
    private configService: ConfigService,
    private readonly http: Http,
    private readonly logger: Logger,
    private readonly openApiProvider: OpenApiInfoProvider,
  ) {
    this.logger.setContext(OpenApiService.name)

    const openApiConfig = this.configService.get<IOpenApiConfig>('openApi')
    const { protocol, host, prefix } = openApiConfig || {}
    const serverUrl = `${protocol}://${host}`
    const serverUrlPrefix = prefix ? `${serverUrl}/${prefix}` : serverUrl
    const serverUrlPrefixVersion = `${serverUrlPrefix}/v1`
    // Init openApi client
    this.http.setServerConfiguration({
      serverName: OpenApiService.name,
      baseUrl: serverUrlPrefixVersion,
    })
  }

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(requestParams: IRequestParams<TRequestParams, TRequestBody>): Promise<TResponseBody> {
    const { method, body, query, resourceURI, headers: incomingHeaders } = requestParams
    const token = this.openApiProvider.getOpenApiToken()
    const tokenHeader = token ? { [HTTP_CONSTANTS.HTTP2_HEADER_AUTHORIZATION]: `Bearer ${token}` } : {}
    const headers = {
      [HTTP_CONSTANTS.HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
      ...tokenHeader,
      ...incomingHeaders,
    }

    const [result, error] = await this.http.request<TResponseBody>({
      url: resourceURI,
      method,
      searchParams: query ?? {},
      headers,
      json: body,
    })

    if (error || !result) {
      const errorStatus = error?.response?.statusCode
      const errorBody = error?.response?.body
      const errorMessage = extractResponseErrorMessage(errorBody, 'metadata')
      throwError(
        {
          ...ERROR.REMOTE_SERVICE_ERROR.KSC_OPEN_API_ERROR.UNKNOWN_ERROR,
          status: errorStatus ?? HttpStatus.SERVICE_UNAVAILABLE,
        },
        errorMessage,
      )
    }

    return result
  }

  // Cluster
  public listClusters(openApiListClustersQuery?: OpenApiListClustersQuery) {
    return this.request<ListClustersResponse, OpenApiListClustersQuery, never>({
      method: 'GET',
      resourceURI: '/clusters',
      query: openApiListClustersQuery,
    })
  }

  public getCluster(clusterId: string) {
    return this.request<GetClusterResponse>({
      method: 'GET',
      resourceURI: `/clusters/${clusterId}`,
    })
  }

  public listClustersWithDetail(openApiListClusterDetailsQuery?: OpenApiListClusterDetailsQuery) {
    return this.request<ListClusterDetailsResponse, OpenApiListClusterDetailsQuery, never>({
      method: 'GET',
      resourceURI: '/cluster_details',
      query: openApiListClusterDetailsQuery,
    })
  }

  public getClusterOverview() {
    return this.request<GetClusterOverviewResponse>({
      method: 'GET',
      resourceURI: '/cluster_overviews',
    })
  }

  public listClusterTenants(clusterId: string, openApiListClusterTenantsQuery?: OpenApiListClusterTenantsQuery) {
    return this.request<OpenApiListClusterTenantsResponse, OpenApiListClusterTenantsQuery, never>({
      method: 'GET',
      resourceURI: `/clusters/${clusterId}/tenants`,
      query: openApiListClusterTenantsQuery,
    })
  }

  public addCluster(openApiAddClusterPayload: IOpenApiAddClusterPayload) {
    return this.request<UpdateClusterResponse, never, IOpenApiAddClusterPayload>({
      method: 'POST',
      resourceURI: '/clusters',
      body: openApiAddClusterPayload,
    })
  }

  public updateCluster(clusterId: string, openApiUpdateClusterPayload: IOpenApiUpdateClusterPayload) {
    return this.request<UpdateClusterResponse, never, IOpenApiUpdateClusterPayloadWrapper>({
      method: 'PATCH',
      resourceURI: `/clusters/${clusterId}`,
      body: { payload: openApiUpdateClusterPayload },
    })
  }

  // Account
  public login(loginPayload: LoginPayload) {
    return this.request<LoginResponse, never, LoginPayload>({
      method: 'POST',
      resourceURI: '/user:login',
      body: loginPayload,
    })
  }

  public listGlobalUsers(openApiListGlobalUsersQuery?: OpenApiListGlobalUsersQuery) {
    return this.request<ListGlobalUsersResponse, OpenApiListGlobalUsersQuery, never>({
      method: 'GET',
      resourceURI: '/global_users',
      query: openApiListGlobalUsersQuery,
    })
  }

  public addUserRole(userId: string, addUserRoleBody: AddUserRoleBody) {
    return this.request<AddUserRoleResponse, never, AddUserRoleBody>({
      method: 'POST',
      resourceURI: `/users/${userId}/roles`,
      body: addUserRoleBody,
    })
  }

  public createUsers(createUsersBody: CreateUsersBody) {
    return this.request<CreateUsersResponse, never, CreateUsersBody>({
      method: 'POST',
      resourceURI: `/users:batch`,
      body: createUsersBody,
    })
  }

  public getUser(userId: string) {
    return this.request<GetUserResponse>({
      method: 'GET',
      resourceURI: `/users/${userId}`,
    })
  }

  public getRole(roleId: string) {
    return this.request<GetRoleResponse>({
      method: 'GET',
      resourceURI: `/roles/${roleId}`,
    })
  }

  public listAllRoles() {
    return this.request<ListAllRolesResponse>({
      method: 'GET',
      resourceURI: 'roles',
    })
  }

  public listTenantUsers(tenantId: string, openApiListTenantUsersQuery?: OpenApiListGlobalUsersQuery) {
    return this.request<ListGlobalUsersResponse, OpenApiListGlobalUsersQuery, never>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/users`,
      query: openApiListTenantUsersQuery,
    })
  }

  public listProjectUsers(
    tenantId: string,
    projectId: string,
    openApiListProjectUsersQuery?: OpenApiListGlobalUsersQuery,
  ) {
    return this.request<ListGlobalUsersResponse, OpenApiListGlobalUsersQuery, never>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/users`,
      query: openApiListProjectUsersQuery,
    })
  }

  public listRoleApprovers(listRoleApproversQuery: ListRoleApproversQuery) {
    return this.request<ListRoleApproversResponse, ListRoleApproversQuery, never>({
      method: 'GET',
      resourceURI: '/users/role_approvers',
      query: listRoleApproversQuery,
    })
  }

  public deleteUserRole(userId: string, deleteUserRoleBody: DeleteUserRoleBody) {
    return this.request<never, never, DeleteUserRoleBody>({
      method: 'DELETE',
      resourceURI: `/users/${userId}/roles`,
      body: deleteUserRoleBody,
    })
  }

  // Tenant
  public listTenants(openApiListTenantsQuery?: OpenApiListTenantsQuery) {
    return this.request<OpenApiListTenantsResponse, OpenApiListTenantsQuery, never>({
      method: 'GET',
      resourceURI: '/tenants',
      query: openApiListTenantsQuery,
    })
  }

  public listAllTenants(openApiListTenantsQuery?: OpenApiListTenantsQuery) {
    return this.request<OpenApiListTenantsResponse, OpenApiListTenantsQuery, never>({
      method: 'GET',
      resourceURI: '/all_tenants',
      query: openApiListTenantsQuery,
    })
  }

  public listAllCMDBTenants() {
    return this.request<OpenApiListCMDBTenantsResponse, never, never>({
      method: 'GET',
      resourceURI: '/all_cmdb_tenants',
    })
  }

  public createTenant(createTenantPayload: ICreateTenantPayload) {
    return this.request<ICreateTenantPayload, never, ICreateTenantPayload>({
      method: 'POST',
      resourceURI: '/tenants',
      body: createTenantPayload,
    })
  }

  public getTenant(tenantId: string) {
    return this.request<GetTenantResponse>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}`,
    })
  }

  public updateTenant(tenantId: string, openApiUpdateTenantPayload: IOpenApiUpdateTenantPayload) {
    return this.request<UpdateTenantResponse, never, IOpenApiUpdateTenantPayloadWrapper>({
      method: 'PATCH',
      resourceURI: `/tenants/${tenantId}`,
      body: { payload: openApiUpdateTenantPayload },
    })
  }

  public batchUpdateTenantFuses(openApiUpdateTenantFusePayload: IOpenApiBatchUpdateTenantFusePayload) {
    return this.request<IOpenApiBatchUpdateTenantFuseResponse, never, IOpenApiBatchUpdateTenantFusePayloadWrapper>({
      method: 'PATCH',
      resourceURI: `/tenants:fuse`,
      body: { payload: openApiUpdateTenantFusePayload },
    })
  }

  public listAllProductLines() {
    return this.request<ListAllProductLinesResponse>({
      method: 'GET',
      resourceURI: '/productlines',
    })
  }

  // Project
  public listProjects(tenantId: string, openApiListProjectsQuery?: OpenApiListProjectsQuery) {
    return this.request<OpenApiListProjectsResponse, OpenApiListProjectsQuery, never>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/projects`,
      query: openApiListProjectsQuery,
    })
  }

  public getProject(tenantId: string, projectId: string) {
    return this.request<GetProjectResponse>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}`,
    })
  }

  public updateProject(tenantId: string, projectId: string, updateProjectPayload: IUpdateProjectPayload) {
    return this.request<UpdateProjectResponse, never, IOpenApiUpdateProjectPayloadWrapper>({
      method: 'PATCH',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}`,
      body: { payload: updateProjectPayload },
    })
  }

  public createProject(tenantId: string, createProjectBody: ICreateProjectBody) {
    return this.request<ICreateProjectBody, never, ICreateProjectBody>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects`,
      body: createProjectBody,
    })
  }

  public listAllProjects(tenantId: string, openApiListProjectsQuery?: OpenApiListProjectsQuery) {
    return this.request<OpenApiListProjectsResponse, OpenApiListProjectsQuery, never>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/all_projects`,
      query: openApiListProjectsQuery,
    })
  }

  public deleteProject(tenantId: string, projectId: string) {
    return this.request<never, never, never>({
      method: 'DELETE',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}`,
    })
  }

  // Job
  public listJobs(tenantId: string, projectId: string, openApiListJobsQuery?: OpenApiListJobsQuery) {
    return this.request<ListJobsResponse, OpenApiListJobsQuery, never>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs`,
      query: openApiListJobsQuery,
    })
  }

  public getJob(tenantId: string, projectId: string, jobId: string) {
    return this.request<OpenApiGetJobResponse>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs/${jobId}`,
    })
  }

  public deleteJob(tenantId: string, projectId: string, jobId: string) {
    return this.request<never, never, never>({
      method: 'DELETE',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs/${jobId}`,
    })
  }

  public killJob(tenantId: string, projectId: string, jobId: string) {
    return this.request<never, never, never>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs/${jobId}:kill`,
    })
  }

  public batchKillJob(tenantId: string, projectId: string, batchKillJobBody: OpenApiBatchKillJobBody) {
    return this.request<OpenApiBatchHandleJobResopnse, never, OpenApiBatchKillJobBody>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs:kill`,
      body: batchKillJobBody,
    })
  }

  public batchDeleteJob(tenantId: string, projectId: string, batchDeleteJobBody: OpenApiBatchDeleteJobBody) {
    return this.request<OpenApiBatchHandleJobResopnse, never, OpenApiBatchDeleteJobBody>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs:delete`,
      body: batchDeleteJobBody,
    })
  }

  public rerunJob(tenantId: string, projectId: string, jobId: string) {
    return this.request<never, never, never>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs/${jobId}:rerun`,
    })
  }

  public scaleJob(tenantId: string, projectId: string, jobId: string, scaleJobBody: OpenApiScaleJobBody) {
    return this.request<never, never, OpenApiScaleJobBody>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs/${jobId}:scale`,
      body: scaleJobBody,
    })
  }

  public createJob(tenantId: string, projectId: string, createPeriodicJobBody: OpenApiCreateJobBody) {
    return this.request<OpenApiGetJobResponse, never, OpenApiCreateJobBody>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs`,
      body: createPeriodicJobBody,
    })
  }

  // Pod
  public listPods(tenantId: string, projectId: string, jobId: string, openApiListPodsQuery?: OpenApiListPodsQuery) {
    return this.request<ListPodsResponse, OpenApiListPodsQuery, never>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs/${jobId}/pods`,
      query: openApiListPodsQuery,
    })
  }

  public listPodContainers(tenantId: string, projectId: string, jobId: string, podName: string) {
    return this.request<ListPodContainersResponse>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/jobs/${jobId}/pods/${podName}/containers`,
    })
  }

  public getPodTerminalSessionId(clusterId: string, namespace: string, podName: string, containerName: string) {
    const websocketConfig = this.configService.get<IOpenApiConfig>('websocket')
    const { protocol, host, prefix } = websocketConfig || {}
    return this.request<GetPodTerminalSessionId>({
      method: 'GET',
      resourceURI: `${protocol}://${host}/${prefix}/${clusterId}/${namespace}/${podName}/${containerName}/shell`,
    })
  }

  // Node
  public listNodes(clusterId: string, openApiListNodesQuery?: OpenApiListNodesQuery) {
    return this.request<ListNodesResponse, OpenApiListNodesQuery, never>({
      method: 'GET',
      resourceURI: `/clusters/${clusterId}/nodes`,
      query: openApiListNodesQuery,
    })
  }

  public getNodeOverview(clusterId: string) {
    return this.request<GetClusterOverviewResponse>({
      method: 'GET',
      resourceURI: `/clusters/${clusterId}/node_overviews`,
    })
  }

  public updateNode(clusterId: string, nodeId: string, updateNodePayload: UpdateNodePayload) {
    return this.request<UpdateNodeResponse, never, UpdateNodeBody>({
      method: 'PATCH',
      resourceURI: `clusters/${clusterId}/nodes/${nodeId}`,
      body: { payload: updateNodePayload },
    })
  }

  // Periodic Job
  public listPeriodicJobs(
    tenantId: string,
    projectId: string,
    openApiListPeriodicJobsQuery?: OpenApiListPeriodicJobsQuery,
  ) {
    return this.request<ListPeriodicJobsResponse, OpenApiListPeriodicJobsQuery, never>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/periodic_jobs`,
      query: openApiListPeriodicJobsQuery,
    })
  }

  public getPeriodicJob(tenantId: string, projectId: string, periodicJobId: string) {
    return this.request<GetPeriodicJobResponse>({
      method: 'GET',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/periodic_jobs/${periodicJobId}`,
    })
  }

  public deletePeriodicJob(tenantId: string, projectId: string, periodicJobId: string) {
    return this.request<never, never, never>({
      method: 'DELETE',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/periodic_jobs/${periodicJobId}`,
    })
  }

  public rerunPeriodicJob(tenantId: string, projectId: string, periodicJobId: string) {
    return this.request<never, never, never>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/periodic_jobs/${periodicJobId}:run`,
    })
  }

  public batchDeletePeriodicJob(
    tenantId: string,
    projectId: string,
    batchDeletePeriodicJobBody: OpenApiBatchDeletePeriodicJobBody,
  ) {
    return this.request<OpenApiBatchHandlePeriodicJobResopnse, never, OpenApiBatchDeletePeriodicJobBody>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/periodic_jobs:delete`,
      body: batchDeletePeriodicJobBody,
    })
  }

  public createPeriodicJob(tenantId: string, projectId: string, createPeriodicJobBody: OpenApiCreatePeriodicJobBody) {
    return this.request<GetPeriodicJobResponse, never, OpenApiCreatePeriodicJobBody>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/periodic_jobs`,
      body: createPeriodicJobBody,
    })
  }

  public updatePeriodicJob(
    tenantId: string,
    projectId: string,
    periodicJobId: string,
    updatePeriodicJobBody: OpenApiUpdatePeriodicJobBody,
  ) {
    return this.request<GetPeriodicJobResponse, never, OpenApiUpdatePeriodicJobBody>({
      method: 'PATCH',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/periodic_jobs/${periodicJobId}`,
      body: updatePeriodicJobBody,
    })
  }

  public enablePeriodicJob(
    tenantId: string,
    projectId: string,
    periodicJobId: string,
    enablePeriodicJobBody: OpenApiEnablePeriodicJobBody,
  ) {
    return this.request<never, never, OpenApiEnablePeriodicJobBody>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/periodic_jobs/${periodicJobId}:enable`,
      body: enablePeriodicJobBody,
    })
  }

  public batchEnablePeriodicJob(
    tenantId: string,
    projectId: string,
    batchEnablePeriodicJobBody: OpenApiBatchEnablePeriodicJobBody,
  ) {
    return this.request<never, never, OpenApiBatchEnablePeriodicJobBody>({
      method: 'POST',
      resourceURI: `/tenants/${tenantId}/projects/${projectId}/periodic_jobs:enable`,
      body: batchEnablePeriodicJobBody,
    })
  }

  // Operation record
  public listOperationRecords(openApiListOperationRecordsQuery?: OpenApiListOperationRecordsQuery) {
    return this.request<ListOperationRecordsResponse, OpenApiListOperationRecordsQuery, never>({
      method: 'GET',
      resourceURI: `/operation_records`,
      query: openApiListOperationRecordsQuery,
    })
  }

  public getOperationRecord(operationRecordId: string) {
    return this.request<GetOperationRecordResponse, never, never>({
      method: 'GET',
      resourceURI: `/operation_records/${operationRecordId}`,
    })
  }
}
