import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateWardDto, UpdateWardDto, CreateBedDto } from './beds.dto';

@Injectable()
export class BedsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createWard(dto: CreateWardDto, userId: string) {
    const ward = await this.prisma.ward.create({
      data: {
        name: dto.name,
        type: dto.type,
        departmentId: dto.departmentId,
        totalBeds: dto.totalBeds ?? 0,
      },
      include: {
        department: true,
      },
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'WARD',
      resourceId: ward.id,
      newValues: dto,
    });

    return ward;
  }

  async listWards() {
    return this.prisma.ward.findMany({
      include: {
        department: true,
        beds: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async updateWard(id: string, dto: UpdateWardDto, userId: string) {
    const existing = await this.prisma.ward.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Ward not found');
    }

    const ward = await this.prisma.ward.update({
      where: { id },
      data: dto,
      include: { department: true },
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'WARD',
      resourceId: id,
      oldValues: existing,
      newValues: dto,
    });

    return ward;
  }

  async createBed(dto: CreateBedDto, userId: string) {
    const ward = await this.prisma.ward.findUnique({ where: { id: dto.wardId } });
    if (!ward) {
      throw new NotFoundException('Ward not found');
    }

    const existingBed = await this.prisma.bed.findUnique({ where: { bedNumber: dto.bedNumber } });
    if (existingBed) {
      throw new ConflictException('Bed number already exists');
    }

    const bed = await this.prisma.$transaction(async (tx) => {
      const created = await tx.bed.create({
        data: {
          bedNumber: dto.bedNumber,
          wardId: dto.wardId,
          bedType: dto.bedType,
          charges: dto.charges ?? 0,
        },
        include: { ward: true },
      });

      await tx.ward.update({
        where: { id: dto.wardId },
        data: { totalBeds: { increment: 1 } },
      });

      return created;
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'BED',
      resourceId: bed.id,
      newValues: dto,
    });

    return bed;
  }

  async listBeds(filters: { wardId?: string; status?: string }) {
    return this.prisma.bed.findMany({
      where: {
        wardId: filters.wardId,
        status: filters.status as any,
      },
      include: { ward: true },
      orderBy: { bedNumber: 'asc' },
    });
  }

  async updateBedStatus(id: string, status: string, userId: string) {
    const bed = await this.prisma.bed.findUnique({
      where: { id },
      include: { ward: true },
    });
    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    const wasOccupied = bed.status === 'OCCUPIED';
    const becomesOccupied = status === 'OCCUPIED';

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.bed.update({
        where: { id },
        data: { status: status as any },
        include: { ward: true },
      });

      if (bed.wardId && wasOccupied !== becomesOccupied) {
        const nextCount = Math.max(
          0,
          (bed.ward?.occupiedBeds ?? 0) + (becomesOccupied ? 1 : -1),
        );

        await tx.ward.update({
          where: { id: bed.wardId },
          data: {
            occupiedBeds: nextCount,
          },
        });
      }

      return next;
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'BED_STATUS',
      resourceId: id,
      oldValues: { status: bed.status },
      newValues: { status },
    });

    return updated;
  }

  async getAvailableBeds(wardId?: string) {
    return this.prisma.bed.findMany({
      where: {
        status: 'AVAILABLE',
        wardId,
      },
      include: { ward: true },
      orderBy: { updatedAt: 'desc' },
    });
  }
}