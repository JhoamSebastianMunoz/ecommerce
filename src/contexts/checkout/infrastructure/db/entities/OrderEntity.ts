import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { OrderItemEntity } from './OrderItemEntity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, name: 'customer_id' })
  customerId!: string;

  @Column({ type: 'uuid', name: 'cart_id', nullable: true })
  cartId!: string | null;

  @Column({ type: 'varchar', length: 50 })
  status!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount' })
  totalAmount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'discount_amount', default: 0 })
  discountAmount!: number;

  @Column({ type: 'varchar', length: 255, name: 'shipping_street' })
  shippingStreet!: string;

  @Column({ type: 'varchar', length: 100, name: 'shipping_city' })
  shippingCity!: string;

  @Column({ type: 'varchar', length: 100, name: 'shipping_state', nullable: true })
  shippingState!: string | null;

  @Column({ type: 'varchar', length: 20, name: 'shipping_postal_code' })
  shippingPostalCode!: string;

  @Column({ type: 'varchar', length: 2, name: 'shipping_country' })
  shippingCountry!: string;

  @Column({ type: 'varchar', length: 100, name: 'idempotency_key', nullable: true, unique: true })
  idempotencyKey?: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  @JoinColumn()
  items!: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
