import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      errors.forEach((error: ValidationError) => {
        const { constraints } = error

        Object.values(constraints).forEach((errorMessage: string) => {
          if (errorMessage.includes('not exist')) {
            throw new NotFoundException(errorMessage)
          }
        })
      })
      throw new BadRequestException(errors)
    }
    return value
  }

  private toValidate(metatype: ArgumentMetadata['metatype']): boolean {
    const types: ArgumentMetadata['metatype'][] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
