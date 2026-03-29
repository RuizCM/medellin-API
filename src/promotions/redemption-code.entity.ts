import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Promotion } from './promotion.entity';
import { User } from '../users/user.entity';

@Entity('redemption_codes')
export class RedemptionCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  promotionId: string;

  @ManyToOne(() => Promotion)
  @JoinColumn({ name: 'promotionId' })
  promotion: Promotion;

  @Column({ unique: true })
  code: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  generatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  redeemedAt: Date;
}