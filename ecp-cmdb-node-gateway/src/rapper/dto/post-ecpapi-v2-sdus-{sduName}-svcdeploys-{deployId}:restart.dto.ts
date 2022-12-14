/* md5: b36882513ccc6ba10c64f9f31341d887 */
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
 * Interface name：RestartDeployment
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=906&itf=5325
 */

import {IsNotEmpty, IsString, IsArray} from 'class-validator'

export class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRestartReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @IsString()
  'deployId': string

  @IsNotEmpty()
  @IsString({each: true})
  @IsArray()
  'phases': string[]
}
export class PostEcpapiV2Sdus1SduNameSvcdeploys1DeployIdRestartResDto {}
