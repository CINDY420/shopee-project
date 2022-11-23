import { Injectable } from '@nestjs/common'
import { SreTicketService } from '@/features/ticket/sre-ticket.service'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { CreateSreAddRoleTicketFEBody, CreateSreAddRoleTicketBody } from '@/features/ticket/dto/sre-ticket.dto'
import { openApiSreTicketRoleMap, sreTicketEnvIdMap } from '@/common/constants/sre-ticket'
import { ListUserSreTicketsQuery } from '@/features/ticket/dto/ticket.dto'

@Injectable()
export class TicketService {
  constructor(private readonly openApiService: OpenApiService, private readonly sreTicketService: SreTicketService) {}

  async createSreAddRoleTicket(createSreAddRoleTicketFEBody: CreateSreAddRoleTicketFEBody) {
    const { reason, userId, tenantId, projectId, roleId } = createSreAddRoleTicketFEBody
    const userInfo = await this.openApiService.getUser(userId)
    const { email } = userInfo
    const roleInfo = await this.openApiService.getRole(roleId)
    const { roleName } = roleInfo
    const labelId = openApiSreTicketRoleMap[roleId]

    const deployEnv = process.env.NODE_ENV ?? 'test'
    const sreTicketEnvId = sreTicketEnvIdMap[deployEnv]

    const roleApprovers = await this.openApiService.listRoleApprovers({ roleId, tenantId, projectId })
    const approvers = roleApprovers.items.map((approverItem) => approverItem.email)

    // get tenant name by getTenantNameById, because new user has no permission to call tenant detail api
    const tenantName = await this.getTenantNameById(tenantId)
    let projectName: string | undefined
    if (projectId) {
      // get project name by getProjectNameById, because new user has no permission to call project detail api
      projectName = await this.getProjectNameById(tenantId, projectId)
    }

    const createSreAddRoleTicketBody: CreateSreAddRoleTicketBody = {
      order_title: `${email} apply for Batch Platform ${roleName} role of ${tenantName} tenant${
        projectId ? `, ${projectName} project` : ''
      }`,
      describe: reason,
      label_id: labelId,
      env_id: sreTicketEnvId,
      reporter_email: email,
      assigner_email: approvers,
      schema_value: { tenantId, projectId, userId, roleId },
    }
    return this.sreTicketService.createSreAddRoleTicket(createSreAddRoleTicketBody)
  }

  async listUserSreTickets(email: string, listUserSreTicketsQuery?: ListUserSreTicketsQuery) {
    const sreTickets = await this.sreTicketService.listSreTickets({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      reporter__email: email,
      status: listUserSreTicketsQuery?.status,
    })

    return { total: sreTickets.count, items: sreTickets.results }
  }

  private async getTenantNameById(tenantId: string) {
    // openApi default limit is 20
    const allTenants = await this.openApiService.listAllTenants({ limit: '5000' })
    const targetTenant = allTenants.items.find((tenant) => tenant.tenantId === tenantId)
    return targetTenant?.tenantCmdbName || targetTenant?.displayName
  }

  private async getProjectNameById(tenantId: string, projectId: string) {
    // openApi default limit is 20
    const allProjects = await this.openApiService.listAllProjects(tenantId, { limit: '5000' })
    const targetProject = allProjects.items.find((project) => project.projectId === projectId)
    return targetProject?.displayName
  }
}
