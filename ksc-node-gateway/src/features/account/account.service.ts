import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { GetUserDetailResponse } from '@/features/account/dto/account.dto'

@Injectable()
export class AccountService {
  constructor(private readonly openApiService: OpenApiService) {}

  public async getUserDetail(userId: string): Promise<GetUserDetailResponse> {
    const { roles = [], displayName, email } = await this.openApiService.getUser(userId)
    const permissionLists = await Promise.all(
      roles.map(async (role) => {
        const { permissions = [] } = await this.openApiService.getRole(role.roleId)
        return permissions
      }),
    )
    const permissions = permissionLists.flat().reduce((result: Record<string, string[]>, item) => {
      const { resource, action } = item
      if (!result[resource]) {
        result[resource] = [action]
      } else if (result[resource].indexOf(action) === -1) {
        result[resource].push(action)
      }
      return result
    }, {})
    return {
      userId,
      displayName,
      email,
      roles,
      permissions,
    }
  }
}
