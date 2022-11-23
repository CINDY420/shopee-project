import { IsNotEmpty } from 'class-validator'

export class CreateSessionDto {
  @IsNotEmpty()
  googleAccessToken: string
}

export interface ICreateSessionDtoResponse {
  email: string
  name: string
  userId: number
  avatar?: string
}
