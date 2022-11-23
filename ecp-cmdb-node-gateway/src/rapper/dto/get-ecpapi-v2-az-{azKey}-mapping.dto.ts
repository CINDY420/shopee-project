/* md5: d40c07c11e83f9828b11ce24012be36f */
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
 * Interface name：QueryAZMapping
 * Rap url: http://rap.shopee.io/repository/editor?id=185&mod=903&itf=5313
 */

import {IsNotEmpty, IsString, IsOptional, ValidateNested, IsArray} from 'class-validator'
import {Type} from 'class-transformer'

export class Item99378 {
  @IsOptional()
  @IsString()
  'azKey'?: string

  @IsOptional()
  @IsString()
  'version'?: string
}

export class GetEcpapiV2Az1AzKeyMappingReqDto {
  @IsNotEmpty()
  @IsString()
  'azKey': string
}
export class GetEcpapiV2Az1AzKeyMappingResDto {
  @IsOptional()
  @IsString()
  'version'?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => Item99378)
  @IsArray()
  'items'?: Item99378[]
}