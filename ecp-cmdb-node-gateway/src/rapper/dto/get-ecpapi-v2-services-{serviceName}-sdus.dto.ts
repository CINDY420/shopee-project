/* md5: ecf23f25c1dde4c25a036cde6f4535b2 */
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
 * Interface name：ListSDUs
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=908&itf=5332
 */

import {IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, IsArray, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'

export class Item99594 {
  @IsNotEmpty()
  @IsString()
  'module': string

  @IsNotEmpty()
  @IsString()
  'project': string
}

export class Item99587 {
  @IsNotEmpty()
  @IsString()
  'cid': string

  @IsNotEmpty()
  @IsString()
  'deploymentLink': string

  @IsNotEmpty()
  @IsString()
  'env': string

  @IsNotEmpty()
  @IsArray()
  'idcs': any[]

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item99594)
  'identifier': Item99594

  @IsNotEmpty()
  @IsString()
  'resourceType': string

  @IsNotEmpty()
  @IsString()
  'sdu': string

  @IsNotEmpty()
  @IsNumber()
  'sduId': number

  @IsNotEmpty()
  @IsNumber()
  'serviceId': number

  @IsNotEmpty()
  @IsString()
  'serviceName': string

  @IsNotEmpty()
  @IsString()
  'version': string
}

export class GetEcpapiV2Services1ServiceNameSdusReqDto {
  @IsNotEmpty()
  @IsString()
  'serviceName': string

  /**
    support filter by env、cid, Example: ?filter_by=env==test;cid==CN.
  */
  @IsOptional()
  @IsString()
  'filterBy'?: string

  /**
    keyword to search, support sdu name.
  */
  @IsOptional()
  @IsString()
  'keyword'?: string

  @IsOptional()
  @IsBoolean()
  'isGroup'?: boolean
}
export class GetEcpapiV2Services1ServiceNameSdusResDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item99587)
  @IsArray()
  'items': Item99587[]

  @IsNotEmpty()
  @IsNumber()
  'totalSize': number
}
