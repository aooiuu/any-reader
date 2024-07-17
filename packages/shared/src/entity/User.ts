import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user' })
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'username', type: 'text', default: 0, length: 32 })
  username!: string

  @Column({ name: 'password', type: 'text', default: 0, length: 32 })
  password!: string

  @Column({ name: 'create_time', type: 'integer', default: 0 })
  createTime!: number

  @Column({ name: 'update_time', type: 'integer', default: 0 })
  updateTime!: number
}
