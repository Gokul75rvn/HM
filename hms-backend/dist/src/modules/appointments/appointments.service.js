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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(data, userId) {
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
    async findById(id) {
        return this.prisma.appointment.findUnique({
            where: { id },
            include: { patient: { include: { user: true } }, doctor: { include: { user: true } }, department: true },
        });
    }
    async updateStatus(id, status, userId) {
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { status: status },
            include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
        });
        await this.audit.log({ userId, action: 'UPDATE', resource: 'APPOINTMENT', resourceId: id, newValues: { status } });
        return updated;
    }
    async findByPatient(patientId) {
        return this.prisma.appointment.findMany({
            where: { patientId },
            include: { doctor: { include: { user: true } }, department: true },
            orderBy: { appointmentDate: 'desc' },
        });
    }
    async findByDoctor(doctorId) {
        return this.prisma.appointment.findMany({
            where: { doctorId },
            include: { patient: { include: { user: true } } },
            orderBy: { appointmentDate: 'asc' },
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map