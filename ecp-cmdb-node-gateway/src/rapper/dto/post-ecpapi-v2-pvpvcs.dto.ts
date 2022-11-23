/* md5: 04632d04b35c0315459ba659827a43de */
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
 * Interface name：CreatePvPvc
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=1847&itf=11422
 */

import {IsNotEmpty, IsString} from 'class-validator'

export class PostEcpapiV2PvpvcsReqDto {
  @IsNotEmpty()
  @IsString()
  'name': string

  @IsNotEmpty()
  @IsString()
  'serviceId': string

  @IsNotEmpty()
  @IsString()
  'serviceName': string

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
  'cid': string

  @IsNotEmpty()
  @IsString()
  'az': string

  @IsNotEmpty()
  @IsString()
  'secret': string

  @IsNotEmpty()
  @IsString()
  'accessMode': string

  @IsNotEmpty()
  @IsString()
  'subpath': string
}
export class PostEcpapiV2PvpvcsResDto {
  @IsNotEmpty()
  @IsString()
  'uuid': string
}
