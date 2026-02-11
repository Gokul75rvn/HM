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
exports.LabService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const uuid_1 = require("uuid");
let LabService = class LabService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async createTest(dto, userId) {
        const testCode = dto.testCode ?? `LT-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        const exists = await this.prisma.labTest.findUnique({ where: { testCode } });
        if (exists) {
            throw new common_1.ConflictException('Test code already exists');
        }
        const test = await this.prisma.labTest.create({
            data: {
                testCode,
                name: dto.name,
                description: dto.description ?? null,
                cost: dto.cost ?? 0,
            },
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'LAB_TEST',
            resourceId: test.id,
            newValues: dto,
        });
        return test;
    }
    listTests() {
        return this.prisma.labTest.findMany({ orderBy: { name: 'asc' } });
    }
    async createOrder(dto, userId) {
        const [patient, doctor, test] = await Promise.all([
            this.prisma.patient.findUnique({ where: { id: dto.patientId } }),
            this.prisma.doctor.findUnique({ where: { id: dto.doctorId } }),
            this.prisma.labTest.findUnique({ where: { id: dto.testId } }),
        ]);
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        if (!doctor)
            throw new common_1.NotFoundException('Doctor not found');
        if (!test)
            throw new common_1.NotFoundException('Lab test not found');
        const orderNumber = `LAB-${Date.now()}`;
        const order = await this.prisma.labOrder.create({
            data: {
                orderNumber,
                patientId: dto.patientId,
                doctorId: dto.doctorId,
                testId: dto.testId,
                sampleType: dto.sampleType ?? null,
                notes: dto.notes ?? null,
            },
            include: {
                patient: { include: { user: true } },
                doctor: { include: { user: true } },
                test: true,
            },
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'LAB_ORDER',
            resourceId: order.id,
            newValues: dto,
        });
        return order;
    }
    listOrders(status) {
        return this.prisma.labOrder.findMany({
            where: { status: status },
            include: {
                patient: { include: { user: true } },
                doctor: { include: { user: true } },
                test: true,
                result: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateOrderStatus(id, dto, userId) {
        const order = await this.prisma.labOrder.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        if (order.status === 'COMPLETED' && dto.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Completed orders cannot change status');
        }
        const updated = await this.prisma.labOrder.update({
            where: { id },
            data: { status: dto.status },
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'LAB_ORDER_STATUS',
            resourceId: id,
            oldValues: { status: order.status },
            newValues: dto,
        });
        return updated;
    }
    async createResult(dto, userId) {
        const order = await this.prisma.labOrder.findUnique({
            where: { id: dto.orderId },
            include: { patient: true, test: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        if (order.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cannot upload result for cancelled order');
        }
        const existingResult = await this.prisma.labResult.findUnique({ where: { orderId: dto.orderId } });
        if (existingResult) {
            throw new common_1.ConflictException('Result already uploaded for this order');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const created = await tx.labResult.create({
                data: {
                    orderId: dto.orderId,
                    patientId: order.patientId,
                    testId: order.testId,
                    value: dto.value,
                    normalRange: dto.normalRange ?? null,
                    unit: dto.unit ?? null,
                    isAbnormal: dto.isAbnormal ?? false,
                    remarks: dto.remarks ?? null,
                },
                include: { test: true },
            });
            await tx.labOrder.update({
                where: { id: dto.orderId },
                data: { status: 'COMPLETED' },
            });
            return created;
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'LAB_RESULT',
            resourceId: result.id,
            newValues: dto,
        });
        return result;
    }
};
exports.LabService = LabService;
exports.LabService = LabService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], LabService);
//# sourceMappingURL=lab.service.js.map