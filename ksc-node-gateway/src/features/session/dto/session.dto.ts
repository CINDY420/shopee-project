import { IsNotEmpty, IsString } from 'class-validator'

export class CreateSessionPayload {
  @IsNotEmpty()
  @IsString()
  googleAccessToken: string
}

export class CreateSessionResponse {
  email: string
  name: string
  userId: string
  avatar: string
}
