import { IsEnum, IsString, IsNotEmpty } from 'class-validator'
import { EXECUTE_TASK_ACTION, TaskRequestParam } from '@/features/ticket/dto/shopee-ticket-center/execute-task.dto'

export class UpdateTasksBody {
  @IsEnum(EXECUTE_TASK_ACTION)
  action: EXECUTE_TASK_ACTION
}

export class UpdateTasksParam implements TaskRequestParam {
  @IsString()
  @IsNotEmpty()
  ticketId: string

  @IsString()
  @IsNotEmpty()
  taskId: string
}
