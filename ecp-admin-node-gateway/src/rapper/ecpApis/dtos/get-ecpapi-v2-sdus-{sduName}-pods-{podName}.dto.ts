/* md5: 1a3a4a188a5944d56aaff25f50b579bb */
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
 * Interface name：GetSDUPod
 * Rap url: https://rap.shopee.io/repository/editor?id=227&mod=1391&itf=8794
 */

import {IsNotEmpty, IsString, IsOptional, ValidateNested, IsArray, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'

export class Item193485 {
  @IsOptional()
  @IsString()
  'containerId'?: string

  @IsOptional()
  @IsString()
  'contianerName'?: string
}

export class Item193472 {
  @IsOptional()
  @IsString()
  'cid'?: string

  @IsOptional()
  @IsString()
  'clusterName'?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => Item193485)
  @IsArray()
  'containerInfo'?: Item193485[]

  @IsOptional()
  @IsNumber()
  'createdTime'?: number

  @IsOptional()
  @IsString()
  'env'?: string

  @IsOptional()
  @IsString()
  'idc'?: string

  @IsOptional()
  @IsNumber()
  'lastRestartTime'?: number

  @IsOptional()
  @IsString()
  'namespace'?: string

  @IsOptional()
  @IsString()
  'nodeIp'?: string

  @IsOptional()
  @IsString()
  'nodeName'?: string

  @IsOptional()
  @IsString()
  'phase'?: string

  @IsOptional()
  @IsString()
  'podIp'?: string

  @IsOptional()
  @IsString()
  'podName'?: string

  @IsOptional()
  @IsNumber()
  'podPort'?: number

  @IsOptional()
  @IsNumber()
  'restartCount'?: number

  @IsOptional()
  @IsString()
  'sdu'?: string

  @IsOptional()
  @IsString()
  'status'?: string

  @IsOptional()
  @IsString()
  'tag'?: string
}

export class GetEcpapiV2Sdus1SduNamePods1PodNameReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @IsString()
  'podName': string

  /**
    support filter by env、cid, Example: ?filter_by=env==test;cid==CN
  */
  @IsOptional()
  @IsString()
  'filterBy'?: string
}
export class GetEcpapiV2Sdus1SduNamePods1PodNameResDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Item193472)
  'pod'?: Item193472
}
