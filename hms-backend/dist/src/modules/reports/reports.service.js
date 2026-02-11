"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOperationalOverview() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const [patients, doctors, nurses, appointments, admissions, availableBeds, occupiedBeds, revenue, outstanding] = await Promise.all([
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map