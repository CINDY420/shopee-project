/* md5: c58afaa392181c44e40211b69a53a873 */
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
 * Rap url: http://rap.shopee.io/repository/editor?id=225&mod=1023&itf=6136
 */

import {IsOptional, IsString, IsNumber, IsNotEmpty, IsBoolean} from 'class-validator'
import {Type} from 'class-transformer'

export class PostV1DepconfBindingBindServiceReqDto {
  @IsOptional()
  @IsString()
  'project'?: string

  @IsOptional()
  @IsNumber()
  'service_id'?: number

  @IsOptional()
  @IsString()
  'service_name'?: string
}
export class PostV1DepconfBindingBindServiceResDto {
  @IsOptional()
  @IsNumber()
  'created_at'?: number

  @IsOptional()
  @IsNumber()
  'deleted_at'?: number

  @IsOptional()
  @IsString()
  'project'?: string

  @IsOptional()
  @IsNumber()
  'service_id'?: number

  @IsOptional()
  @IsString()
  'service_name'?: string

  /**
    请求业务结果
  */
  @IsNotEmpty()
  @IsBoolean()
  'success': boolean
}
