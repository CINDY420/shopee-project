/* md5: 4927ad69ccbf916673dc910457a8ffdf */
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
 * Interface name：bind sdus
 * Rap url: http://rap.shopee.io/repository/editor?id=225&mod=1172&itf=7277
 */

import {IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, IsArray, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'
import {ItemEmpty} from '.'

export class Item141488 {
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

export class Item141477 {
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
  'sdu': string

  @IsNotEmpty()
  @IsString()
  'sdu_type': string

  @IsNotEmpty()
  @IsNumber()
  'updated_at': number

  @IsNotEmpty()
  @IsString()
  'version': string
}

export class Item141470 {
  @IsNotEmpty()
  @IsString()
  'spexible': string
}

export class Item141467 {
  @IsNotEmpty()
  @IsNumber()
  'created_at': number

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141470)
  'data': Item141470

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

export class Item141466 {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141488)
  'bind': Item141488

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141477)
  'sdu': Item141477

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141467)
  'service': Item141467
}

export class PostApisCmdbV2ServiceBindSduReqDto {
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
export class PostApisCmdbV2ServiceBindSduResDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item141466)
  @IsArray()
  'bounded': Item141466[]
}
