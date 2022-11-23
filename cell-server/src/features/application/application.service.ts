import { Injectable } from '@nestjs/common'
import { SubscriptionEntity } from '@/entities/subscription.entity'
import { SpaceApiService } from '@/shared/space-api/space-api.service'
import { SpaceAuthService } from '@infra-node-kit/space-auth'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  CreateApplicationBody,
  RecreateApplicationParam,
  ValidateCMDBServiceNameBody,
} from '@/features/application/dtos/create-application.dto'
import { ApplicationEntity } from '@/entities/application.entity'
import { InjectQueue } from '@nestjs/bull'
import {
  APP_CREATION_QUEUE,
  APP_CREATION_QUEUE_TASK,
  BaseCreationQueueParams,
} from '@/common/constants/queue'
import { Queue } from 'bull'
import { logger } from '@infra-node-kit/logger'
import { ApplicationCreationService } from '@/features/application/application.creation.service'
import { AppStatus, AppSetupProgressStatus } from '@/common/constants/task'
import { getServiceName } from '@/common/utils/get-service-name'
import { throwError } from '@/common/utils/throw-error'
import {
  ListApplicationQuery,
  ApplicationListType,
} from '@/features/application/dtos/list-application.dto'
import {
  SubscribeApplicationParam,
  SubscribeApplicationBody,
} from '@/features/application/dtos/subscribe-application.dto'
import BPromise from 'bluebird'
import moment from 'moment'
import { ConfigService } from '@nestjs/config'
import { ERROR } from '@/common/constants/error'
import { tryCatch } from '@/common/utils/try-catch'

@Injectable()
export class ApplicationService {
  private readonly serviceNamePrefix: string

  constructor(
    private readonly spaceAuthService: SpaceAuthService,
    private readonly spaceApiService: SpaceApiService,
    private readonly applicationCreationService: ApplicationCreationService,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectQueue(APP_CREATION_QUEUE)
    private readonly appCreationQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    this.serviceNamePrefix = this.configService.get('serviceNamePrefix')!
  }

  async recreateApplication(gitlabToken: string, params: RecreateApplicationParam) {
    const userInfo = this.spaceAuthService.getUser()!
    const { appId } = params
    const app = await this.applicationRepository.findOne({ where: { id: appId } })
    if (!app) {
      throwError(ERROR.SYSTEM_ERROR.COMMON.EXECUTE_ERROR, `Can't find app ${appId}`)
    }

    const [newApp, updateAppError] = await tryCatch<ApplicationEntity>(
      this.applicationRepository.save({
        ...app,
        appStatus: AppStatus.CREATING,
        appSetupProgress: {
          ...app?.appSetupProgress,
          subTask: {
            ...app?.appSetupProgress.subTask,
            status: AppSetupProgressStatus.CREATING,
            message: '',
          },
        },
        updatedBy: userInfo.email,
        updatedAt: moment().unix(),
      }),
    )

    if (updateAppError) {
      throwError(
        ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
        `fauled to update app ${appId}: ${updateAppError.message}`,
      )
    }

    await this.startCreatingApplication({ app, userInfo, gitlabToken, retry: true })
    const { id, ...rest } = newApp
    return {
      appId: id,
      ...rest,
    }
  }

  async createApplication(gitlabToken: string, body: CreateApplicationBody) {
    const { appName, cmdbProjectName, cmdbModuleName, description } = body
    const userInfo = this.spaceAuthService.getUser()!
    const { email } = userInfo

    const { isValidateSuccess } = await this.validateCMDBServiceName({
      cmdbProjectName,
      cmdbModuleName,
    })

    if (!isValidateSuccess) {
      throwError(
        ERROR.SYSTEM_ERROR.COMMON.EXECUTE_ERROR,
        `An application with project as '${cmdbProjectName}' and module as '${cmdbModuleName}' already exists.`,
      )
    }

    const [app, createAppError] = await tryCatch(
      this.applicationRepository.save({
        appName,
        cmdbProjectName,
        cmdbModuleName,
        appDescription: description,
        createdBy: email,
        updatedBy: email,
        appSetupProgress: {},
        updatedAt: moment().unix(),
        createdAt: moment().unix(),
      }),
    )

    if (createAppError) {
      throwError(
        ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
        `failed to create app ${appName}: ${createAppError.message}`,
      )
    }

    const [_, subscribeError] = await tryCatch(
      this.subscriptionRepository.save({
        appId: app.id,
        createdBy: email,
        createdAt: moment().unix(),
      }),
    )

    if (subscribeError) {
      logger.error(`Subscribe app ${app.id} failed: ${subscribeError.message}`)
    }

    await this.startCreatingApplication({ app, userInfo, gitlabToken })
    const { id: appId, ...rest } = app
    return {
      appId,
      ...rest,
    }
  }

