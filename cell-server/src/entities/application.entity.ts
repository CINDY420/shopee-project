import { AppStatus } from '@/common/constants/task'
import { CurrentStageInfo } from '@/features/application/dtos/get-application.dto'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('application_tab')
export class ApplicationEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number

  @Column({ type: 'varchar', name: 'app_name' })
  appName: string

  @Column({ type: 'varchar', name: 'cmdb_project_name' })
  cmdbProjectName: string

  @Column({ type: 'varchar', name: 'cmdb_module_name' })
  cmdbModuleName: string

  @Column({ type: 'bigint', name: 'gitlab_project_id' })
  gitlabProjectId: number

  @Column({ type: 'varchar', name: 'app_description' })
  appDescription: string

  @Column({ type: 'bigint', name: 'cmdb_service_id' })
  cmdbServiceId: number

  @Column({ type: 'varchar', name: 'gitlab_repo_url' })
  gitlabRepoUrl: string

  @Column({ type: 'varchar', name: 'created_by' })
  createdBy: string

  @Column({ type: 'bigint', name: 'created_at' })
  createdAt: number

  @Column({ type: 'varchar', name: 'updated_by' })
  updatedBy: string

  @Column({ type: 'bigint', name: 'updated_at' })
  updatedAt: number

  @Column({ type: 'simple-json', name: 'app_setup_progress' })
  appSetupProgress: CurrentStageInfo

  @Column({ type: 'int', name: 'app_status' })
  appStatus: AppStatus

  @Column({ type: 'bigint', name: 'fe_workbench_app_id' })
  feWorkbenchAppId: number
}
