import { ConfigService, ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { ESService } from 'common/modules/es/es.service'
import { DirectoryController } from './directory.controller'
import { DirectoryService } from './directory.service'
import configuration from 'common/config/configuration'
import { AuthService } from 'common/modules/auth/auth.service'

describe('DirectoryController', () => {
  let controller: DirectoryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [DirectoryController],
      providers: [DirectoryService, ESService, ConfigService, AuthService]
    }).compile()

    controller = module.get<DirectoryController>(DirectoryController)
  })

  it.skip('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
