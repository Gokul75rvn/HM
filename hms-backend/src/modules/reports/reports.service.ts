import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOperationalOverview() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [patients, doctors, nurses, appointments, admissions, availableBeds, occupiedBeds, revenue, outstanding] =
      await Promise.all([
        this.prisma.patient.count(),
        this.prisma.doctor.count(),
        this.prisma.nurse.count(),
        this.prisma.appointment.count({ where: { status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] } } }),
        this.prisma.admission.count({ where: { status: { in: ['ADMITTED', 'UNDER_TREATMENT'] } } }),
        this.prisma.bed.count({ where: { status: 'AVAILABLE' } }),
        this.prisma.bed.count({ where: { status: 'OCCUPIED' } }),
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'COMPLETED',
            createdAt: { gte: monthStart },
          },
        }),
        this.prisma.bill.aggregate({
          _sum: { totalAmount: true, paidAmount: true },
        }),
      ]);

    const totalRevenue = revenue._sum.amount ?? 0;
    const outstandingAmount = (outstanding._sum.totalAmount ?? 0) - (outstanding._sum.paidAmount ?? 0);

    return {
      patients,
      doctors,
      nurses,
      liveAppointments: appointments,
      activeAdmissions: admissions,
      beds: {
        available: availableBeds,
        occupied: occupiedBeds,
      },
      revenue: totalRevenue,
      outstanding: outstandingAmount,
    };
  }
}