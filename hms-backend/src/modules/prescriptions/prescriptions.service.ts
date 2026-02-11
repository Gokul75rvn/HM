import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePrescriptionDto, UpdatePrescriptionStatusDto } from './prescriptions.dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreatePrescriptionDto, userId: string) {
    const [patient, doctor] = await Promise.all([
      this.prisma.patient.findUnique({ where: { id: dto.patientId } }),
      this.prisma.doctor.findUnique({ where: { id: dto.doctorId } }),
    ]);

    if (!patient) throw new NotFoundException('Patient not found');
    if (!doctor) throw new NotFoundException('Doctor not found');

    const prescriptionNumber = `RX-${Date.now()}`;
    const prescription = await this.prisma.$transaction(async (tx) => {
      const created = await tx.prescription.create({
        data: {
          prescriptionNumber,
          patientId: dto.patientId,
          doctorId: dto.doctorId,
          appointmentId: dto.appointmentId ?? null,
          admissionId: dto.admissionId ?? null,
          validUntil: new Date(dto.validUntil),
        },
      });

      await tx.prescriptionItem.createMany({
        data: dto.items.map((item) => ({
          prescriptionId: created.id,
          medicineId: item.medicineId,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions ?? null,
          quantity: item.quantity,
        })),
      });

      return created;
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'PRESCRIPTION',
      resourceId: prescription.id,
      newValues: dto,
    });

    return this.findById(prescription.id);
  }

  findById(id: string) {
    return this.prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        medicines: { include: { medicine: true } },
      },
    });
  }

  listByPatient(patientId: string) {
    return this.prisma.prescription.findMany({
      where: { patientId },
      include: {
        doctor: { include: { user: true } },
        medicines: { include: { medicine: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdatePrescriptionStatusDto, userId: string) {
    const existing = await this.prisma.prescription.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Prescription not found');
    }

    const updated = await this.prisma.prescription.update({
      where: { id },
      data: { status: dto.status as any },
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'PRESCRIPTION_STATUS',
      resourceId: id,
      oldValues: { status: existing.status },
      newValues: dto,
    });

    return updated;
  }
}