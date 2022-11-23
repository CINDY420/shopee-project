import { OmitType } from '@nestjs/mapped-types'
import { IsEnum, IsString, ValidateIf, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ScaleDeploymentTicketExtraInfo, Ticket, TICKET_TYPE } from '@/features/ticket/dto/ticket-service/ticket.model'
import { ScaleDeploymentTicketForm } from '@/features/ticket/dto/shopee-ticket-center/shopee-ticket.model'

/**
 * @property {type}
 * 由于创建工单可能有很多种情况（虽然截止至2021.12.13只有scale一种工单）
 * 所以这里增加一个工单类型的枚举，以便业务逻辑区分
 * 也因此，此类在Controller层仅作参数类型校验，实际用作业务的时候，需要用@nestjs/mapped-types的OmitType，
 * 去剔除所有不属于此类型工单的属性然后导出给Service层使用，比如下面的CreateScaleDeploymentTicketParams
 *
 * 之后每新增一种工单，由于工单的form参数是不一致的，所以需要在下面增加一个xxxForm字段并配置ValidateIf来做参数校验
 * 并且其他导出的类需要剔除这个字段，以防止在Service层误用
 */
export class CreateTicketBody {
  @IsEnum(TICKET_TYPE)
  type: TICKET_TYPE

  @IsString()
  title: string

  @ValidateIf((object: CreateTicketBody) => object.type === TICKET_TYPE.DEPLOYMENT_SCALE)
  @ValidateNested()
  @Type(() => ScaleDeploymentTicketForm)
  scaleDeploymentTicketForm: ScaleDeploymentTicketForm

  @ValidateIf((object: CreateTicketBody) => object.type === TICKET_TYPE.DEPLOYMENT_SCALE)
  @ValidateNested()
  @Type(() => ScaleDeploymentTicketExtraInfo)
  scaleDeploymentTicketExtraInfo: ScaleDeploymentTicketExtraInfo
}

export class CreateScaleDeploymentTicketBody extends OmitType(CreateTicketBody, ['type']) {}

export class CreateTicketResponse extends Ticket {}
