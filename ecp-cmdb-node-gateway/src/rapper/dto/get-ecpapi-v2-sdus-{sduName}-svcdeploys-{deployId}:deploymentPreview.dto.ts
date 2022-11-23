/* md5: ec4f3ed5d9121bc445670315336abf00 */
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
 * Interface name：GetDeploymentPreview
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=906&itf=7396
 */

import {IsNotEmpty, IsString, ValidateNested, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'

export class Item143981 {
  @IsNotEmpty()
  @IsString()
  'az': string

  @IsNotEmpty()
  @IsString()
  'tag': string

  @IsNotEmpty()
  @IsNumber()
  'totalInstances': number
}

export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdDeploymentPreviewReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @IsString()
  'deployId': string

  @IsNotEmpty()
  @IsString()
  'deploymentId': string
}
export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdDeploymentPreviewResDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item143981)
  'old': Item143981

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item143981)
  'new': Item143981
}
