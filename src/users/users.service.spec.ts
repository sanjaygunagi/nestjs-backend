import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        dateOfBirth: '1990-01-01',
        phoneNumber: '+1234567890',
      };

      const result = service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.firstName).toBe(createUserDto.firstName);
      expect(result.lastName).toBe(createUserDto.lastName);
      expect(result.email).toBe(createUserDto.email);
      expect(result.isActive).toBe(true);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      // Password should not be returned
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictException if email already exists', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
      };

      // Create first user
      service.create(createUserDto);

      // Try to create second user with same email
      expect(() => service.create(createUserDto)).toThrow(ConflictException);
      expect(() => service.create(createUserDto)).toThrow('User with this email already exists');
    });

    it('should throw BadRequestException for weak password', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'weak',
      };

      expect(() => service.create(createUserDto)).toThrow(BadRequestException);
      expect(() => service.create(createUserDto)).toThrow('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no users exist', () => {
      const result = service.findAll();
      expect(result).toEqual([]);
    });

    it('should return all users without passwords', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
      };

      service.create(createUserDto);
      const result = service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('should return user by ID', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
      };

      const createdUser = service.create(createUserDto);
      const result = service.findOne(createdUser.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdUser.id);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException for non-existent user', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow('User with ID 999 not found');
    });
  });

  describe('update', () => {
    it('should update user successfully', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
      };

      const createdUser = service.create(createUserDto);
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const result = service.update(createdUser.id, updateUserDto);

      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
      expect(result.updatedAt).toBeDefined();
    });

    it('should throw NotFoundException for non-existent user', () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
      };

      expect(() => service.update(999, updateUserDto)).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove user successfully', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
      };

      const createdUser = service.create(createUserDto);
      expect(service.findAll()).toHaveLength(1);

      service.remove(createdUser.id);
      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException for non-existent user', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });

  describe('deactivate and activate', () => {
    it('should deactivate and activate user successfully', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
      };

      const createdUser = service.create(createUserDto);
      expect(createdUser.isActive).toBe(true);

      const deactivatedUser = service.deactivate(createdUser.id);
      expect(deactivatedUser.isActive).toBe(false);

      const activatedUser = service.activate(createdUser.id);
      expect(activatedUser.isActive).toBe(true);
    });
  });
});
