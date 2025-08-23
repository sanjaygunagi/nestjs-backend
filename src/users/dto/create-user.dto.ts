import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User roles for access control',
    example: ['user'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(['user', 'admin', 'moderator'], { each: true })
  roles?: string[];

  @ApiProperty({
    description: 'The date of birth of the user',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
