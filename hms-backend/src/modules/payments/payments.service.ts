import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePaymentDto } from './payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreatePaymentDto, userId: string) {
    const bill = await this.prisma.bill.findUnique({ where: { id: dto.billId } });
    if (!bill) throw new NotFoundException('Bill not found');
    if (bill.patientId !== dto.patientId) {
      throw new BadRequestException('Bill does not belong to patient');
    }

    const outstanding = bill.totalAmount - bill.paidAmount;
    if (dto.amount > outstanding) {
      throw new BadRequestException('Amount exceeds outstanding balance');
    }

    const paymentNumber = `PAY-${Date.now()}`;

    const payment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          paymentNumber,
          billId: dto.billId,
          patientId: dto.patientId,
          amount: dto.amount,
          method: dto.method as any,
          status: 'COMPLETED',
          transactionId: dto.transactionId ?? null,
          reference: dto.reference ?? null,
        },
      });

      const newPaidAmount = bill.paidAmount + dto.amount;
      await tx.bill.update({
        where: { id: dto.billId },
        data: {
          paidAmount: newPaidAmount,
          status: newPaidAmount >= bill.totalAmount ? 'PAID' : 'PARTIAL',
        },
      });

      return created;
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'PAYMENT',
      resourceId: payment.id,
      newValues: dto,
    });

    return payment;
  }

  list(patientId?: string) {
    return this.prisma.payment.findMany({
      where: patientId ? { patientId } : undefined,
      include: {
        bill: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}