import { ConfigService, ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { DirectoryService } from './directory.service'
import configuration from 'common/config/configuration'
import { ESService } from 'common/modules/es/es.service'
import { AuthService } from 'common/modules/auth/auth.service'

describe('DirectoryService', () => {
  let service: DirectoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      providers: [DirectoryService, ConfigService, ESService, AuthService]
    }).compile()

    service = module.get<DirectoryService>(DirectoryService)
  })

  it.skip('should be defined', () => {
    expect(service).toBeDefined()
  })
})
