/* md5: ca32fc9221062887024a65df0699db95 */
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
 * Interface name：AddClusterMeta
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=905&itf=5316
 */

import {IsOptional, IsString, IsBoolean} from 'class-validator'

export class PostEcpapiV2ClustermetaReqDto {
  @IsOptional()
  @IsString()
  'uuid'?: string

  @IsOptional()
  @IsString()
  'clusterKey'?: string

  @IsOptional()
  @IsString()
  'displayName'?: string

  @IsOptional()
  @IsString()
  'kubeConfig'?: string

  @IsOptional()
  @IsString()
  'azV1'?: string

  @IsOptional()
  @IsString()
  'azV2'?: string

  @IsOptional()
  @IsString()
  'monitoringUrl'?: string

  @IsOptional()
  @IsString()
  'kubeApiserverType'?: string

  @IsOptional()
  @IsString()
  'ecpVersion'?: string

  @IsOptional()
  @IsBoolean()
  'handleByGalio'?: boolean
}
export class PostEcpapiV2ClustermetaResDto {}