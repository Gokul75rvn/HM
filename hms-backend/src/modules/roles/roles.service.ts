import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateRoleDto, UpdateRolePermissionsDto } from './roles.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createRole(dto: CreateRoleDto, userId: string) {
    const existing = await this.prisma.roleDefinition.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Role already exists');
    }

    const role = await this.prisma.$transaction(async (tx) => {
      const created = await tx.roleDefinition.create({
        data: {
          name: dto.name,
          description: dto.description ?? null,
        },
      });

      if (dto.permissions?.length) {
        await tx.permission.createMany({
          data: dto.permissions.map((perm) => ({
            roleId: created.id,
            name: `${created.name}:${perm.resource}:${perm.action}`,
            description: perm.description ?? null,
            resource: perm.resource,
            action: perm.action,
          })),
        });
      }

      return created;
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'ROLE',
      resourceId: role.id,
      newValues: dto,
    });

    return this.findRoleById(role.id);
  }

  findRoleById(id: string) {
    return this.prisma.roleDefinition.findUnique({
      where: { id },
      include: { permissions: true },
    });
  }

  listRoles() {
    return this.prisma.roleDefinition.findMany({
      include: { permissions: true },
      orderBy: { name: 'asc' },
    });
  }

  listPermissions() {
    return this.prisma.permission.findMany({ orderBy: { resource: 'asc' } });
  }

  async updateRolePermissions(roleId: string, dto: UpdateRolePermissionsDto, userId: string) {
    const role = await this.prisma.roleDefinition.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.permission.deleteMany({ where: { roleId } });
      await tx.permission.createMany({
        data: dto.permissions.map((perm) => ({
          roleId,
          name: `${role.name}:${perm.resource}:${perm.action}`,
          description: perm.description ?? null,
          resource: perm.resource,
          action: perm.action,
        })),
      });
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'ROLE_PERMISSIONS',
      resourceId: roleId,
      newValues: dto,
    });

    return this.findRoleById(roleId);
  }
}