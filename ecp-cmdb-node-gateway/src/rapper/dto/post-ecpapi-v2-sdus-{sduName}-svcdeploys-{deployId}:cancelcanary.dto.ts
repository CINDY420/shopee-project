/* md5: 52e6896e96e23338152ff9d12c0ff531 */
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
 * Interface name：DeploymentCancelCanary
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=906&itf=5322
 */

import {IsNotEmpty, IsString} from 'class-validator'

export class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdCancelcanaryReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @IsString()
  'deployId': string
}
export class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdCancelcanaryResDto {}
