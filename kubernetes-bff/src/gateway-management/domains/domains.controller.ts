import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { ListQueryDto } from 'applications-management/projects/dto/create-project.dto'
import { Pagination } from 'common/decorators/methods'
import { PaginateInterceptor } from 'common/interceptors/paginate.interceptor'
import { DomainsService } from './domains.service'
import { GetDomainParamsDto, GetDomainQueryDto, GetDomainResponseDto } from './dto'
import { GetDomainGroupParamsDto, GetDomainGroupResponseDto } from './dto/get-domainGroup.dto'
import { GetDomainGroupsResponseDto } from './dto/get-domainGroups.dto'

@ApiTags('Domains')
@Controller()
export class DomainsController {
  constructor(private readonly domainService: DomainsService) {}

  @Get('clusters/:clusterName/domains/:domainName')
  @ApiResponse({ type: GetDomainResponseDto, status: 200, description: 'get cluster domain detail' })
  @Pagination({
    key: 'rules',
    countKey: 'total',
    defaultOrder: 'priority'
  })
  @UseInterceptors(PaginateInterceptor)
  async getDomain(@Param() params: GetDomainParamsDto, @Query() query: GetDomainQueryDto) {
    const { clusterName, domainName } = params
    const { searchBy } = query
    return this.domainService.getDomain(clusterName, domainName, searchBy)
  }

  @Get('domainGroups')
  @Pagination({
    key: 'domainGroups',
    countKey: 'total',
    defaultOrder: 'name'
  })
  @UseInterceptors(PaginateInterceptor)
  @ApiResponse({ type: GetDomainGroupsResponseDto, status: 200, description: 'list domain groups info' })
  async getDomainGroups(@Query() query: ListQueryDto) {
    return this.domainService.getDomainGroups()
  }

  @Get('domainGroups/:domainGroupName')
  @Pagination({
    key: 'domain',
    countKey: 'total',
    defaultOrder: 'name'
  })
  @UseInterceptors(PaginateInterceptor)
  @ApiResponse({ type: GetDomainGroupResponseDto, status: 200, description: 'get domain group detail' })
  async getDomainGroup(@Param() params: GetDomainGroupParamsDto, @Query() query: ListQueryDto) {
    const { domainGroupName } = params

    return this.domainService.getDomainGroup(domainGroupName)
  }
}
