import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsArray, IsObject, MaxLength, IsIn, ValidateNested, IsString, ValidateIf } from 'class-validator'

import { INode } from '../entities/node.entity'
import { IsNotEmptyArray, IsNotEmptyObject, IsMatchRegExp } from 'common/decorators/validations/common'
import { Type } from 'class-transformer/decorators'
import { IPodBaseResponse } from 'applications-management/pods/dto/pod.dto'

export enum NODE_ACTION_TYPE {
  CORDON = 'cordon',
  UNCORDON = 'uncordon',
  DRAIN = 'drain',
  LABEL = 'label',
  TAINT = 'taint'
}

export const TAINT_ACTION = {
  UPDATE: 'update',
  REMOVE: 'remove'
}

export const TAINT_EFFECT = {
  NoSchedule: 'NoSchedule',
  PreferNoSchedule: 'PreferNoSchedule',
  NoExecute: 'NoExecute'
}

export class NodeActionBasePayload {
  @IsNotEmpty()
  @IsArray()
  @IsNotEmptyArray({ message: 'nodes can not be an empty array' })
  @ApiProperty({ type: [String] })
  nodes: string[]
}

export class NodeLabelPayload extends NodeActionBasePayload {
  @ApiProperty({ type: Object })
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject({ message: 'labels can not be an empty object' })
  labels: {
    [key: string]: string
  }
}

export class INodeTaint {
  @IsNotEmpty()
  @IsString()
  @MaxLength(253)
  @IsMatchRegExp(/^[a-zA-Z0-9]+/)
  @IsMatchRegExp(/^[a-zA-Z0-9\-\.\_\/]+$/)
  @ApiProperty({ type: String })
  key: string

  @MaxLength(63)
  @IsString()
  @IsMatchRegExp(/^[a-zA-Z0-9]+/)
  @IsMatchRegExp(/^[a-zA-Z0-9\-\.\_]+$/)
  @ApiProperty({ type: String })
  value: string

  @IsNotEmpty({
    groups: ['update']
  })
  @IsIn(Object.values(TAINT_EFFECT), { groups: ['update'] })
  @ApiProperty({ type: String })
  effect: string
}

export class NodeTaintPayload extends NodeActionBasePayload {
  @ApiProperty({ type: String })
  @IsIn(Object.values(TAINT_ACTION))
  action: 'update' | 'remove'

  @ApiProperty({ type: INodeTaint })
  @ValidateNested()
  @ValidateIf((obj) => obj.action === TAINT_ACTION.UPDATE, { groups: ['update'] })
  @Type(() => INodeTaint)
  taint: INodeTaint
}

export class NodeListResponse {
  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: [INode] })
  nodes: INode[]
}

export class NodeActionResponse {
  @ApiProperty({ type: [String] })
  success: string[]

  @ApiProperty({ type: [String] })
  fail: string[]
}

export class INodePodListResponse {
  @ApiProperty({ type: [IPodBaseResponse] })
  pods: IPodBaseResponse[]

  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: [String] })
  statusList: string[]
}
