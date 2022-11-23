import { Injectable } from '@nestjs/common'
import { logger } from '@infra-node-kit/logger'
import { BaseCreationQueueParams } from '@/common/constants/queue'
import { InjectRepository } from '@nestjs/typeorm'
import { ApplicationEntity } from '@/entities/application.entity'
import { Repository } from 'typeorm'
import {
  ApplyResourcesStep,
  AppSetupProgressStatus,
  AppStatus,
  CreateFEWorkbenchStep,
  CreateGitRepoStep,
  CreateServiceStep,
  TaskStep,
} from '@/common/constants/task'
import { throwError } from '@/common/utils/throw-error'
import { ISpaceUser } from '@infra-node-kit/space-auth'
import { getCurrentStage, isLastTask } from '@/common/utils/app-creation'
import { SpaceApiService } from '@/shared/space-api/space-api.service'
import { getServiceName } from '@/common/utils/get-service-name'
import { GitlabService } from '@/features/gitlab/gitlab.service'
import stringify from 'fast-json-stable-stringify'
import { CurrentStageInfo, CreationTaskType } from '@/features/application/dtos/get-application.dto'
import moment from 'moment'
import { ConfigService } from '@nestjs/config'
import { ERROR } from '@/common/constants/error'
import { tryCatch } from '@/common/utils/try-catch'

const TASK_TIMEOUT_THRESHOLD = 120

