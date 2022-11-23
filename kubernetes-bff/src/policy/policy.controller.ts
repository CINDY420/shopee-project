import { Controller, Post, Body, Get, Query, Delete, Param, UseGuards } from '@nestjs/common'

import { AdminGuard } from 'common/guards/admin.guard'
import { PolicyService } from 'policy/policy.service'
import { ICreatePolicyDTO } from 'policy/dto/create.policy.dto'

@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @UseGuards(AdminGuard)
  @Post()
  async createPolicy(@Body() body: ICreatePolicyDTO) {
    const res = await this.policyService.addPolicy(body)
    return res
  }

  @Get()
  async getPolicy(
    @Query('source') source: string,
    @Query('role') role: number,
    @Query('effectiveSourceId') effectiveSourceId: string
  ) {
    const res = await this.policyService.getPolicy(source, effectiveSourceId, role)
    return res
  }

  @Get('/list')
  async getPolicyList(@Query('size') size: number, @Query('from') from: number) {
    const res = await this.policyService.getPolicyList(size, from)
    return res
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async delPolicy(@Param('id') id: string) {
    try {
      await this.policyService.delPolicy(id)
    } catch (error) {
      console.error(error)
    }
  }
}
