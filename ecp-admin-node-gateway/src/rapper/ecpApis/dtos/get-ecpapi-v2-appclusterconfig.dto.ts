/* md5: 3969463568b31f72d438f748717e9e4e */
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
 * Interface name：ListAppClusterConfig
 * Rap url: https://rap.shopee.io/repository/editor?id=227&mod=1385&itf=8764
 */

import {IsOptional, IsString, IsNumber, ValidateNested, IsArray} from 'class-validator'
import {Type} from 'class-transformer'

export class Item192931 {
  @IsOptional()
  @IsString()
  'azKey'?: string

  @IsOptional()
  @IsString()
  'cid'?: string

  @IsOptional()
  @IsString()
  'clusterUuid'?: string

  @IsOptional()
  @IsString()
  'cmdbTenantId'?: string

  @IsOptional()
  @IsString()
  'env'?: string

  @IsOptional()
  @IsString()
  'id'?: string

  @IsOptional()
  @IsString()
  'key'?: string

  @IsOptional()
  @IsString()
  'scope'?: string

  @IsOptional()
  @IsString()
  'segmentKey'?: string
}

export class GetEcpapiV2AppclusterconfigReqDto {
  /**
    If cmdb_tenant_id is non-empty, only return records under cmdb_tenant_id's tree
  */
  @IsOptional()
  @IsString()
  'cmdbTenantId'?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  'pageNum'?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  'pageSize'?: number

  /**
    scope,key,env,az_key,segment_key,cid,cluster_uuid
  */
  @IsOptional()
  @IsString()
  'filterBy'?: string
}
export class GetEcpapiV2AppclusterconfigResDto {
  @IsOptional()
  @IsString()
  'total'?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => Item192931)
  @IsArray()
  'items'?: Item192931[]
}
