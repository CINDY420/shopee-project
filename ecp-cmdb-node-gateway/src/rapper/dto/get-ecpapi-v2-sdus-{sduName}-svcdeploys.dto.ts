/* md5: ba963e9d637f490f4fbca231ab3141b4 */
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
 * Interface name：ListServiceDeployments
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=906&itf=5319
 */

import {IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, IsArray, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'

export class Item99455 {
  @IsNotEmpty()
  @IsString()
  'image': string

  @IsNotEmpty()
  @IsString()
  'name': string

  @IsNotEmpty()
  @IsString()
  'phase': string

  @IsNotEmpty()
  @IsString()
  'tag': string

  @IsNotEmpty()
  @IsString()
  'timestamp': string
}

export class Item99451 {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item99455)
  @IsArray()
  'containers': Item99455[]

  @IsNotEmpty()
  @IsString()
  'orchestrator': string

  @IsNotEmpty()
  @IsString()
  'reason': string
}

export class Item99448 {
  @IsNotEmpty()
  @IsNumber()
  'canaryInstances': number

  @IsNotEmpty()
  @IsNumber()
  'cpu': number

  @IsNotEmpty()
  @IsNumber()
  'disk': number

  @IsNotEmpty()
  @IsNumber()
  'healthyInstances': number

  @IsNotEmpty()
  @IsNumber()
  'killingInstances': number

  @IsNotEmpty()
  @IsNumber()
  'lastDeployed': number

  @IsNotEmpty()
  @IsNumber()
  'mem': number

  @IsNotEmpty()
  @IsNumber()
  'releaseInstances': number

  @IsNotEmpty()
  @IsNumber()
  'runningInstances': number

  @IsNotEmpty()
  @IsNumber()
  'stagingInstances': number

  @IsNotEmpty()
  @IsNumber()
  'startingInstances': number

  @IsNotEmpty()
  @IsString()
  'state': string

  @IsNotEmpty()
  @IsNumber()
  'targetInstances': number

  @IsNotEmpty()
  @IsNumber()
  'unhealthyInstances': number

  @IsNotEmpty()
  @IsNumber()
  'unknownInstances': number
}

export class Item99435 {
  @IsNotEmpty()
  @IsString()
  'azV1': string

  @IsNotEmpty()
  @IsString()
  'azV2': string

  @IsNotEmpty()
  @IsString()
  'bundle': string

  @IsNotEmpty()
  @IsString()
  'cid': string

  @IsNotEmpty()
  @IsString()
  'cluster': string

  @IsNotEmpty()
  @IsString()
  'clusterType': string

  @IsNotEmpty()
  @IsString()
  'componentType': string

  @IsNotEmpty()
  @IsString()
  'deployEngine': string

  @IsNotEmpty()
  @IsString()
  'deployId': string

  @IsNotEmpty()
  @IsString()
  'env': string

  @IsNotEmpty()
  @IsString()
  'feature': string

  @IsNotEmpty()
  @IsString()
  'module': string

  @IsNotEmpty()
  @IsString()
  'project': string

  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item99451)
  'status': Item99451

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item99448)
  'summary': Item99448
}

export class GetEcpapiV2Sdus1SduNameSvcdeploysReqDto {
  @IsNotEmpty()
  @IsString()
  'sduName': string

  @IsOptional()
  @IsBoolean()
  'withdetail'?: boolean
}
export class GetEcpapiV2Sdus1SduNameSvcdeploysResDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item99435)
  @IsArray()
  'items': Item99435[]

  @IsNotEmpty()
  @IsNumber()
  'total': number
}
