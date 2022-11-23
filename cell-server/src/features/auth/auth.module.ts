import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '@/features/auth/strategies/jwt.strategy'
import { GitlabStrategy } from '@/features/auth/strategies/gitlab.strategy'
import { jwtConstants } from '@/common/constants/jwt'
import { AuthService } from '@/features/auth/auth.service'
import { AuthController } from '@/features/auth/auth.controller'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      verifyOptions: { ignoreExpiration: true },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GitlabStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
