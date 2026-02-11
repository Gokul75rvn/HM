import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateStaffDto, UpdateStaffAssignmentDto } from './staff.dto';

const STAFF_ROLES = ['NURSE', 'RECEPTIONIST', 'LAB_TECH', 'PHARMACIST', 'ACCOUNTANT', 'STAFF'];

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createStaff(dto: CreateStaffDto, userId: string) {
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    const registrationId = `${dto.role.slice(0, 3)}-${uuid().slice(0, 6).toUpperCase()}`;
    const temporaryPassword = uuid().slice(0, 8);
    const password = await bcrypt.hash(temporaryPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        registrationId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone ?? null,
        password,
        hospitalId: 'DEFAULT',
        role: dto.role as any,
        status: 'ACTIVE',
      },
    });

    await this.createRoleProfile(dto.role, user.id, dto);

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'STAFF',
      resourceId: user.id,
      newValues: dto,
    });

    return this.getStaffByUserId(user.id);
  }

  async createRoleProfile(role: string, userId: string, dto: CreateStaffDto) {
    switch (role) {
      case 'NURSE':
        return this.prisma.nurse.create({
          data: {
            userId,
            specialization: dto.designation,
            wardId: dto.wardId ?? null,
          },
        });
      case 'RECEPTIONIST':
        return this.prisma.receptionist.create({
          data: {
            userId,
            departmentId: dto.departmentId ?? null,
          },
        });
      case 'LAB_TECH':
        return this.prisma.labTech.create({
          data: {
            userId,
            certifications: dto.designation,
          },
        });
      case 'PHARMACIST':
        return this.prisma.pharmacist.create({
          data: {
            userId,
            licenseNumber: `LIC-${uuid().slice(0, 8).toUpperCase()}`,
          },
        });
      case 'ACCOUNTANT':
        return this.prisma.accountant.create({
          data: {
            userId,
            departmentId: dto.departmentId ?? null,
          },
        });
      default:
        return this.prisma.staff.create({
          data: {
            userId,
            designation: dto.designation,
            departmentId: dto.departmentId ?? null,
          },
        });
    }
  }

  listStaff(role?: string) {
    const rolesFilter = role ? [role] : STAFF_ROLES;
    return this.prisma.user.findMany({
      where: { role: { in: rolesFilter as any } },
      include: {
        staff: true,
        nurse: { include: { ward: true } },
        receptionist: true,
        labTech: true,
        pharmacist: true,
        accountant: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStaffByUserId(userId: string) {
    const staff = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        staff: true,
        nurse: { include: { ward: true } },
        receptionist: true,
        labTech: true,
        pharmacist: true,
        accountant: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return staff;
  }

  async updateAssignment(userId: string, dto: UpdateStaffAssignmentDto, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Staff user not found');
    }

    switch (user.role) {
      case 'NURSE':
        await this.prisma.nurse.update({
          where: { userId },
          data: {
            wardId: dto.wardId ?? undefined,
            specialization: dto.designation ?? undefined,
          },
        });
        break;
      case 'RECEPTIONIST':
        await this.prisma.receptionist.update({
          where: { userId },
          data: { departmentId: dto.departmentId ?? undefined },
        });
        break;
      case 'LAB_TECH':
        await this.prisma.labTech.update({
          where: { userId },
          data: { specializations: dto.designation ?? undefined },
        });
        break;
      case 'PHARMACIST':
        await this.prisma.pharmacist.update({
          where: { userId },
          data: {},
        });
        break;
      case 'ACCOUNTANT':
        await this.prisma.accountant.update({
          where: { userId },
          data: { departmentId: dto.departmentId ?? undefined },
        });
        break;
      default:
        await this.prisma.staff.update({
          where: { userId },
          data: {
            designation: dto.designation ?? undefined,
            departmentId: dto.departmentId ?? undefined,
          },
        });
        break;
    }

    await this.audit.log({
      userId: adminId,
      action: 'UPDATE',
      resource: 'STAFF_ASSIGNMENT',
      resourceId: userId,
      newValues: dto,
    });

    return this.getStaffByUserId(userId);
  }
}