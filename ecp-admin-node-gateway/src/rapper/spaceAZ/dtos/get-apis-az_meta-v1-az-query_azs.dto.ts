/* md5: a9d742c315ec2be31363f451e104fc19 */
/* Rap repository id: 228 */
/* Rapper version: 2.1.14 */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

/**
 * This file is automatically generated by Rapper to synchronize the Rap platform interface, please do not modify
 * Rap repository url: https://rap.shopee.io/repository/editor?id=228
 */

/**
 * Interface name：azs
 * Rap url: https://rap.shopee.io/repository/editor?id=228&mod=1022&itf=6135
 */

import {IsOptional, IsString, IsNumber, IsBoolean, ValidateNested, IsArray, IsNotEmpty} from 'class-validator'
import {Type} from 'class-transformer'
import {ItemEmpty} from '.'

export class Item113755 {
  @IsNotEmpty()
  @IsString()
  'segment_key': string

  @IsNotEmpty()
  @IsString()
  'segment_name': string
}

export class Item113751 {
  @IsOptional()
  @IsString()
  'region_area_key'?: string

  @IsOptional()
  @IsString()
  'region_area_name'?: string
}

export class Item113748 {
  @IsOptional()
  @ValidateNested()
  @Type(() => Item113751)
  'region_area'?: Item113751

  @IsOptional()
  @IsString()
  'region_loc_key'?: string

  @IsOptional()
  @IsString()
  'region_loc_name'?: string
}

export class Item113745 {
  @IsOptional()
  @IsString()
  'region_key'?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => Item113748)
  'region_loc'?: Item113748

  @IsOptional()
  @IsString()
  'region_name'?: string
}

export class Item113737 {
  @IsOptional()
  @IsNumber()
  'az_enum_value'?: number

  @IsNotEmpty()
  @IsString()
  'az_key': string

  @IsNotEmpty()
  @IsString()
  'az_name': string

  @IsOptional()
  @IsString()
  'compliance_type'?: string

  @IsOptional()
  @IsArray()
  'data_centers'?: any[]

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ItemEmpty)
  'labels': ItemEmpty

  @IsNotEmpty()
  @IsArray()
  'pod_groups': any[]

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item113745)
  'region': Item113745

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item113755)
  @IsArray()
  'segments': Item113755[]

  @IsOptional()
  @IsString()
  'statefulness'?: string

  @IsOptional()
  @IsString()
  'status'?: string
}

export class GetApisAzMetaV1AzQueryAzsReqDto {
  @IsOptional()
  @IsString()
  'az_key'?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  'az_enum_value'?: number

  @IsOptional()
  @IsString()
  'region_key'?: string
}
export class GetApisAzMetaV1AzQueryAzsResDto {
  @IsOptional()
  @IsString()
  'version'?: string

  @IsOptional()
  @IsBoolean()
  'success'?: boolean

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Item113737)
  @IsArray()
  'result': Item113737[]
}
