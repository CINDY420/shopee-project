/* md5: 1ef589c0c1193ca917ac35d811d35d13 */
/* Rap repository id: 185 */
/* Rapper version: 2.1.13 */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

/**
 * This file is automatically generated by Rapper to synchronize the Rap platform interface, please do not modify
 * Rap repository url: http://rap.shopee.io/repository/editor?id=185
 */

/**
 * Interface name：ListPVSecret
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=1847&itf=11430
 */

import {IsNotEmpty, IsString, ValidateNested, IsArray} from 'class-validator'
import {Type} from 'class-transformer'

export class Item456294 {
  @IsNotEmpty()
  @IsString()
  'az': string

  @IsNotEmpty()
  @IsString()
  'env': string

  @IsNotEmpty()
  @IsString()
  'id': string

  @IsNotEmpty()
  @IsString()
  'intranetDomain': string

  @IsNotEmpty()
  @IsString()
  'module': string

  @IsNotEmpty()
  @IsString()
  'name': string

  @IsNotEmpty()
  @IsString()
  'project': string

  @IsNotEmpty()
  @IsString()
  'serviceId': string

  @IsNotEmpty()
  @IsString()
  'serviceName': string

  @IsNotEmpty()
  @IsString()
  'updatedAt': string

  @IsNotEmpty()
  @IsString()
  'ussAppid': string

  @IsNotEmpty()
  @IsString()
  'ussAppSecret': string

  @IsNotEmpty()
  @IsString()
  'uuid': string
}

export class GetEcpapiV2Pvsecrets1ServiceIdReqDto {
  @IsNotEmpty()
  @IsString()
  'serviceId': string
}
export class GetEcpapiV2Pvsecrets1ServiceIdResDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item456294)
  @IsArray()
  'pvSecret': Item456294[]
}
