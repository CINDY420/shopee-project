/* md5: dc802320bc72407e88055c018d7c8f3f */
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
 * Interface name：ListDeployHistory
 * Rap url: https://rap.shopee.io/repository/editor?id=227&mod=1388&itf=8777
 */

import {IsNotEmpty, IsString, IsOptional, IsNumber, ValidateNested, IsArray} from 'class-validator'
import {Type} from 'class-transformer'
import {ItemEmpty} from '.'

export class Item167975 {
  @IsOptional()
  @ValidateNested()
  @Type(() => ItemEmpty)
  'status'?: ItemEmpty

  @IsOptional()
  @ValidateNested()
  @Type(() => ItemEmpty)
  'summary'?: ItemEmpty
}

export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdHistoryReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @IsString()
  'deployId': string
}
export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdHistoryResDto {
  @IsOptional()
  @IsNumber()
  'totalSize'?: number

  @IsOptional()
  @ValidateNested()
  @Type(() => Item167975)
  @IsArray()
  'items'?: Item167975[]
}
