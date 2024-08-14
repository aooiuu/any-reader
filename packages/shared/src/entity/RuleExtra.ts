import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ResourceRule } from './ResourceRule';

@Entity({ name: 'rule_extra' })
export class RuleExtra {
  @PrimaryColumn({ name: 'rule_id', type: 'text', comment: '规则Id' })
  ruleId!: string;

  @Column({ name: 'ping', type: 'integer', default: 0, comment: '延迟' })
  ping!: number;

  // =====================================================

  @Column({ name: 'create_time', type: 'integer', default: 0 })
  createTime!: number;

  @Column({ name: 'update_time', type: 'integer', default: 0 })
  updateTime!: number;

  @OneToOne(() => ResourceRule, (e) => e.id, {
    createForeignKeyConstraints: false
  })
  @JoinColumn({ name: 'rule_id' })
  rule!: ResourceRule;
}