  async startCreatingApplication(params: BaseCreationQueueParams) {
    logger.info(`[startCreating] Start to add creation queue for app ${params.app.id}`)

    const [_, createJobError] = await tryCatch(
      this.appCreationQueue.add(APP_CREATION_QUEUE_TASK, params, {
        jobId: `${APP_CREATION_QUEUE}-${params.app.id}`,
        repeat: {
          every: 20000,
        },
      }),
    )
    if (createJobError) {
      throwError(
        ERROR.SYSTEM_ERROR.COMMON.EXECUTE_ERROR,
        `failed to create job: ${createJobError.message}`,
      )
    }
    logger.info(`[startCreating] Finished to add creation queue for app ${params.app.id}`)

    if (!params.retry) {
      this.applicationCreationService.createServiceTicket(params)
    }
  }

  async queryCreationTickets(appId: number) {
    const app = await this.applicationRepository.findOne({ where: { id: appId } })
    if (!app) {
      throwError(ERROR.SYSTEM_ERROR.COMMON.EXECUTE_ERROR, `Can't find app ${appId}`)
    }

    const queryData = (templateValue: string) => ({
      page: 1,
      platform: 'SWP',
      label_match: {
        template_name: {
          values: [templateValue],
          clause_kind: 'OR',
          is_fuzzy_match: false,
        },
      },
      form_data_match: {
        app_id: {
          values: [appId.toString()],
          is_fuzzy_match: false,
          clause_kind: 'OR',
        },
        service_name: {
          values: [`${getServiceName(this.serviceNamePrefix, app)}`],
          is_fuzzy_match: false,
          clause_kind: 'OR',
        },
      },
    })
    const [cmdbTicketsData, queryCMDBTicketError] = await tryCatch(
      this.spaceApiService.querySWPTicket({
        body: queryData('apply_for_cmdb_service'),
      }),
    )
    if (queryCMDBTicketError) {
      logger.error(
        `failed to get cmdb service ticket for app ${app.id}: ${queryCMDBTicketError.message}`,
      )
    }
    const cmdbTicket = cmdbTicketsData?.result?.tickets?.[0]

    const [jenkinsTicketsData, queryJenkinsTicketError] = await tryCatch(
      this.spaceApiService.querySWPTicket({
        body: queryData('apply_shopee_jenkins_pipeline'),
      }),
    )
    if (queryJenkinsTicketError) {
      logger.error(
        `failed to get jenkins ticket for app ${app.id}: ${queryJenkinsTicketError.message}`,
      )
    }
    const jenkinsTicket = jenkinsTicketsData?.result?.tickets?.[0]

    const [albTicketData, queryAlbTicketError] = await tryCatch(
      this.spaceApiService.querySWPTicket({
        body: queryData('update_alb_listener'),
      }),
    )
    if (queryAlbTicketError) {
      logger.error(`failed to get alb ticket for app ${app.id}: ${queryAlbTicketError.message}`)
    }
    const albTestTicket = albTicketData?.result?.tickets?.find(
      (item) => item?.form_data?.envs?.[0] === 'test',
    )
    const albLiveTicket = albTicketData?.result?.tickets?.find(
      (item) => item?.form_data?.envs?.[0] === 'live',
    )

    return {
      cmdbTicket: {
        id: cmdbTicket?.id,
        phase: cmdbTicket?.phase,
      },
      jenkinsTicket: {
        id: jenkinsTicket?.id,
        phase: jenkinsTicket?.phase,
      },
      albTestTicket: {
        id: albTestTicket?.id,
        phase: albTestTicket?.phase,
      },
      albLiveTicket: {
        id: albLiveTicket?.id,
        phase: albLiveTicket?.phase,
      },
    }
  }

  async validateCMDBServiceName(body: ValidateCMDBServiceNameBody) {
    const { cmdbModuleName, cmdbProjectName } = body
    const [app, getExistedAppError] = await tryCatch(
      this.applicationRepository.findOne({
        where: { cmdbModuleName, cmdbProjectName },
      }),
    )

    if (getExistedAppError) {
      throwError(
        ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
        `failed to get app with project ${cmdbProjectName} and module ${cmdbModuleName}: ${getExistedAppError.message}`,
      )
    }

    return {
      isValidateSuccess: app === null,
    }
  }

  async listApplication(query: ListApplicationQuery) {
    const email = this.spaceAuthService.getUser()?.email
    const { offset, limit, type } = query
    if (type === ApplicationListType.SUBSCRIPTION) {
      const subsribedData = await this.listSubsribedApplication(query)
      return subsribedData
    }
    const [listAppData, listAppError] = await tryCatch(
      this.applicationRepository.findAndCount({
        skip: offset,
        take: limit,
        order: {
          updatedAt: 'DESC',
        },
      }),
    )
    if (listAppError) {
      throwError(
        ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
        `failed to list app: ${listAppError.message}`,
      )
    }
    const [list, total] = listAppData
    const items = await BPromise.resolve(list).map(async (item) => {
      const {
        id: appId,
        appName,
        cmdbProjectName,
        cmdbModuleName,
        gitlabProjectId,
        createdBy,
        createdAt,
        cmdbServiceId,
        gitlabRepoUrl,
        feWorkbenchAppId,
        appStatus,
      } = item
      const [subscription, getSubscriptionError] = await tryCatch(
        this.subscriptionRepository.findOne({
          where: { appId, createdBy: email },
        }),
      )
      if (getSubscriptionError) {
        logger.error(
          `failed to get subscription error for app ${appId}: ${getSubscriptionError.message}`,
        )
      }

      return {
        appId,
        appName,
        cmdbProjectName,
        cmdbModuleName,
        gitlabProjectId,
        createdBy,
        cmdbServiceId,
        createdAt,
        gitlabRepoUrl,
        feWorkbenchAppId,
        subscribed: subscription !== null,
        appStatus,
      }
    })
    return {
      items,
      total,
    }
  }

