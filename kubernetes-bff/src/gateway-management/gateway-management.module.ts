import { Module, forwardRef } from '@nestjs/common'
import { IngressesService } from './ingresses/ingresses.service'
import { ClustersModule } from 'platform-management/clusters/clusters.module'
import { IngressesController } from './ingresses/ingresses.controller'
import { ServicesController } from './services/services.controller'
import { ServicesService } from './services/services.service'
import { DomainsController } from './domains/domains.controller'
import { DomainsService } from './domains/domains.service'
import { LoadBalanceController } from './load-balance/load-balance.controller'
import { LoadBalanceService } from './load-balance/load-balance.service'
import { ProjectsModule } from 'applications-management/projects/projects.module'

@Module({
  controllers: [IngressesController, DomainsController, ServicesController, LoadBalanceController],
  imports: [forwardRef(() => ClustersModule), ProjectsModule],
  providers: [IngressesService, DomainsService, ServicesService, LoadBalanceService]
})
export class GatewayManagementModule {}
