import {
  APP_CREATION_QUEUE,
  APP_CREATION_QUEUE_TASK,
  BaseCreationQueueParams,
} from '@/common/constants/queue'
import { ApplicationCreationService } from '@/features/application/application.creation.service'
import { logger } from '@infra-node-kit/logger'
import { InjectQueue, Process, Processor } from '@nestjs/bull'
import { Job, Queue } from 'bull'

@Processor(APP_CREATION_QUEUE)
export class ApplicationConsumer {
  constructor(
    private readonly applicationCreationService: ApplicationCreationService,

    @InjectQueue(APP_CREATION_QUEUE)
    private readonly appCreationQueue: Queue,
  ) {}

  @Process(APP_CREATION_QUEUE_TASK)
  async creation(job: Job<BaseCreationQueueParams>) {
    const { jobId, key } = job.opts.repeat as any
    const { email } = job.data.userInfo

    const { isFinished, isSuccess } = await this.applicationCreationService.getCreationStatus(
      job.data,
    )

    logger.info(
      `App creation consumer: jobId=${jobId} email=${email} finished:${isFinished} success:${isSuccess}`,
    )

    if (key && isFinished) {
      await this.appCreationQueue.removeRepeatableByKey(key)
    }
  }
}
