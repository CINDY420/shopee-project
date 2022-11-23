import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'

export class CreateCommitBody {
  @IsNotEmpty()
  @IsString()
  comment: string

  @IsNotEmpty()
  @IsString()
  data: string

  @IsOptional()
  @IsString()
  email?: string

  @IsNotEmpty()
  @IsString()
  env: string

  @IsOptional()
  @IsObject()
  extra_data?: Record<string, unknown>

  @IsOptional()
  @IsString()
  project?: string

  @IsNotEmpty()
  @IsNumber()
  service_id: number

  @IsOptional()
  @IsString()
  service_meta_type?: string
}
