import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './users.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(createUserDto: CreateUserDto, userId: string): Promise<UserResponseDto> {
    const { registrationId, email, phone, password, ...rest } = createUserDto;

    // Check if registrationId already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { registrationId },
    });

    if (existingUser) {
      throw new ConflictException('Registration ID already exists');
    }

    if (email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already in use');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        registrationId,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        ...rest,
      },
    });

    // Log audit
    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'USER',
      resourceId: user.id,
      newValues: {
        registrationId: user.registrationId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    return this.formatUserResponse(user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: UserResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      data: users.map((u) => this.formatUserResponse(u)),
      total,
    };
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        permissions: true,
        doctor: true,
        patient: true,
        staff: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    return this.formatUserResponse(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto, userId: string): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.deletedAt) {
      throw new NotFoundException('User not found');
    }

    // Check for duplicate email
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const duplicate = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (duplicate) {
        throw new ConflictException('Email already in use');
      }
    }

    // Check for duplicate phone
    if (updateUserDto.phone && updateUserDto.phone !== existingUser.phone) {
      const duplicate = await this.prisma.user.findUnique({
        where: { phone: updateUserDto.phone },
      });
      if (duplicate) {
        throw new ConflictException('Phone number already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    // Log audit
    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'USER',
      resourceId: id,
      oldValues: existingUser,
      newValues: updateUserDto,
    });

    return this.formatUserResponse(updatedUser);
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Log audit
    await this.audit.log({
      userId,
      action: 'DELETE',
      resource: 'USER',
      resourceId: id,
      oldValues: user,
    });

    return { message: 'User deleted successfully' };
  }

  async findByRegistrationId(registrationId: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { registrationId },
    });

    if (!user || user.deletedAt) {
      return null;
    }

    return this.formatUserResponse(user);
  }

  async assignRole(userId: string, role: string, adminId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });

    // Log audit
    await this.audit.log({
      userId: adminId,
      action: 'UPDATE',
      resource: 'USER_ROLE',
      resourceId: userId,
      newValues: { role },
    });

    return this.formatUserResponse(updatedUser);
  }

  private formatUserResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      registrationId: user.registrationId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
