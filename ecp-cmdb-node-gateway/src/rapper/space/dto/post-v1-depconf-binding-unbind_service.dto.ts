/* md5: ad44a325da11cf46c5f804ee8512d12f */
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
 * Interface name：Binds a cmdb service to a project
 * Rap url: http://rap.shopee.io/repository/editor?id=225&mod=1023&itf=6138
 */

import {IsOptional, IsNumber, IsNotEmpty, IsBoolean} from 'class-validator'
import {Type} from 'class-transformer'

export class PostV1DepconfBindingUnbindServiceReqDto {
  @IsOptional()
  @IsNumber()
  'service_id'?: number
}
export class PostV1DepconfBindingUnbindServiceResDto {
  /**
    请求业务结果
  */
  @IsNotEmpty()
  @IsBoolean()
  'success': boolean
}