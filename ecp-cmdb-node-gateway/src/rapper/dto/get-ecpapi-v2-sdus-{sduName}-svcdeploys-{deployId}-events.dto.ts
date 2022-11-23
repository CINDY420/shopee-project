/* md5: 413076ade2e99e01e560f746df74fbbe */
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
 * Interface name：GetDeploymentEvents
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=906&itf=10560
 */

import {IsNotEmpty, IsString, IsOptional, IsNumber, ValidateNested, IsArray} from 'class-validator'
import {Type} from 'class-transformer'

export class Item375691 {
  @IsNotEmpty()
  @IsString()
  'createTime': string

  @IsNotEmpty()
  @IsString()
  'hostIp': string

  @IsNotEmpty()
  @IsString()
  'kind': string

  @IsNotEmpty()
  @IsString()
  'message': string

  @IsNotEmpty()
  @IsString()
  'name': string

  @IsNotEmpty()
  @IsString()
  'namespace': string

  @IsNotEmpty()
  @IsString()
  'podIp': string

  @IsNotEmpty()
  @IsString()
  'reason': string
}

export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdEventsReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @IsString()
  'deployId': string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  'pageCount'?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  'pageNum'?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  'startTime'?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  'endTime'?: number

  @IsOptional()
  @IsString()
  'filter'?: string

  @IsOptional()
  @IsString()
  'order'?: string
}
export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdEventsResDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item375691)
  @IsArray()
  'events': Item375691[]

  @IsNotEmpty()
  @IsString({each: true})
  @IsArray()
  'kindList': string[]

  @IsNotEmpty()
  @IsNumber()
  'total': number
}