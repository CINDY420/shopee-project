import { IJwtBody } from '@/features/auth/strategies/jwt.strategy'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(payload: IJwtBody): string {
    const accessToken = this.jwtService.sign(payload)

    return accessToken
  }
}
