/* md5: d95d4bc32823fb912ba2f3ce595fdaac */
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
 * Interface name：DeletePVPVC
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=1847&itf=11424
 */

import {IsNotEmpty, IsString} from 'class-validator'

export class DeleteEcpapiV2Pvpvc1UuidReqDto {
  @IsNotEmpty()
  @IsString()
  'uuid': string
}
export class DeleteEcpapiV2Pvpvc1UuidResDto {
  @IsNotEmpty()
  @IsString()
  'uuid': string
}