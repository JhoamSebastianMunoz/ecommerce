import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('promotions')
export class PromotionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 20, name: 'discount_type' })
  discountType!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'discount_value' })
  discountValue!: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'min_purchase_amount',
    default: 0.0,
  })
  minPurchaseAmount!: number;

  @Column({ type: 'timestamp with time zone', name: 'start_date' })
  startDate!: Date;

  @Column({ type: 'timestamp with time zone', name: 'end_date' })
  endDate!: Date;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
