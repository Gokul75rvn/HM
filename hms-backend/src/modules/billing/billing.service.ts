import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { GenerateBillDto } from './billing.dto';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async generateBill(dto: GenerateBillDto, userId: string) {
    const subtotal = dto.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = Math.round(subtotal * 0.12);
    const discount = dto.discount ?? 0;
    const total = subtotal + tax - discount;

    const billNumber = `BILL-${Date.now()}`;
    const bill = await this.prisma.$transaction(async (tx) => {
      const created = await tx.bill.create({
        data: {
          billNumber,
          patientId: dto.patientId,
          billType: dto.billType as any,
          appointmentId: dto.appointmentId ?? null,
          admissionId: dto.admissionId ?? null,
          prescriptionId: dto.prescriptionId ?? null,
          dueDate: new Date(dto.dueDate),
          status: 'GENERATED',
          subtotal,
          tax,
          discount,
          totalAmount: total,
        },
      });

      await tx.billItem.createMany({
        data: dto.items.map((item) => ({
          billId: created.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),
      });

      return created;
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'BILL',
      resourceId: bill.id,
      newValues: dto,
    });

    return this.getBillById(bill.id);
  }

  getBillById(id: string) {
    return this.prisma.bill.findUnique({
      where: { id },
      include: {
        items: true,
        patient: { include: { user: true } },
        payments: true,
        insuranceClaims: true,
      },
    });
  }

  listBills(patientId?: string) {
    return this.prisma.bill.findMany({
      where: patientId ? { patientId } : undefined,
      include: {
        patient: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markStatus(id: string, status: string, userId: string) {
    const bill = await this.prisma.bill.findUnique({ where: { id } });
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    const updated = await this.prisma.bill.update({
      where: { id },
      data: { status: status as any },
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'BILL_STATUS',
      resourceId: id,
      oldValues: { status: bill.status },
      newValues: { status },
    });

    return updated;
  }
}