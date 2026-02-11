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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let DepartmentsService = class DepartmentsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(createDepartmentDto, userId) {
        const existing = await this.prisma.department.findUnique({
            where: { code: createDepartmentDto.code },
        });
        if (existing) {
            throw new common_1.ConflictException('Department code already exists');
        }
        const department = await this.prisma.department.create({
            data: createDepartmentDto,
            include: { head: true },
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'DEPARTMENT',
            resourceId: department.id,
            newValues: createDepartmentDto,
        });
        return department;
    }
    async findAll() {
        return this.prisma.department.findMany({
            include: { head: { include: { user: true } }, _count: { select: { doctors: true, wards: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        const department = await this.prisma.department.findUnique({
            where: { id },
            include: { head: { include: { user: true } }, doctors: { include: { user: true } } },
        });
        if (!department) {
            throw new common_1.NotFoundException('Department not found');
        }
        return department;
    }
    async update(id, updateDepartmentDto, userId) {
        const department = await this.prisma.department.findUnique({
            where: { id },
        });
        if (!department) {
            throw new common_1.NotFoundException('Department not found');
        }
        const updated = await this.prisma.department.update({
            where: { id },
            data: updateDepartmentDto,
            include: { head: true },
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'DEPARTMENT',
            resourceId: id,
            newValues: updateDepartmentDto,
        });
        return updated;
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map