/* md5: 53f246046c6ce519325cc019c2f5d001 */
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
 * Interface name：unbind sdu
 * Rap url: http://rap.shopee.io/repository/editor?id=225&mod=1172&itf=7278
 */

import {IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, IsArray, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'
import {ItemEmpty} from '.'

export class Item141525 {
  @IsNotEmpty()
  @IsNumber()
  'created_at': number

  @IsNotEmpty()
  @IsBoolean()
  'enabled': boolean

  @IsNotEmpty()
  @IsNumber()
  'sdu_id': number

  @IsNotEmpty()
  @IsNumber()
  'service_id': number

  @IsNotEmpty()
  @IsNumber()
  'service_sdu_relation_id': number

  @IsNotEmpty()
  @IsNumber()
  'updated_at': number
}

export class Item141514 {
  @IsNotEmpty()
  @IsString()
  'cid': string

  @IsNotEmpty()
  @IsNumber()
  'created_at': number

  @IsNotEmpty()
  @IsString()
  'deployment_link': string

  @IsNotEmpty()
  @IsString()
  'env': string

  @IsNotEmpty()
  @IsString({each: true})
  @IsArray()
  'idcs': string[]

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ItemEmpty)
  'label': ItemEmpty

  @IsNotEmpty()
  @IsString()
  'resource_type': string

  @IsNotEmpty()
  @IsString()
  'sdu': string

  @IsNotEmpty()
  @IsNumber()
  'updated_at': number

  @IsNotEmpty()
  @IsString()
  'version': string
}

export class Item141507 {
  @IsNotEmpty()
  @IsString()
  'spexible': string
}

export class Item141504 {
  @IsNotEmpty()
  @IsNumber()
  'created_at': number

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141507)
  'data': Item141507

  @IsNotEmpty()
  @IsBoolean()
  'enabled': boolean

  @IsNotEmpty()
  @IsNumber()
  'service_id': number

  @IsNotEmpty()
  @IsString()
  'service_name': string

  @IsNotEmpty()
  @IsArray()
  'service_owners': any[]

  @IsNotEmpty()
  @IsNumber()
  'updated_at': number

  @IsNotEmpty()
  @IsString()
  'updated_by': string
}

export class Item141503 {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141514)
  'sdu': Item141514

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141504)
  'service': Item141504

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141525)
  'unbind': Item141525
}

export class PostApisCmdbV2ServiceUnbindSduReqDto {
  @IsNotEmpty()
  @IsString()
  'service_name': string

  /**
    CONTAINER / PHYSICAL / STATIC / AUTODISCOVERY
  */
  @IsNotEmpty()
  @IsString()
  'resource_type': string

  @IsNotEmpty()
  @IsString()
  'sdu': string

  /**
    默认false
  */
  @IsOptional()
  @IsBoolean()
  'force'?: boolean
}
export class PostApisCmdbV2ServiceUnbindSduResDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141503)
  @IsArray()
  'unbounded': Item141503[]
}
