import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'chapter_history' })
@Index(['ruleId', 'filePath', 'chapterPath'], { unique: true })
export class ChapterHistory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'uid', type: 'integer', default: 0 })
  uid!: number

  @Column({ name: 'rule_id', type: 'text', default: '' })
  ruleId!: string

  @Column({ name: 'file_path', type: 'text', default: '' })
  filePath!: string

  @Column({ name: 'chapter_path', type: 'text', default: '' })
  chapterPath!: string

  @Column({ name: 'percentage', type: 'integer', default: 0 })
  percentage!: number

  @Column({ name: 'create_time', type: 'integer', default: 0 })
  createTime!: number

  @Column({ name: 'update_time', type: 'integer', default: 0 })
  updateTime!: number
}
