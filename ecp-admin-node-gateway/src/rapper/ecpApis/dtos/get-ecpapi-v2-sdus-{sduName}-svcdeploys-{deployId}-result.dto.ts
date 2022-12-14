/* md5: 4f0d84c31284d605baa5e86254e0b091 */
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
 * Interface name：GetDeploymentResult
 * Rap url: https://rap.shopee.io/repository/editor?id=227&mod=1388&itf=8779
 */

import {IsNotEmpty, IsString, ValidateNested, IsOptional} from 'class-validator'
import {Type} from 'class-transformer'
import {ItemEmpty} from '.'

export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @IsString()
  'deployId': string
}
export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdResultResDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ItemEmpty)
  'status'?: ItemEmpty

  @IsOptional()
  @IsString()
  'reason'?: string
}
