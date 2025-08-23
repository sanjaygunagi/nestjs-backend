import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '1',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @ApiProperty({
    description: 'The password for the user account (hashed)',
    example: 'hashedPassword123',
    writeOnly: true,
  })
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @ApiProperty({
    description: 'User roles for access control',
    example: ['user', 'admin'],
    type: [String],
  })
  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @ApiProperty({
    description: 'The date of birth of the user',
    example: '1990-01-01',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
