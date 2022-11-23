import { IsString } from 'class-validator'
import { ApiExtraModels, ApiProperty, getSchemaPath, PartialType } from '@nestjs/swagger'
import { IsForm } from '@/common/decorators/class-validator/is-form'
import { ScaleDeploymentTicketForm } from '@/features/ticket/dto/shopee-ticket-center/shopee-ticket.model'

export class UpdateTicketFormParam {
  @IsString()
  ticketId: string
}

export class ScaleDeploymentTicketFormWithAuditResponse extends PartialType(ScaleDeploymentTicketForm) {
  auditResponse?: string
}

@ApiExtraModels(ScaleDeploymentTicketFormWithAuditResponse)
export class UpdateTicketFormBody {
  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(ScaleDeploymentTicketFormWithAuditResponse) }],
  })
  @IsForm()
  form: Record<string, string | number>
}
