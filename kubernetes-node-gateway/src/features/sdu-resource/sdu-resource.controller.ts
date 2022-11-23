import {
  ListAzsResponse,
  ListCidsResponse,
  ListClusterParams,
  ListClustersResponse,
  ListEnvsResponse,
  ListMachineModelsResponse,
  ListBigSalesResponse,
  ListSegmentsResponse,
  ListSegmentParams,
} from '@/features/sdu-resource/dto/list-resource.dto'
import {
  ListLabelsResponse,
  ListSecondLabelsParams,
  ListThirdLabelsParams,
} from '@/features/sdu-resource/dto/list-labels.dto'
import { ListStockQuery, ListStockResponse } from '@/features/sdu-resource/dto/list-stock-resource.dto'
import { ListIncrementQuery, ListIncrementResponse } from '@/features/sdu-resource/dto/list-increment-resource.dto'
import { LabelNode } from '@/features/sdu-resource/entities/label.entity'
import { Controller, Get, Param, Put, Body, Delete, Query, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SduResourceService } from '@/features/sdu-resource/sdu-resource.service'
import { DeleteIncrementEstimateBody } from '@/features/sdu-resource/dto/delete-increment-estimate.dto'
import { EditIncrementEstimateBody } from '@/features/sdu-resource/dto/edit-increment-estimate.dto'
import { EditStockResourceBody } from '@/features/sdu-resource/dto/edit-stock-resource.dto'
import { ListVersionResponse } from '@/features/sdu-resource/dto/list-version.dto'
import { ListSummaryQuery, ListSummaryResponse } from '@/features/sdu-resource/dto/list-summary.dto'
import { EditVersionBody } from '@/features/sdu-resource/dto/edit-version.dto'
import { CreateVersionBody } from '@/features/sdu-resource/dto/create-version.dto'
import { CreateIncrementEstimateBody } from '@/features/sdu-resource/dto/create-increment-estimate.dto'
@ApiTags('SduResource')
@Controller('sdu-resource')
export class SduResourceController {
  constructor(private readonly sduResourceService: SduResourceService) {}

  @Get('azs')
  async listAzs(): Promise<ListAzsResponse> {
    return this.sduResourceService.listAzs()
  }

  @Get('envs')
  async listEnvs(): Promise<ListEnvsResponse> {
    return this.sduResourceService.listEnvs()
  }

  @Get('cids')
  async listCids(): Promise<ListCidsResponse> {
    return this.sduResourceService.listCids()
  }

  @Get(':az/clusters')
  async listClusters(@Param() params: ListClusterParams): Promise<ListClustersResponse> {
    return this.sduResourceService.listClusters(params)
  }

  @Get(':az/segments')
  async listSegments(@Param() params: ListSegmentParams): Promise<ListSegmentsResponse> {
    return this.sduResourceService.listSegments(params)
  }

  @Get('machine-models')
  async listMachineModels(): Promise<ListMachineModelsResponse> {
    return this.sduResourceService.listMachineModels()
  }

  @Get('big-sales')
  async listBigSales(): Promise<ListBigSalesResponse> {
    return this.sduResourceService.listBigSales()
  }

  @Get('label-tree')
  getLabelTree(): Promise<LabelNode[]> {
    return this.sduResourceService.getLabelTree()
  }

  @Get('first-labels')
  listFirstLabels(): Promise<ListLabelsResponse> {
    return this.sduResourceService.listFirstLabels()
  }

  @Get('first-labels/:firstLabelId/second-labels')
  listSecondLabels(@Param() params: ListSecondLabelsParams): Promise<ListLabelsResponse> {
    return this.sduResourceService.listSecondLabels(params)
  }

  @Get('first-labels/:firstLabelId/second-labels/:secondLabelId/third-labels')
  listThirdLabels(@Param() params: ListThirdLabelsParams): Promise<ListLabelsResponse> {
    return this.sduResourceService.listThirdLabels(params)
  }

  @Get('/increment')
  listIncrement(@Query() query: ListIncrementQuery): Promise<ListIncrementResponse> {
    return this.sduResourceService.listIncrement(query)
  }

  @Delete('/increment')
  deleteIncrementEstimate(@Body() body: DeleteIncrementEstimateBody) {
    return this.sduResourceService.deleteIncrementEstimate(body)
  }

  @Post('/increment')
  createIncrementEstimate(@Body() body: CreateIncrementEstimateBody) {
    return this.sduResourceService.createIncrementEstimate(body)
  }

  @Put('/increment')
  editIncrementEstimate(@Body() body: EditIncrementEstimateBody) {
    return this.sduResourceService.editIncrementEstimate(body)
  }

  @Get('/stock')
  listStock(@Query() query: ListStockQuery): Promise<ListStockResponse> {
    return this.sduResourceService.listStock(query)
  }

  @Put('/stock')
  editStockResource(@Body() body: EditStockResourceBody) {
    return this.sduResourceService.editStockResource(body)
  }

  @Get('/summary')
  listSummary(@Query() query: ListSummaryQuery): Promise<ListSummaryResponse> {
    return this.sduResourceService.listSummary(query)
  }

  @Get('/version')
  listVersion(): Promise<ListVersionResponse> {
    return this.sduResourceService.listVersion()
  }

  @Post('/version')
  createVersion(@Body() body: CreateVersionBody) {
    return this.sduResourceService.createVersion(body)
  }

  @Put('/version')
  editVersion(@Body() body: EditVersionBody) {
    return this.sduResourceService.editVersion(body)
  }
}
