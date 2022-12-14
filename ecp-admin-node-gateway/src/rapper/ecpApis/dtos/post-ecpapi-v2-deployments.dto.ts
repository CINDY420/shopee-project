/* md5: c55dd1c940ea7b1eb4e15fa7b12b9e8a */
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
 * Interface name：CreateDeployment
 * Rap url: https://rap.shopee.io/repository/editor?id=227&mod=1388&itf=8775
 */

import {ValidateNested, IsOptional, IsArray, IsBoolean, IsString} from 'class-validator'
import {Type} from 'class-transformer'

export class Item193250 {
  @IsOptional()
  @IsString()
  'settings'?: string

  @IsOptional()
  @IsString()
  'type'?: string
}

export class Item193241 {
  @IsOptional()
  @IsString()
  'settings'?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => Item193250)
  @IsArray()
  'traits'?: Item193250[]

  @IsOptional()
  @IsString()
  'type'?: string
}

export class Item193236 {
  @IsOptional()
  @IsString()
  'az'?: string

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
  'serviceName'?: string
}

export class PostEcpapiV2DeploymentsReqDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Item193236)
  'metadata'?: Item193236

  @IsOptional()
  @ValidateNested()
  @Type(() => Item193241)
  @IsArray()
  'components'?: Item193241[]

  @IsOptional()
  @IsBoolean()
  'canary'?: boolean
}
export class PostEcpapiV2DeploymentsResDto {
  @IsOptional()
  @IsString()
  'deployId'?: string
}
