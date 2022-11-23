/* md5: 3053188e1a83f3832a4ac2ec2ed7e590 */
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
 * Interface name：bulk get deployments
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=906&itf=11358
 */

import {IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'

export class Item437263 {
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

export class Item437260 {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item437263)
  @IsArray()
  'containers': Item437263[]

  @IsNotEmpty()
  @IsString()
  'orchestrator': string

  @IsNotEmpty()
  @IsString()
  'reason': string
}

export class Item437243 {
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
  @IsString()
  'sduName': string

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

export class Item437228 {
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
  @Type(() => Item437260)
  'status': Item437260

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item437243)
  'summary': Item437243
}

export class PostEcpapiV2Services1ServiceNameBulkGetDeploymentsReqDto {
  @IsNotEmpty()
  @IsString()
  'serviceName': string

  @IsNotEmpty()
  @IsString({each: true})
  @IsArray()
  'sdus': string[]
}
export class PostEcpapiV2Services1ServiceNameBulkGetDeploymentsResDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item437228)
  @IsArray()
  'items': Item437228[]

  @IsNotEmpty()
  @IsNumber()
  'total': number
}
