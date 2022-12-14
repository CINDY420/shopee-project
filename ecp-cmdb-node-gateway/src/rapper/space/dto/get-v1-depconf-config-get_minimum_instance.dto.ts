/* md5: aa1f411d2d893c1a45836c37c8ecbf20 */
/* Rap repository id: 225 */
/* Rapper version: 2.1.13 */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

/**
 * This file is automatically generated by Rapper to synchronize the Rap platform interface, please do not modify
 * Rap repository url: http://rap.shopee.io/repository/editor?id=225
 */

/**
 * Interface name：Returns minimum instance count for this service
 * Rap url: http://rap.shopee.io/repository/editor?id=225&mod=1025&itf=6151
 */

import {IsOptional, IsString, IsNotEmpty, IsBoolean, IsNumber} from 'class-validator'
import {Type} from 'class-transformer'

export class GetV1DepconfConfigGetMinimumInstanceReqDto {
  /**
    Project module name (smm-api)
  */
  @IsOptional()
  @IsString()
  'project'?: string

  /**
    environment
  */
  @IsNotEmpty()
  @IsString()
  'env': string

  /**
    cid
  */
  @IsNotEmpty()
  @IsString()
  'cid': string

  /**
    az
  */
  @IsNotEmpty()
  @IsString()
  'az': string
}
export class GetV1DepconfConfigGetMinimumInstanceResDto {
  /**
    请求业务结果
  */
  @IsNotEmpty()
  @IsBoolean()
  'success': boolean

  @IsOptional()
  @IsNumber()
  'value'?: number
}
