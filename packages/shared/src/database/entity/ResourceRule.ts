import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'book_rule' })
export class BookRule {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'uid', type: 'integer', default: 0 })
  uid!: number
  // =====================================================

  // =====================================================

  @Column({ name: 'create_time', type: 'integer', default: 0 })
  createTime!: number

  @Column({ name: 'update_time', type: 'integer', default: 0 })
  updateTime!: number
}