  async listSubsribedApplication(query: ListApplicationQuery) {
    const email = this.spaceAuthService.getUser()?.email
    const { offset, limit } = query
    const [listData, listSubsribedAppError] = await tryCatch(
      this.subscriptionRepository.findAndCount({
        skip: offset,
        take: limit,
        where: {
          createdBy: email,
        },
        order: {
          createdAt: 'DESC',
        },
      }),
    )

    if (listSubsribedAppError) {
      throwError(
        ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
        `failed to list subsribed apps: ${listSubsribedAppError.message}`,
      )
    }

    const [list, total] = listData

    const items = await BPromise.resolve(list).map(async (item) => {
      const { appId, createdAt: subscribedTime } = item
      const application = await this.applicationRepository.findOne({ where: { id: appId } })
      if (!application) {
        throwError(ERROR.SYSTEM_ERROR.COMMON.EXECUTE_ERROR, `Can't find app ${appId}`)
      }
      const {
        appName,
        cmdbProjectName,
        cmdbModuleName,
        gitlabProjectId,
        gitlabRepoUrl,
        createdBy,
        cmdbServiceId,
        createdAt,
        feWorkbenchAppId,
        appStatus,
      } = application || {}

      return {
        appId,
        appName,
        cmdbProjectName,
        cmdbModuleName,
        gitlabProjectId,
        cmdbServiceId,
        createdBy,
        createdAt,
        subscribedTime,
        gitlabRepoUrl,
        feWorkbenchAppId,
        subscribed: true,
        appStatus,
      }
    })

    return {
      items,
      total,
    }
  }

  async subscribeApplication(params: SubscribeApplicationParam, body: SubscribeApplicationBody) {
    const email = this.spaceAuthService.getUser()?.email
    const { appId } = params
    const { subscribed } = body
    if (subscribed) {
      const [_, subscribeError] = await tryCatch(
        this.subscriptionRepository.save({
          appId,
          createdBy: email,
          createdAt: moment().unix(),
        }),
      )
      if (subscribeError) {
        throwError(
          ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
          `failed to subscribe app ${appId}: ${subscribeError.message}`,
        )
      }
    } else {
      const [_, unsubscribeError] = await tryCatch(
        this.subscriptionRepository.delete({
          createdBy: email,
          appId,
        }),
      )
      if (unsubscribeError) {
        throwError(
          ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
          `failed to unsubscribe app ${appId}: ${unsubscribeError.message}`,
        )
      }
    }
    return
  }

  async getApplication(appId: number) {
    const app = await this.applicationRepository.findOne({ where: { id: appId } })
    const email = this.spaceAuthService.getUser()?.email
    const isFavorite = await this.subscriptionRepository.findOne({
      where: { appId, createdBy: email },
    })
    if (!app) {
      throwError(ERROR.SYSTEM_ERROR.COMMON.EXECUTE_ERROR, `Can't find app ${appId}`)
    }
    const {
      appName,
      cmdbProjectName,
      cmdbModuleName,
      gitlabProjectId,
      appDescription,
      gitlabRepoUrl,
      cmdbServiceId,
      createdBy,
      createdAt,
      updatedBy,
      updatedAt,
      appSetupProgress,
      appStatus,
      feWorkbenchAppId,
    } = app
    return {
      appId,
      appName,
      cmdbProjectName,
      cmdbModuleName,
      gitlabProjectId,
      appDescription,
      gitlabRepoUrl,
      cmdbServiceId,
      createdBy,
      createdAt,
      updatedBy,
      updatedAt,
      appSetupProgress,
      appStatus,
      feWorkbenchAppId,
      isFavorite: !!isFavorite,
    }
  }

  async updateAppCreationProgress(appId: number, body: any) {
    const { appSetupProgress, ...rest } = body
    const application = await this.applicationRepository.findOne({ where: { id: appId } })
    if (!application) {
      throwError(ERROR.SYSTEM_ERROR.COMMON.EXECUTE_ERROR, `Can't find app ${appId}`)
    }
    const [_, updateAppError] = await tryCatch(
      this.applicationRepository.update(appId, {
        ...rest,
        appSetupProgress: {
          ...application.appSetupProgress,
          ...appSetupProgress,
        },
      }),
    )

    if (updateAppError) {
      throwError(
        ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
        `failed to update app ${appId}: ${updateAppError.message}`,
      )
    }

    return
  }

  async deleteApp(appId: number) {
    const [_, deleteAppError] = await tryCatch(this.applicationRepository.delete(appId))

    if (deleteAppError) {
      throwError(
        ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
        `failed to delete app ${appId}: ${deleteAppError.message}`,
      )
    }

    return
  }
}
