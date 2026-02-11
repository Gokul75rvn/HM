import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateLabTestDto, CreateLabOrderDto, UpdateLabOrderStatusDto, CreateLabResultDto } from './lab.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LabService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createTest(dto: CreateLabTestDto, userId: string) {
    const testCode = dto.testCode ?? `LT-${uuid().slice(0, 8).toUpperCase()}`;

    const exists = await this.prisma.labTest.findUnique({ where: { testCode } });
    if (exists) {
      throw new ConflictException('Test code already exists');
    }

    const test = await this.prisma.labTest.create({
      data: {
        testCode,
        name: dto.name,
        description: dto.description ?? null,
        cost: dto.cost ?? 0,
      },
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'LAB_TEST',
      resourceId: test.id,
      newValues: dto,
    });

    return test;
  }

  listTests() {
    return this.prisma.labTest.findMany({ orderBy: { name: 'asc' } });
  }

  async createOrder(dto: CreateLabOrderDto, userId: string) {
    const [patient, doctor, test] = await Promise.all([
      this.prisma.patient.findUnique({ where: { id: dto.patientId } }),
      this.prisma.doctor.findUnique({ where: { id: dto.doctorId } }),
      this.prisma.labTest.findUnique({ where: { id: dto.testId } }),
    ]);

    if (!patient) throw new NotFoundException('Patient not found');
    if (!doctor) throw new NotFoundException('Doctor not found');
    if (!test) throw new NotFoundException('Lab test not found');

    const orderNumber = `LAB-${Date.now()}`;
    const order = await this.prisma.labOrder.create({
      data: {
        orderNumber,
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        testId: dto.testId,
        sampleType: dto.sampleType ?? null,
        notes: dto.notes ?? null,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        test: true,
      },
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'LAB_ORDER',
      resourceId: order.id,
      newValues: dto,
    });

    return order;
  }

  listOrders(status?: string) {
    return this.prisma.labOrder.findMany({
      where: { status: status as any },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        test: true,
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(id: string, dto: UpdateLabOrderStatusDto, userId: string) {
    const order = await this.prisma.labOrder.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Lab order not found');
    }

    if (order.status === 'COMPLETED' && dto.status !== 'COMPLETED') {
      throw new BadRequestException('Completed orders cannot change status');
    }

    const updated = await this.prisma.labOrder.update({
      where: { id },
      data: { status: dto.status as any },
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'LAB_ORDER_STATUS',
      resourceId: id,
      oldValues: { status: order.status },
      newValues: dto,
    });

    return updated;
  }

  async createResult(dto: CreateLabResultDto, userId: string) {
    const order = await this.prisma.labOrder.findUnique({
      where: { id: dto.orderId },
      include: { patient: true, test: true },
    });

    if (!order) {
      throw new NotFoundException('Lab order not found');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Cannot upload result for cancelled order');
    }

    const existingResult = await this.prisma.labResult.findUnique({ where: { orderId: dto.orderId } });
    if (existingResult) {
      throw new ConflictException('Result already uploaded for this order');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const created = await tx.labResult.create({
        data: {
          orderId: dto.orderId,
          patientId: order.patientId,
          testId: order.testId,
          value: dto.value,
          normalRange: dto.normalRange ?? null,
          unit: dto.unit ?? null,
          isAbnormal: dto.isAbnormal ?? false,
          remarks: dto.remarks ?? null,
        },
        include: { test: true },
      });

      await tx.labOrder.update({
        where: { id: dto.orderId },
        data: { status: 'COMPLETED' },
      });

      return created;
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'LAB_RESULT',
      resourceId: result.id,
      newValues: dto,
    });

    return result;
  }
}