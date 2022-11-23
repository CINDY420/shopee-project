/* md5: 29b40066bd3f300e1900e91dba16c7db */
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
 * Interface name：GetServiceDeploymentMeta
 * Rap url: https://rap.shopee.io/repository/editor?id=227&mod=1388&itf=8778
 */

import {IsNotEmpty, IsString, ValidateNested, IsOptional, IsArray, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'

export class Item193357 {
  @IsOptional()
  @IsString()
  'image'?: string

  @IsOptional()
  @IsString()
  'name'?: string

  @IsOptional()
  @IsString()
  'phase'?: string

  @IsOptional()
  @IsString()
  'tag'?: string

  @IsOptional()
  @IsString()
  'timestamp'?: string
}

export class Item193335 {
  @IsOptional()
  @ValidateNested()
  @Type(() => Item193357)
  @IsArray()
  'containers'?: Item193357[]

  @IsOptional()
  @IsString()
  'orchestrator'?: string

  @IsOptional()
  @IsString()
  'reason'?: string
}

export class Item193334 {
  @IsOptional()
  @IsNumber()
  'canaryInstances'?: number

  @IsOptional()
  @IsNumber()
  'cpu'?: number

  @IsOptional()
  @IsNumber()
  'disk'?: number

  @IsOptional()
  @IsNumber()
  'healthyInstances'?: number

  @IsOptional()
  @IsNumber()
  'killingInstances'?: number

  @IsOptional()
  @IsNumber()
  'lastDeployed'?: number

  @IsOptional()
  @IsNumber()
  'mem'?: number

  @IsOptional()
  @IsNumber()
  'releaseInstances'?: number

  @IsOptional()
  @IsNumber()
  'runningInstances'?: number

  @IsOptional()
  @IsString()
  'sduName'?: string

  @IsOptional()
  @IsNumber()
  'stagingInstances'?: number

  @IsOptional()
  @IsNumber()
  'startingInstances'?: number

  @IsOptional()
  @IsString()
  'state'?: string

  @IsOptional()
  @IsNumber()
  'targetInstances'?: number

  @IsOptional()
  @IsNumber()
  'unhealthyInstances'?: number

  @IsOptional()
  @IsNumber()
  'unknownInstances'?: number
}

export class Item193323 {
  @IsOptional()
  @IsString()
  'azV1'?: string

  @IsOptional()
  @IsString()
  'azV2'?: string

  @IsOptional()
  @IsString()
  'bundle'?: string

  @IsOptional()
  @IsString()
  'cid'?: string

  @IsOptional()
  @IsString()
  'cluster'?: string

  @IsOptional()
  @IsString()
  'clusterType'?: string

  @IsOptional()
  @IsString()
  'componentType'?: string

  @IsOptional()
  @IsString()
  'deployEngine'?: string

  @IsOptional()
  @IsString()
  'deployId'?: string

  @IsOptional()
  @IsString()
  'env'?: string

  @IsOptional()
  @IsString()
  'feature'?: string

  @IsOptional()
  @IsString()
  'module'?: string

  @IsOptional()
  @IsString()
  'project'?: string

  @IsOptional()
  @IsString()
  'sduName'?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => Item193335)
  'status'?: Item193335

  @IsOptional()
  @ValidateNested()
  @Type(() => Item193334)
  'summary'?: Item193334
}

export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @IsString()
  'deployId': string
}
export class GetEcpapiV2Sdus1SduNameSvcdeploys1DeployIdMetaResDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Item193323)
  'deployment'?: Item193323
}
