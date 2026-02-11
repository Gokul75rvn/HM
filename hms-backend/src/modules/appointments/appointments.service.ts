import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async create(data: any, userId: string) {
    const appointment = await this.prisma.appointment.create({
      data: { ...data, appointmentNumber: `APT-${Date.now()}` },
      include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
    });
    await this.audit.log({ userId, action: 'CREATE', resource: 'APPOINTMENT', resourceId: appointment.id });
    return appointment;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        skip,
        take: limit,
        include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
        orderBy: { appointmentDate: 'desc' },
      }),
      this.prisma.appointment.count(),
    ]);
    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: { include: { user: true } }, doctor: { include: { user: true } }, department: true },
    });
  }

  async updateStatus(id: string, status: string, userId: string) {
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
      include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
    });
    await this.audit.log({ userId, action: 'UPDATE', resource: 'APPOINTMENT', resourceId: id, newValues: { status } });
    return updated;
  }

  async findByPatient(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      include: { doctor: { include: { user: true } }, department: true },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  async findByDoctor(doctorId: string) {
    return this.prisma.appointment.findMany({
      where: { doctorId },
      include: { patient: { include: { user: true } } },
      orderBy: { appointmentDate: 'asc' },
    });
  }
}
