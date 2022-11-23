/* md5: 6da754a538d8a7641ac833cdd6ee1ba5 */
/* Rap repository id: 225 */
/* Rapper version: 2.1.13 */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

/**
 * This file is automatically generated by Rapper to synchronize the Rap platform interface, please do not modify
 * Rap repository url: http://rap.shopee.io/repository/editor?id=225
 */

/**
 * Interface name：Get service config
 * Rap url: http://rap.shopee.io/repository/editor?id=225&mod=1025&itf=6150
 */

import {IsOptional, IsString, IsNotEmpty, ValidateNested, IsArray, IsBoolean, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'
import {ItemEmpty} from '.'

export class Item114040 {
  @IsOptional()
  @IsString()
  'comment'?: string

  @IsOptional()
  @IsNumber()
  'commit_id'?: number

  @IsOptional()
  @IsString()
  'created_by'?: string

  @IsOptional()
  @IsNumber()
  'created_ts'?: number

  @IsOptional()
  @IsString()
  'data'?: string

  @IsOptional()
  @IsNumber()
  'deleted_at'?: number

  @IsOptional()
  @IsString()
  'env'?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ItemEmpty)
  'extra_data'?: ItemEmpty

  @IsOptional()
  @IsNumber()
  'id'?: number

  @IsOptional()
  @IsString()
  'modified_by'?: string

  @IsOptional()
  @IsNumber()
  'modified_ts'?: number

  @IsOptional()
  @IsString()
  'project'?: string

  @IsOptional()
  @IsNumber()
  'service_id'?: number

  @IsOptional()
  @IsString()
  'service_meta_type'?: string
}

export class GetV1DepconfConfigGetInfoReqDto {
  /**
    Project module name (smm-api). Specify this or service_id
  */
  @IsOptional()
  @IsString()
  'project'?: string

  /**
    CMDB Service ID. Specify this or project
  */
  @IsOptional()
  @IsString()
  'service_id'?: string

  /**
    environment
  */
  @IsNotEmpty()
  @IsString()
  'env': string
}
export class GetV1DepconfConfigGetInfoResDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Item114040)
  @IsArray()
  'configurations'?: Item114040[]

  /**
    请求业务结果
  */
  @IsNotEmpty()
  @IsBoolean()
  'success': boolean

  @IsOptional()
  @IsNumber()
  'total_count'?: number
}