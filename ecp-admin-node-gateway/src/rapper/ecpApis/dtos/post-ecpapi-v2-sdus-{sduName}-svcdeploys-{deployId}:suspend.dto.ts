/* md5: 003e4f29c88d3076816b0bb8f79bb274 */
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
 * Interface name：SuspendDeployment
 * Rap url: https://rap.shopee.io/repository/editor?id=227&mod=1388&itf=8789
 */

import {IsNotEmpty, IsString} from 'class-validator'

export class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdSuspendReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @IsString()
  'deployId': string
}
export class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdSuspendResDto {}
