/* md5: f863196becc9b1330e3c6122dda371b4 */
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
 * Interface name：IsPVSecretExist
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=1847&itf=11442
 */

import {IsNotEmpty, IsString, IsBoolean} from 'class-validator'

export class PostEcpapiV2PvsecretIsexistReqDto {
  @IsNotEmpty()
  @IsString()
  'serviceId': string

  @IsNotEmpty()
  @IsString()
  'ussAppid': string

  @IsNotEmpty()
  @IsString()
  'env': string
}
export class PostEcpapiV2PvsecretIsexistResDto {
  @IsNotEmpty()
  @IsBoolean()
  'exist': boolean
}