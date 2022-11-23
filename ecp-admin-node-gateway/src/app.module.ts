import { Module } from '@nestjs/common'
import { SpaceAZModule } from '@/shared/space-az/space-az.module'
import { EcpApisModule } from '@/shared/ecp-apis/ecp-apis.module'
import { AuthModule } from '@/shared/auth/auth.module'
import { ConfigModule } from '@/shared/config/config.module'
import { SegmentModule } from '@/modules/segment/segment.module'
import { ClusterModule } from '@/modules/cluster/cluster.module'
import { GlobalModule } from '@/modules/global/global.module'
import { NodeModule } from '@/modules/node/node.module'
import { TenantModule } from '@/modules/tenant/tenant.module'
import { ProjectModule } from '@/modules/project/project.module'
import { ApplicationModule } from '@/modules/application/application.module'
import { SpaceCMDBModule } from '@/shared/space-cmdb/space-cmdb.module'
import { AppClusterConfigModule } from '@/modules/app-cluster-config/app-cluster-config.module'
import { EksClusterModule } from '@/modules/eks-cluster/eks-cluster.module'
import { EksNodeModule } from '@/modules/eks-node/eks-node.module'
import { EksApisModule } from '@/shared/eks-apis/eks-apis.module'
import { EksEnumsModule } from '@/modules/eks-enums/eks-enums.module'
import { EtcdClusterModule } from '@/modules/etcd/cluster/cluster.module'
import { EtcdApisModule } from '@/shared/etcd-apis/etcd-apis.module'
import { EcpAdminApisModule } from '@/shared/ecp-admin-apis/ecp-admin-apis.module'
import { EksJobModule } from '@/modules/eks-job/eks-job.module'
import { EksPvModule } from '@/modules/eks-pv/eks-pv.module'
import { EksPvcModule } from '@/modules/eks-pvc/eks-pvc.module'
import { EksSecretModule } from '@/modules/eks-secret/eks-secret.module'
import { QuotaModule } from '@/modules/quota/quota.module'

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    ClusterModule,
    GlobalModule,
    SpaceAZModule,
    EcpApisModule,
    SpaceCMDBModule,
    NodeModule,
    SegmentModule,
    TenantModule,
    ProjectModule,
    ApplicationModule,
    AppClusterConfigModule,
    EksApisModule,
    EksClusterModule,
    EksNodeModule,
    EksEnumsModule,
    EtcdApisModule,
    EcpAdminApisModule,
    EksJobModule,
    EksPvModule,
    EksPvcModule,
    EksSecretModule,
    EtcdClusterModule,
    QuotaModule,
  ],
})
export class AppModule {}
