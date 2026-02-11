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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let PrescriptionsService = class PrescriptionsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(dto, userId) {
        const [patient, doctor] = await Promise.all([
            this.prisma.patient.findUnique({ where: { id: dto.patientId } }),
            this.prisma.doctor.findUnique({ where: { id: dto.doctorId } }),
        ]);
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        if (!doctor)
            throw new common_1.NotFoundException('Doctor not found');
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
    findById(id) {
        return this.prisma.prescription.findUnique({
            where: { id },
            include: {
                patient: { include: { user: true } },
                doctor: { include: { user: true } },
                medicines: { include: { medicine: true } },
            },
        });
    }
    listByPatient(patientId) {
        return this.prisma.prescription.findMany({
            where: { patientId },
            include: {
                doctor: { include: { user: true } },
                medicines: { include: { medicine: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, dto, userId) {
        const existing = await this.prisma.prescription.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        const updated = await this.prisma.prescription.update({
            where: { id },
            data: { status: dto.status },
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
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map