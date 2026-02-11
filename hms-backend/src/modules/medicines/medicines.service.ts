import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateMedicineDto, UpdateMedicineDto } from './medicines.dto';

@Injectable()
export class MedicinesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateMedicineDto, userId: string) {
    const existing = await this.prisma.medicine.findFirst({
      where: {
        OR: [{ name: dto.name }, { batchNumber: dto.batchNumber }],
      },
    });

    if (existing) {
      throw new ConflictException('Medicine with same name or batch already exists');
    }

    const medicine = await this.prisma.medicine.create({
      data: {
        name: dto.name,
        genericName: dto.genericName,
        composition: dto.composition,
        manufacturer: dto.manufacturer,
        batchNumber: dto.batchNumber,
        expiryDate: new Date(dto.expiryDate),
        unit: dto.unit as any,
        price: dto.price,
        stock: dto.stock,
        reorderLevel: dto.reorderLevel ?? 50,
      },
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'MEDICINE',
      resourceId: medicine.id,
      newValues: dto,
    });

    return medicine;
  }

  list(search?: string) {
    return this.prisma.medicine.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { genericName: { contains: search } },
            ],
          }
        : undefined,
      orderBy: [{ expiryDate: 'asc' }],
    });
  }

  async update(id: string, dto: UpdateMedicineDto, userId: string) {
    const medicine = await this.prisma.medicine.findUnique({ where: { id } });
    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    const updated = await this.prisma.medicine.update({
      where: { id },
      data: {
        ...dto,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      },
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'MEDICINE',
      resourceId: id,
      oldValues: medicine,
      newValues: dto,
    });

    return updated;
  }

  async getLowStock() {
    const medicines = await this.prisma.medicine.findMany();
    return medicines.filter((medicine) => medicine.stock <= medicine.reorderLevel);
  }
}