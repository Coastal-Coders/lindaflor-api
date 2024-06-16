import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './user.model';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { NotFoundException } from '@nestjs/common';
import { getPrismaService } from 'src/prisma/prisma.singleton';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useFactory: getPrismaService }],
    }).compile();
    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to access PrismaService', async () => {
    expect(prisma).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDtoMock: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      };
      const result: User = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'GUEST',
        ...createUserDtoMock,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(result);

      expect(await service.createUser(createUserDtoMock)).toBe(result);
    });

    it('should throw a ValidationException if email is already in use', async () => {
      const createUserDtoMock: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      };
      const existingUser: User = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'GUEST',
        ...createUserDtoMock,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(existingUser);
      await expect(service.createUser(createUserDtoMock)).rejects.toThrow(
        'This email is already in use'
      );
    });

    it('should throw an error if user creation fails', async () => {
      const createUserDtoMock: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockRejectedValue(new Error('Failed to create user'));

      await expect(service.createUser(createUserDtoMock)).rejects.toThrow('Failed to create user');
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          password: '123456',
          role: 'GUEST',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(result);

      expect(await service.getAllUsers()).toBe(result);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const result: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        role: 'GUEST',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(result);

      await expect(service.getUserById('1')).resolves.toBe(result);
    });

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.getUserById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDtoMock: UpdateUserDto = { name: 'Updated User' };
      const existingUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        role: 'GUEST',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...updateUserDtoMock,
      };

      const updatedUser: User = {
        ...existingUser,
        ...updateUserDtoMock,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(existingUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(updatedUser);

      const result = await service.updateUser('1', updateUserDtoMock);

      expect(result).toEqual(updatedUser);
    });

    it('should throw a NotFoundException if user to update not found', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.updateUser('1', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        role: 'GUEST',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(result);
      jest.spyOn(prisma.user, 'delete').mockResolvedValue(result);

      expect(await service.deleteUser('1')).toBeUndefined();
    });

    it('should throw a NotFoundException if user to delete not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteUser('1')).rejects.toThrow(NotFoundException);
    });
  });
});
