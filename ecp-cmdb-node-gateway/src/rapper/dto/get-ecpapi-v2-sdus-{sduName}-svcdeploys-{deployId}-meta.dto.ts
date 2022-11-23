/* md5: 345a124400be230b66b79536d84536fd */
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
 * Interface name：GetServiceDeploymentMeta
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=906&itf=5320
 */

import {IsNotEmpty, IsString, ValidateNested, IsArray, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'

export class Item99508 {
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
}

export class Item99485 {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item99508)
  @IsArray()
  'containers': Item99508[]

  @IsNotEmpty()
  @IsString()
  'orchestrator': string

  @IsNotEmpty()
  @IsString()
  'reason': string
}

export class Item99484 {
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

export class Item99477 {
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
  @Type(() => Item99485)
  'status': Item99485

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item99484)
  'summary': Item99484
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
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item99477)
  'deployment': Item99477
}