@Injectable()
export class ApplicationCreationService {
  private readonly serviceNamePrefix: string
  private readonly serviceProductLine: string
  private readonly isLive: boolean

  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly appRepository: Repository<ApplicationEntity>,
    private readonly spaceApiService: SpaceApiService,
    private readonly gitlabService: GitlabService,
    private readonly configService: ConfigService,
  ) {
    this.serviceNamePrefix = this.configService.get('serviceNamePrefix')!
    this.serviceProductLine = this.configService.get('serviceProductLine')!
    this.isLive = process.env.NODE_ENV === 'live'
  }

  async getCurrentApp(appId: number) {
    const app = await this.appRepository.findOne({
      where: { id: appId },
    })
    if (app === null) {
      logger.error(`Can't find app ${appId}`)
      throwError(ERROR.SYSTEM_ERROR.COMMON.EXECUTE_ERROR, `Can't find app ${appId}`)
    }
    return app
  }

  async updateCurrentStageInfo(appId: number, status: CurrentStageInfo, userInfo: ISpaceUser) {
    const [app, updateAppError] = await tryCatch(
      this.appRepository.update(appId, {
        appSetupProgress: status,
        updatedBy: userInfo.email,
        updatedAt: moment().unix(),
      }),
    )

    if (updateAppError) {
      throwError(
        ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
        `failed to update app ${appId}: ${updateAppError.message}`,
      )
    }

    return app
  }

  getTaskMap(params: BaseCreationQueueParams) {
    return [
      [() => this.createServiceTicket(params), () => this.queryServiceTicket(params)],
      [
        () => this.createGitRepo(params),
        () => this.bindGitRepoToService(params),
        () => this.initRepo(params),
      ],
      [
        () => this.createJenkinsTicket(params),
        () => this.queryJenkinsTicket(params),
        () => this.updateDeployConfig(params),
        () => this.createAlbTestTicket(params),
        () => this.queryAlbTestTicket(params),
        () => this.createAlbLiveTicket(params),
        () => this.queryAlbLiveTicket(params),
      ],
      [() => this.createFEWorkbenchApp(params), () => this.bindJenkinsToFEWorkbenchApp(params)],
    ]
  }

  async getCreationStatus(params: BaseCreationQueueParams) {
    const { app } = params

    // Get app status
    const currentApp = await this.getCurrentApp(app.id)
    const { task, subTask } = currentApp?.appSetupProgress
    logger.info(
      `[getCreationStatus] Get current stage for app ${params.app.id}. task: ${stringify(
        task,
      )}, subTask: ${stringify(subTask)}`,
    )

    // Check if task is finished
    if (isLastTask(task.id, subTask.id) && subTask.status === AppSetupProgressStatus.FINISHED) {
      return { isFinished: true, isSuccess: true }
    }

    // Check if task is failed
    if (subTask.status === AppSetupProgressStatus.FAILED) {
      return { isFinished: true, isSuccess: false }
    }

    // Check task type
    if (subTask.taskType === CreationTaskType.NORMAL) {
      // normal task
      if (Math.floor((Date.now() - subTask.modifyTime) / 1000) > TASK_TIMEOUT_THRESHOLD) {
        logger.info(
          `[getCreationStatus] timeout task for app ${params.app.id}. task: ${stringify(
            task,
          )}, subTask: ${stringify(subTask)}`,
        )
        // task is timeout, trigger it again
        return await this.getTaskMap(params)[task.id][subTask.id]()
      }
    } else if (subTask.taskType === CreationTaskType.POLLING) {
      // polling task
      logger.info(
        `[getCreationStatus] polling task for app ${params.app.id}. task: ${stringify(
          task,
        )}, subTask: ${stringify(subTask)}`,
      )

      // find the next task
      let nextTaskId = task.id
      let nextSubTaskId = subTask?.id + 1
      const taskMap = this.getTaskMap(params)
      if (subTask.id >= taskMap[task.id].length - 1) {
        nextTaskId += 1
        nextSubTaskId = 0
      }
      const nextTask = taskMap[nextTaskId][nextSubTaskId]

      const res = await this.queryTicketStatus(params, {
        successCallback: () => {
          nextTask()
        },
      })
      return { isFinished: res.isSuccess ? false : res.hasResult, isSuccess: res.isSuccess }
    }
    return {
      isFinished: false,
      isSuccess: false,
    }
  }

  async createTask(
    params: BaseCreationQueueParams,
    options: {
      taskId: number
      subTaskId: number
      taskType?: CreationTaskType
      taskFn: (...argument: unknown[]) => any
      successCallback?: (...argument: unknown[]) => any
      failureCallback?: (...argument: unknown[]) => any
    },
  ) {
    const { app, userInfo } = params
    const {
      taskId,
      subTaskId,
      taskType = CreationTaskType.NORMAL,
      taskFn,
      successCallback,
      failureCallback,
    } = options

    logger.info(
      `[createTask] Start to create task (taskId: ${taskId}, subTaskId: ${subTaskId}) for app ${app.id}`,
    )

    const { appSetupProgress: currentStageInfo } = await this.getCurrentApp(app.id)
    try {
      // update status to creating
      await this.updateCurrentStageInfo(
        app.id,
        getCurrentStage(taskId, subTaskId, {
          taskType,
          subTaskStatus: AppSetupProgressStatus.CREATING,
          data: currentStageInfo?.data,
        }),
        userInfo,
      )

      // execute task
      const stageData = await taskFn()

      // update status to success
      if (taskType === CreationTaskType.NORMAL) {
        await this.updateCurrentStageInfo(
          app.id,
          getCurrentStage(taskId, subTaskId, {
            taskType,
            subTaskStatus: AppSetupProgressStatus.FINISHED,
            data: { ...currentStageInfo?.data, ...stageData },
          }),
          userInfo,
        )

        await successCallback?.(params)

        logger.info(
          `[createTask] Succeed to execute task (taskId: ${taskId}, subTaskId: ${subTaskId}) for app ${app.id}`,
        )
      }

      const isFinished = isLastTask(taskId, subTaskId)

      return { isFinished, isSuccess: true }
    } catch (err: any) {
      logger.error(err)

      // update status to failed
      await this.updateCurrentStageInfo(
        app.id,
        getCurrentStage(taskId, subTaskId, {
          taskStatus: AppSetupProgressStatus.FAILED,
          subTaskStatus: AppSetupProgressStatus.FAILED,
          message: err.message,
          data: currentStageInfo?.data,
        }),
        userInfo,
      )

      // update app status
      const [_, updateAppStatusError] = await tryCatch(
        this.appRepository.update(app.id, {
          appStatus: AppStatus.CREATING_FAILED,
          updatedBy: userInfo.email,
          updatedAt: moment().unix(),
        }),
      )

      if (updateAppStatusError) {
        throwError(
          ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
          `failed to update app ${app.id}: ${updateAppStatusError.message}`,
        )
      }

      failureCallback?.(params)

      logger.error(
        `[createTask] Failed to execute task (taskId: ${taskId}, subTaskId: ${subTaskId}), reason ${err.message}`,
      )

      return { isFinished: true, isSuccess: false }
    }
  }

  async queryTicketStatus(params: BaseCreationQueueParams, options?: { successCallback?: any }) {
    const { app, userInfo } = params
    const { successCallback } = options || {}

    const { appSetupProgress: currentStageInfo } = await this.getCurrentApp(app.id)
    const { task, subTask, data } = currentStageInfo
    const ticketId = data?.ticketId

    logger.info(`[queryTicketStatus] Start to query ticket (${ticketId}${userInfo.auth}) status`)

    const { result: ticketRes } = await this.spaceApiService.getSWPTicket({
      token: userInfo.auth,
      ticketId,
    })

    const isFailed =
      ticketRes.phase_type === 'END_FAILED' || Math.floor(Date.now() / 1000) > ticketRes.eta

    if (isFailed) {
      // ticket failed
      logger.info(
        `[queryTicketStatus] Failed to query ticket (${ticketId}) status, reason ${ticketRes.phase}`,
      )

      // update status to failed
      await this.updateCurrentStageInfo(
        app.id,
        getCurrentStage(task?.id, subTask?.id, {
          taskType: CreationTaskType.POLLING,
          subTaskStatus: AppSetupProgressStatus.FAILED,
          taskStatus: AppSetupProgressStatus.FAILED,
          message: `Failed to query ticket (${ticketId}) status, reason ${ticketRes.phase}`,
          data: currentStageInfo?.data,
        }),
        userInfo,
      )

      const [_, updateAppStatusError] = await tryCatch(
        this.appRepository.update(app.id, {
          appStatus: AppStatus.CREATING_FAILED,
          updatedBy: userInfo.email,
          updatedAt: moment().unix(),
        }),
      )

      if (updateAppStatusError) {
        throwError(
          ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
          `failed to update app ${app.id}: ${updateAppStatusError.message}`,
        )
      }

      return {
        hasResult: true,
        isSuccess: false,
      }
    }
    if (ticketRes.phase_type === 'END_SUCCEED') {
      // ticket succeed
      logger.info(`[queryTicketStatus] Succeed to query ticket (${ticketId}) status`)

      const serviceName = getServiceName(this.serviceNamePrefix, app)

      const updateStageInfo = async () => {
        await this.updateCurrentStageInfo(
          app.id,
          getCurrentStage(task?.id, subTask?.id, {
            subTaskStatus: AppSetupProgressStatus.FINISHED,
            data: currentStageInfo?.data,
          }),
          userInfo,
        )

        await successCallback?.(params)

        return {
          hasResult: true,
          isSuccess: true,
        }
      }

      try {
        // if it is create CMDB service ticket, make sure the service is been created before mark as done.
        if (ticketRes.label.template_name === 'apply_for_cmdb_service') {
          const { service } = await this.spaceApiService.getServiceByName({
            token: userInfo.auth,
            serviceName,
          })

          logger.info(
            `[queryTicketStatus] Get service id (${service.service_id}) by the name (${serviceName})`,
          )

          if (service?.service_id) {
            const [_, updateAppStatusError] = await tryCatch(
              this.appRepository.update(app.id, {
                cmdbServiceId: +service.service_id,
                updatedBy: userInfo.email,
                updatedAt: moment().unix(),
              }),
            )

            if (updateAppStatusError) {
              throwError(
                ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
                `failed to update app ${app.id}: ${updateAppStatusError.message}`,
              )
            }

            return await updateStageInfo()
          }
          return {
            hasResult: false,
            isSuccess: false,
          }
        }
        return await updateStageInfo()
      } catch (err) {
        // the service is not ready
        logger.info(`[queryTicketStatus] Service is not ready for ${serviceName}`)
        return {
          hasResult: false,
          isSuccess: false,
        }
      }
    } else {
      // ticket pending
      logger.info(`[queryTicketStatus] No result for querying ticket (${ticketId}) status`)
      return {
        hasResult: false,
        isSuccess: false,
      }
    }
  }

  async createServiceTicket(params: BaseCreationQueueParams) {
    const { app, userInfo } = params

    const latestApp = await this.getCurrentApp(app.id)

    logger.info(`Start to create service ticket for ${latestApp?.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.CREATE_SERVICE,
      subTaskId: CreateServiceStep.CREATE_SERVICE_TICKET,
      taskFn: async () => {
        const serviceName = getServiceName(this.serviceNamePrefix, app)
        const { service_tickets: serviceTickets } = await this.spaceApiService.createTicket({
          token: userInfo.auth,
          body: {
            service_name: serviceName,
            service_owners: [userInfo.email],
            swp_tickets: [
              {
                title: 'Create a new service in cmdb (Created by Cell Platform)',
                template_name: 'apply_for_cmdb_service',
                form_data: {
                  app_id: app.id,
                  service_name: serviceName,
                  service_owners: [userInfo.email],
                },
              },
            ],
          },
        })
        const serviceTicket = serviceTickets?.[0]

        return { ticketId: serviceTicket.ticket_id }
      },
      successCallback: () => {
        this.queryServiceTicket(params)
      },
    })
  }

  async queryServiceTicket(params: BaseCreationQueueParams) {
    logger.info(`Start to query service ticket for ${params.app.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.CREATE_SERVICE,
      subTaskId: CreateServiceStep.QUERY_SERVICE_TICKET,
      taskType: CreationTaskType.POLLING,
      taskFn: async () => {
        await this.queryTicketStatus(params, {
          successCallback: () => {
            this.createGitRepo(params)
          },
        })
      },
    })
  }

  async createGitRepo(params: BaseCreationQueueParams) {
    const { app, gitlabToken, userInfo } = params

    const latestApp = await this.getCurrentApp(app.id)

    logger.info(`Start to create git repo for ${latestApp?.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.CREATE_GIT_REPO,
      subTaskId: CreateGitRepoStep.CREATE_GIT_REPO,
      taskFn: async () => {
        const { result } = await this.spaceApiService.checkCodeFreeze(userInfo.auth)
        const createdInCodeFreeze = !!result?.lockdown
        const repo = await this.gitlabService.createRepo(latestApp.appName, gitlabToken)

        const [_, updateAppStatusError] = await tryCatch(
          this.appRepository.update(latestApp.id, {
            gitlabRepoUrl: repo.http_url_to_repo,
            gitlabProjectId: repo.id,
            updatedBy: userInfo.email,
            updatedAt: moment().unix(),
          }),
        )

        if (updateAppStatusError) {
          throwError(
            ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
            `failed to update app ${app.id}: ${updateAppStatusError.message}`,
          )
        }

        return {
          createdInCodeFreeze,
          repo: {
            id: repo.id,
            http_url_to_repo: repo.http_url_to_repo,
            ssh_url_to_repo: repo.ssh_url_to_repo,
          },
        }
      },
      successCallback: () => {
        this.bindGitRepoToService(params)
      },
    })
  }

  async bindGitRepoToService(params: BaseCreationQueueParams) {
    const { app, userInfo } = params

    const latestApp = await this.getCurrentApp(app.id)

    logger.info(`Start to bind repo to service for ${latestApp.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.CREATE_GIT_REPO,
      subTaskId: CreateGitRepoStep.BIND_GIT_REPO_TO_SERVICE,
      taskFn: async () => {
        await this.spaceApiService.updateService({
          token: userInfo.auth,
          serviceId: latestApp.cmdbServiceId,
          gitRepoLink: latestApp.appSetupProgress.data.repo.http_url_to_repo,
        })
      },
      successCallback: () => {
        this.initRepo(params)
      },
    })
  }

  async initRepo(params: BaseCreationQueueParams) {
    const { app, userInfo, gitlabToken } = params

    const latestApp = await this.getCurrentApp(app.id)

    logger.info(`Start to init repo for ${latestApp.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.CREATE_GIT_REPO,
      subTaskId: CreateGitRepoStep.INIT_REPO,
      taskFn: async () => {
        await this.gitlabService.initRepo(
          latestApp,
          latestApp.appSetupProgress.data.repo.ssh_url_to_repo,
          userInfo,
          gitlabToken,
        )
      },
      successCallback: () => {
        this.createJenkinsTicket(params)
      },
    })
  }

  async createJenkinsTicket(params: BaseCreationQueueParams) {
    const { app, userInfo } = params

    const latestApp = await this.getCurrentApp(app.id)

    logger.info(`Start to create jenkins ticket for ${latestApp.appName}`)

    const { cmdbProjectName, cmdbModuleName } = latestApp

    return await this.createTask(params, {
      taskId: TaskStep.APPLY_RESOURCE,
      subTaskId: ApplyResourcesStep.CREATE_JENKINS_TICKET,
      taskFn: async () => {
        const serviceName = getServiceName(this.serviceNamePrefix, latestApp)
        const jenkinsTicket = await this.spaceApiService.createTicket({
          token: userInfo.auth,
          body: {
            service_id: latestApp.cmdbServiceId,
            service_name: serviceName,
            service_owners: [],
            swp_tickets: [
              {
                title: `Apply Jenkins Pipeline for Service ${serviceName} (Created by Cell Platform)`,
                template_name: 'apply_shopee_jenkins_pipeline',
                form_data: {
                  app_id: latestApp.id,
                  cids: ['sg'],
                  deploy_as_image: false,
                  deploy_as_service: true,
                  deploy_as_static: false,
                  environments: this.isLive ? ['test', 'live'] : ['test'],
                  filled: true,
                  git_repo: latestApp.appSetupProgress.data.repo.ssh_url_to_repo,
                  jenkinsType: 'Shopee',
                  serviceName,
                  service_product_line: this.serviceProductLine,
                  services: [
                    {
                      project: cmdbProjectName,
                      module: cmdbModuleName,
                      overwrite_existing_pipeline: true,
                    },
                  ],
                  service_name: serviceName,
                },
                label: {
                  service_id: latestApp.cmdbServiceId,
                  service_name: serviceName,
                },
              },
            ],
          },
        })

        return { ticketId: jenkinsTicket?.service_tickets?.[0]?.ticket_id }
      },
      successCallback: () => {
        this.queryJenkinsTicket(params)
      },
    })
  }

  async queryJenkinsTicket(params: BaseCreationQueueParams) {
    logger.info(`Start to query jenkins ticket for ${params.app.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.APPLY_RESOURCE,
      subTaskId: ApplyResourcesStep.QUERY_JENKINS_TICKET,
      taskType: CreationTaskType.POLLING,
      taskFn: async () => {
        await this.queryTicketStatus(params, {
          successCallback: async () => {
            await this.updateDeployConfig(params)
          },
        })
      },
    })
  }

  updateDeployPath(userInfo: ISpaceUser, app: ApplicationEntity, env: string) {
    this.spaceApiService.updateDeployPath({
      token: userInfo.auth,
      body: {
        deploy_definition_path: 'deploy/deploy.json',
        disable_concurrent_builds_job: true,
        env,
        service_id: app.cmdbServiceId,
      },
    })
  }

  async updateDeployConfig(params: BaseCreationQueueParams) {
    const { app, userInfo } = params

    const latestApp = await this.getCurrentApp(app.id)

    logger.info(`Start to update deploy config for ${latestApp.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.APPLY_RESOURCE,
      subTaskId: ApplyResourcesStep.UPDATE_DEPLOY_CONFIG,
      taskFn: async () => {
        const { createdInCodeFreeze } = latestApp.appSetupProgress.data

        const results = await Promise.allSettled(
          [
            this.updateDeployPath(userInfo, latestApp, 'test'),
            this.isLive &&
              !createdInCodeFreeze &&
              this.spaceApiService.updateDeployConfiguration({
                token: userInfo.auth,
                body: {
                  comment: 'Init config. Updated by Cell platform',
                  data: stringify({
                    idcs: {
                      live: {
                        sg: ['sg'],
                      },
                    },
                  }),
                  env: 'live',
                  service_id: latestApp.cmdbServiceId,
                },
              }),
            this.isLive &&
              !createdInCodeFreeze &&
              this.updateDeployPath(userInfo, latestApp, 'live'),
          ].filter(Boolean),
        )

        if (results.some((result) => result.status === 'rejected')) {
          throw new Error(
            'Failed to update deploy configuration. You may do not have permission of live deployment, please apply a JenkinsAdmin policy for your CMDB service',
          )
        }
      },
      successCallback: () => {
        this.createAlbTestTicket(params)
      },
    })
  }

  async updateAlbListeners(app: ApplicationEntity, userInfo: ISpaceUser, env: 'test' | 'live') {
    const domain = env === 'test' ? 'space.test.shopee.io' : 'space.shopee.io'
    const { cmdbProjectName, cmdbModuleName } = app
    const { result: prevListeners } = await this.spaceApiService.getAlbListener({
      token: userInfo.auth,
      query: {
        cid: 'sg',
        env,
        show_details: true,
        domain_zone: 'shopee.io',
        domain_prefix: 'space',
        multiple_cids: false,
        show_submitted: true,
        unique_cid_and_env: true,
      },
    })
    const currentListener = prevListeners?.find(
      (listener) => listener.env === env && listener.cid === 'sg',
    )

    if (currentListener?.is_locked) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR,
        `alb in ${env} env is locked, please try later.`,
      )
    }

    const newListener = {
      ...currentListener,
      rules: [
        ...(currentListener?.rules || []),
        {
          match_type: 'GENERAL',
          match_path: `/cell/${app.cmdbProjectName}${app.cmdbModuleName}/`,
          enable_port_80: true,
          enable_port_443: true,
          target_type: 'CONTAINER',
          target_protocol: 'HTTP',
          target_name: `${cmdbProjectName}_${cmdbModuleName}_${env}_@cid`,
          target_cid: '@cid',
          container_target: {
            target_project: cmdbProjectName,
            target_module: cmdbModuleName,
            unique_name: `${cmdbProjectName}_${cmdbModuleName}_${env}_sg`,
            loadBalancerMethod: 'SWRR',
            keepalive_conn: 64,
          },
          directives: [
            {
              key: 'PROXY_PASS_PATH',
              value: '/',
            },
          ],
        },
      ],
      comment: 'Add new listener. update by Cell Platform.',
    }

    const { result: afterListeners } = await this.spaceApiService.createAlbListener({
      token: userInfo.auth,
      body: {
        listeners: [newListener],
      },
    })
    const listenerPairs = afterListeners?.map((listener) => {
      const prevListener = prevListeners?.find(
        (x): boolean => x.env === listener.env && x.cid === listener.cid,
      )
      return {
        before_listener_id: prevListener?.id || null,
        after_listener_id: listener.id,
      }
    })
    const listenerIds = afterListeners?.map((listener) => listener.id)

    const ticket = await this.spaceApiService.createSWPTicket({
      token: userInfo.auth,
      body: {
        title: `Update Listener - ${domain} (Updated by Cell Platform)`,
        form_data: {
          app_id: app.id,
          service_name: getServiceName(this.serviceNamePrefix, app),
          applicant_user: userInfo.name,
          requests: [
            {
              comment: 'Add new listener. update by Cell Platform.',
              listener_pairs: listenerPairs,
              listener_ids: listenerIds,
            },
          ],
          type: 'UPDATE',
          officeip_comment: undefined,
          domain_name: domain,
          domain_prefix: 'space',
          domain_zone: 'shopee.io',
          envs: [env],
          cids: ['sg'],
        },
        label: {
          fe_data: {
            serviceName: 'dns',
            moduleName: 'management',
          },
        },
        auto_submit: true,
        template_name: 'update_alb_listener',
      },
    })

    return ticket
  }

  async createAlbTestTicket(params: BaseCreationQueueParams) {
    const { app, userInfo } = params
    const latestApp = await this.getCurrentApp(app.id)
    logger.info(`Start to create ALB test ticket for ${latestApp.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.APPLY_RESOURCE,
      subTaskId: ApplyResourcesStep.CREATE_ALB_TEST_TICKET,
      taskFn: async () => {
        const { result: albTestTicket } = await this.updateAlbListeners(app, userInfo, 'test')

        return {
          ticketId: albTestTicket.id,
        }
      },
      successCallback: () => {
        this.queryAlbTestTicket(params)
      },
    })
  }

  async queryAlbTestTicket(params: BaseCreationQueueParams) {
    logger.info(`Start to query alb test ticket for ${params.app.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.APPLY_RESOURCE,
      subTaskId: ApplyResourcesStep.QUERY_ALB_TEST_TICKET,
      taskType: CreationTaskType.POLLING,
      taskFn: async () => {
        await this.queryTicketStatus(params, {
          successCallback: async () => {
            if (this.isLive) {
              await this.createAlbLiveTicket(params)
            } else {
              await this.createFEWorkbenchApp(params)
            }
          },
        })
      },
    })
  }

  async createAlbLiveTicket(params: BaseCreationQueueParams) {
    const { app, userInfo } = params
    const latestApp = await this.getCurrentApp(app.id)
    logger.info(`Start to create ALB live ticket for ${latestApp.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.APPLY_RESOURCE,
      subTaskId: ApplyResourcesStep.CREATE_ALB_LIVE_TICKET,
      taskFn: async () => {
        const { result: albLiveTicket } = await this.updateAlbListeners(app, userInfo, 'live')

        return {
          ticketId: albLiveTicket.id,
        }
      },
      successCallback: () => {
        this.queryAlbLiveTicket(params)
      },
    })
  }

  async queryAlbLiveTicket(params: BaseCreationQueueParams) {
    logger.info(`Start to query alb live ticket for ${params.app.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.APPLY_RESOURCE,
      subTaskId: ApplyResourcesStep.QUERY_ALB_LIVE_TICKET,
      taskType: CreationTaskType.POLLING,
      taskFn: async () => {
        await this.queryTicketStatus(params, {
          successCallback: async () => {
            await this.createFEWorkbenchApp(params)
          },
        })
      },
    })
  }

  async createFEWorkbenchApp(params: BaseCreationQueueParams) {
    const { app, userInfo } = params

    const latestApp = await this.getCurrentApp(app.id)

    logger.info(`Start to create FE workbench for ${latestApp.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.CREATE_FE_WORKBENCH,
      subTaskId: CreateFEWorkbenchStep.CREATE_FE_WORKBENCH_APP,
      taskFn: async () => {
        const { data: wbApp } = await this.spaceApiService.createFEWorkbenchApp({
          token: userInfo.auth,
          body: {
            app_name: latestApp.appName,
            app_desc: latestApp.appDescription,
            git_repo: latestApp.appSetupProgress.data?.repo?.ssh_url_to_repo,
            git_prj_id: latestApp.appSetupProgress.data?.repo?.id,
          },
        })
        if (!wbApp) {
          throwError(
            ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR,
            'Create workbench app failed',
          )
        }
        if (wbApp?.id) {
          const [_, updateAppStatusError] = await tryCatch(
            this.appRepository.update(app.id, {
              feWorkbenchAppId: wbApp.id,
              updatedBy: userInfo.email,
              updatedAt: moment().unix(),
            }),
          )

          if (updateAppStatusError) {
            throwError(
              ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
              `failed to update app ${app.id}: ${updateAppStatusError.message}`,
            )
          }
        }
        return { wbApp: { id: wbApp?.id } }
      },
      successCallback: () => {
        this.bindJenkinsToFEWorkbenchApp(params)
      },
    })
  }

  async bindJenkinsToFEWorkbenchApp(params: BaseCreationQueueParams) {
    const { app, userInfo } = params

    const latestApp = await this.getCurrentApp(app.id)

    logger.info(`Start to bind Jenkins to FE workbench for ${latestApp.appName}`)

    return await this.createTask(params, {
      taskId: TaskStep.CREATE_FE_WORKBENCH,
      subTaskId: CreateFEWorkbenchStep.BIND_JENKINS_FOR_FE_WORKBENCH_APP,
      taskFn: async () => {
        const { result } = await this.spaceApiService.getServiceJobs({
          token: userInfo.auth,
          serviceId: latestApp.cmdbServiceId,
        })
        const { service_jobs: serviceJobs } = result
        const workbenchJobs: { [key: string]: string } = {}
        for (let i = 0; i < serviceJobs.length; i++) {
          const link = serviceJobs[i].jenkins_job.link as string
          const env = link.split('-').pop()
          if (env) workbenchJobs[env] = link
        }
        await this.spaceApiService.importJenkins({
          token: userInfo.auth,
          body: {
            app_id: latestApp.feWorkbenchAppId.toString(),
            service_id: latestApp.cmdbServiceId,
            jobs: workbenchJobs,
          },
        })
      },
      successCallback: async () => {
        const [_, updateAppStatusError] = await tryCatch(
          this.appRepository.update(app.id, {
            appStatus: AppStatus.IN_USE,
            updatedBy: userInfo.email,
            updatedAt: moment().unix(),
            appSetupProgress: {
              ...app.appSetupProgress,
              task: {
                ...app.appSetupProgress.task,
                status: AppSetupProgressStatus.FINISHED,
              },
            },
          }),
        )

        if (updateAppStatusError) {
          throwError(
            ERROR.SYSTEM_ERROR.SQL.REQUEST_ERROR,
            `failed to update app ${app.id}: ${updateAppStatusError.message}`,
          )
        }
      },
    })
  }
}
