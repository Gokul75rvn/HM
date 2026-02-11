import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateAdmissionDto, DischargeAdmissionDto } from './admissions.dto';

@Injectable()
export class AdmissionsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async create(dto: CreateAdmissionDto, userId: string) {
    if (dto.bedId) {
      const bed = await this.prisma.bed.findUnique({ where: { id: dto.bedId } });
      if (!bed) throw new NotFoundException('Bed not found');
      if (bed.status !== 'AVAILABLE') {
        throw new BadRequestException('Bed is not available');
      }
    }

    const admissionNumber = `ADM-${Date.now()}`;
    const admission = await this.prisma.$transaction(async (tx) => {
      const created = await tx.admission.create({
        data: {
          admissionNumber,
          patientId: dto.patientId,
          departmentId: dto.departmentId,
          doctorId: dto.doctorId,
          bedId: dto.bedId ?? null,
          reason: dto.reason,
          diagnosis: dto.diagnosis,
        },
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
          bed: true,
        },
      });

      if (dto.bedId) {
        await tx.bed.update({
          where: { id: dto.bedId },
          data: { status: 'OCCUPIED' },
        });
      }

      return created;
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'ADMISSION',
      resourceId: admission.id,
      newValues: dto,
    });

    return admission;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.admission.findMany({
        skip,
        take: limit,
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
          department: true,
          bed: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.admission.count(),
    ]);

    return { data, total, page, limit };
  }

  async discharge(id: string, dto: DischargeAdmissionDto, userId: string) {
    const admission = await this.prisma.admission.findUnique({ where: { id } });
    if (!admission) throw new NotFoundException('Admission not found');
    if (admission.status === 'DISCHARGED') {
      throw new BadRequestException('Admission already discharged');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const discharged = await tx.admission.update({
        where: { id },
        data: {
          status: 'DISCHARGED',
          dischargeDate: dto.dischargeDate ? new Date(dto.dischargeDate) : new Date(),
          treatment: dto.dischargeSummary,
        },
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
          bed: true,
        },
      });

      if (admission.bedId) {
        await tx.bed.update({
          where: { id: admission.bedId },
          data: { status: 'AVAILABLE' },
        });
      }

      return discharged;
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'ADMISSION',
      resourceId: id,
      newValues: { status: 'DISCHARGED', ...dto },
    });

    return updated;
  }
}
