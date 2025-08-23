import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate password strength (basic example)
    if (!this.isPasswordStrong(createUserDto.password)) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }

    // Hash password (in production, use bcrypt or similar)
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      dateOfBirth: createUserDto.dateOfBirth
        ? new Date(createUserDto.dateOfBirth)
        : undefined,
      roles: createUserDto.roles || ['user'],
    });

    const savedUser = await this.userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'dateOfBirth',
        'phoneNumber',
        'isActive',
        'createdAt',
        'updatedAt',
        'roles',
      ],
    });
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'dateOfBirth',
        'phoneNumber',
        'isActive',
        'createdAt',
        'updatedAt',
        'roles',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'dateOfBirth',
        'phoneNumber',
        'isActive',
        'createdAt',
        'updatedAt',
        'roles',
      ],
    });
    return user;
  }

  async findByEmailForAuth(email: string): Promise<User | null> {
    // This method includes password for authentication purposes
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'dateOfBirth',
        'phoneNumber',
        'isActive',
        'createdAt',
        'updatedAt',
        'roles',
      ],
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it conflicts with existing users
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Update the user
    Object.assign(user, updateUserDto);

    // Convert dateOfBirth string to Date if provided
    if (updateUserDto.dateOfBirth) {
      user.dateOfBirth = new Date(updateUserDto.dateOfBirth);
    }

    const updatedUser = await this.userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async deactivate(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isActive = false;
    const updatedUser = await this.userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async activate(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isActive = true;
    const updatedUser = await this.userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async findByActiveStatus(active: boolean): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { isActive: active },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'dateOfBirth',
        'phoneNumber',
        'isActive',
        'createdAt',
        'updatedAt',
        'roles',
      ],
    });
    return users;
  }

  private isPasswordStrong(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }

  private async hashPassword(password: string): Promise<string> {
    // In production, use bcrypt or similar
    // For demo purposes, we'll just return the password as-is
    // TODO: Implement proper password hashing
    return password;
  }
}
