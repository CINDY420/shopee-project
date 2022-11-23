import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('subscription_tab')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number

  @Column({ type: 'varchar', name: 'created_by' })
  createdBy: string

  @Column({ type: 'bigint', name: 'created_at' })
  createdAt: number

  @Column({ type: 'bigint', name: 'app_id' })
  appId: number
}
