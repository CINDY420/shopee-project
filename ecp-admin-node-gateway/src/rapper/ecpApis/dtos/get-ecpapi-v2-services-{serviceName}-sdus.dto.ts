/* md5: 3e967776bbfa88aebcc70444c6d1ad29 */
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
 * Interface name：ListServiceSDU
 * Rap url: https://rap.shopee.io/repository/editor?id=227&mod=1392&itf=8801
 */

import {IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, IsArray, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'

export class Item193591 {
  @IsOptional()
  @IsString()
  'module'?: string

  @IsOptional()
  @IsString()
  'project'?: string
}

export class Item193581 {
  @IsOptional()
  @IsString()
  'cid'?: string

  @IsOptional()
  @IsString()
  'deploymentLink'?: string

  @IsOptional()
  @IsString()
  'env'?: string

  @IsOptional()
  @IsString({each: true})
  @IsArray()
  'idcs'?: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => Item193591)
  'identifier'?: Item193591

  @IsOptional()
  @IsString()
  'resourceType'?: string

  @IsOptional()
  @IsString()
  'sdu'?: string

  @IsOptional()
  @IsNumber()
  'sduId'?: number

  @IsOptional()
  @IsNumber()
  'serviceId'?: number

  @IsOptional()
  @IsString()
  'serviceName'?: string

  @IsOptional()
  @IsString()
  'version'?: string
}

export class GetEcpapiV2Services1ServiceNameSdusReqDto {
  @IsNotEmpty()
  @IsString()
  'serviceName': string

  /**
    support filter by env、cid, Example: ?filter_by=env==test;cid==CN
  */
  @IsOptional()
  @IsString()
  'filterBy'?: string

  /**
    keyword to search, support sdu name
  */
  @IsOptional()
  @IsString()
  'keyword'?: string

  @IsOptional()
  @IsBoolean()
  'isGroup'?: boolean
}
export class GetEcpapiV2Services1ServiceNameSdusResDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Item193581)
  @IsArray()
  'items'?: Item193581[]

  @IsOptional()
  @IsNumber()
  'totalSize'?: number
}