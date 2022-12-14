/* md5: e669082926319b19fb6b31c3ae137740 */
/* Rap repository id: 227 */
/* Rapper version: 2.1.14 */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

/**
 * This file is automatically generated by Rapper to synchronize the Rap platform interface, please do not modify
 * Rap repository url: https://rap.shopee.io/repository/editor?id=227
 */

/**
 * Interface name：ListDeployZone
 * Rap url: https://rap.shopee.io/repository/editor?id=227&mod=1393&itf=8802
 */

import {IsNotEmpty, IsString, IsOptional, IsNumber, ValidateNested, IsArray} from 'class-validator'
import {Type} from 'class-transformer'

export class Item193598 {
  @IsOptional()
  @IsString()
  'az'?: string

  @IsOptional()
  @IsString()
  'description'?: string

  @IsOptional()
  @IsString()
  'zoneName'?: string
}

export class GetEcpapiV2Service1ServiceNameDeployzonesReqDto {
  @IsNotEmpty()
  @IsString()
  'serviceName': string
}
export class GetEcpapiV2Service1ServiceNameDeployzonesResDto {
  @IsOptional()
  @IsNumber()
  'totalSize'?: number

  @IsOptional()
  @ValidateNested()
  @Type(() => Item193598)
  @IsArray()
  'items'?: Item193598[]
}
