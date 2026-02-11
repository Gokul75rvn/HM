import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, userId: string) {
    const existing = await this.prisma.department.findUnique({
      where: { code: createDepartmentDto.code },
    });

    if (existing) {
      throw new ConflictException('Department code already exists');
    }

    const department = await this.prisma.department.create({
      data: createDepartmentDto,
      include: { head: true },
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'DEPARTMENT',
      resourceId: department.id,
      newValues: createDepartmentDto,
    });

    return department;
  }

  async findAll() {
    return this.prisma.department.findMany({
      include: { head: { include: { user: true } }, _count: { select: { doctors: true, wards: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: { head: { include: { user: true } }, doctors: { include: { user: true } } },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto, userId: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const updated = await this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
      include: { head: true },
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'DEPARTMENT',
      resourceId: id,
      newValues: updateDepartmentDto,
    });

    return updated;
  }
}
