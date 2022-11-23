import { ApplicationEntity } from '@/entities/application.entity'
import { ISpaceUser } from '@infra-node-kit/space-auth'

export const APP_CREATION_QUEUE = 'AppCreation'

export const APP_CREATION_QUEUE_TASK = 'AppCreationTask'

export type BaseCreationQueueParams = {
  app: ApplicationEntity
  userInfo: ISpaceUser
  gitlabToken: string
  retry?: boolean
}
