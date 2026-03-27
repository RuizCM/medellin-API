import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('places')
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column()
  schedule: string;

  @Column()
  priceRange: string;

  @Column('decimal', { precision: 10, scale: 7 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  lng: number;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column('simple-array', { nullable: true })
  ambiente: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  businessId: string;

  @CreateDateColumn()
  createdAt: Date;
}