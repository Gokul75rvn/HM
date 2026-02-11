import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { DispensePrescriptionDto } from './pharmacy.dto';

type PrescriptionMedicineItem = {
  id: string;
  medicineId: string;
  medicine: { id: string; name: string; stock: number };
};

@Injectable()
export class PharmacyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  listQueue(status?: string) {
    const defaultStatuses = ['PENDING', 'ISSUED', 'PARTIALLY_DISPENSED'];
    return this.prisma.prescription.findMany({
      where: {
        status: status ? (status as any) : { in: defaultStatuses as any },
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        medicines: { include: { medicine: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async dispense(dto: DispensePrescriptionDto, userId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: dto.prescriptionId },
      include: {
        medicines: { include: { medicine: true } },
      },
    });

    if (!prescription) throw new NotFoundException('Prescription not found');
    if (prescription.status === 'CANCELLED') {
      throw new BadRequestException('Cancelled prescription cannot be dispensed');
    }

    const medicineItems = prescription.medicines as PrescriptionMedicineItem[];
    const itemsMap = new Map<string, PrescriptionMedicineItem>(
      medicineItems.map((item) => [item.id, item]),
    );

    const updated = await this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        const prescriptionItem = itemsMap.get(item.prescriptionItemId);
        if (!prescriptionItem) {
          throw new BadRequestException('Invalid prescription item');
        }

        if (prescriptionItem.medicine.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${prescriptionItem.medicine.name}`,
          );
        }

        await tx.medicine.update({
          where: { id: prescriptionItem.medicineId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const status = dto.items.length === prescription.medicines.length ? 'FULLY_DISPENSED' : 'PARTIALLY_DISPENSED';

      return tx.prescription.update({
        where: { id: dto.prescriptionId },
        data: {
          status: status as any,
        },
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
          medicines: { include: { medicine: true } },
        },
      });
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'PRESCRIPTION_DISPENSE',
      resourceId: dto.prescriptionId,
      newValues: dto,
    });

    return updated;
  }
}