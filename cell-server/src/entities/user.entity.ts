import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user_tab')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number

  @Column({ type: 'varchar', name: 'email' })
  email: string

  @Column({ type: 'int', name: 'last_active_at' })
  lastActiveTime: number
}
