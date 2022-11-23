import { Components } from '@/features/deploy-config/entities/component.entity'
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'

@ApiExtraModels(Components)
export class ListComponentResponse {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      $ref: getSchemaPath(Components),
    },
  })
  components: {
    [key: string]: Components
  }
}
