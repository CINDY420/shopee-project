/* md5: fe123e80e7d66bdb9b3d8e4929824802 */
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
 * Interface name：UpdatePVSecret
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=1847&itf=11427
 */

import {IsNotEmpty, IsString} from 'class-validator'

export class PutEcpapiV2PvsecretReqDto {
  @IsNotEmpty()
  @IsString()
  'uuid': string

  @IsNotEmpty()
  @IsString()
  'serviceId': string

  @IsNotEmpty()
  @IsString()
  'serviceName': string

  @IsNotEmpty()
  @IsString()
  'name': string

  @IsNotEmpty()
  @IsString()
  'project': string

  @IsNotEmpty()
  @IsString()
  'module': string

  @IsNotEmpty()
  @IsString()
  'env': string

  @IsNotEmpty()
  @IsString()
  'az': string

  @IsNotEmpty()
  @IsString()
  'ussAppid': string

  @IsNotEmpty()
  @IsString()
  'ussAppSecret': string

  @IsNotEmpty()
  @IsString()
  'intranetDomain': string
}
export class PutEcpapiV2PvsecretResDto {
  @IsNotEmpty()
  @IsString()
  'uuid': string
}