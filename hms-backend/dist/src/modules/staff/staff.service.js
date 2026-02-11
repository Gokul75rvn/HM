"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const STAFF_ROLES = ['NURSE', 'RECEPTIONIST', 'LAB_TECH', 'PHARMACIST', 'ACCOUNTANT', 'STAFF'];
let StaffService = class StaffService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async createStaff(dto, userId) {
        const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already in use');
        }
        const registrationId = `${dto.role.slice(0, 3)}-${(0, uuid_1.v4)().slice(0, 6).toUpperCase()}`;
        const temporaryPassword = (0, uuid_1.v4)().slice(0, 8);
        const password = await bcrypt.hash(temporaryPassword, 10);
        const user = await this.prisma.user.create({
            data: {
                registrationId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                phone: dto.phone ?? null,
                password,
                hospitalId: 'DEFAULT',
                role: dto.role,
                status: 'ACTIVE',
            },
        });
        await this.createRoleProfile(dto.role, user.id, dto);
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'STAFF',
            resourceId: user.id,
            newValues: dto,
        });
        return this.getStaffByUserId(user.id);
    }
    async createRoleProfile(role, userId, dto) {
        switch (role) {
            case 'NURSE':
                return this.prisma.nurse.create({
                    data: {
                        userId,
                        specialization: dto.designation,
                        wardId: dto.wardId ?? null,
                    },
                });
            case 'RECEPTIONIST':
                return this.prisma.receptionist.create({
                    data: {
                        userId,
                        departmentId: dto.departmentId ?? null,
                    },
                });
            case 'LAB_TECH':
                return this.prisma.labTech.create({
                    data: {
                        userId,
                        certifications: dto.designation,
                    },
                });
            case 'PHARMACIST':
                return this.prisma.pharmacist.create({
                    data: {
                        userId,
                        licenseNumber: `LIC-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`,
                    },
                });
            case 'ACCOUNTANT':
                return this.prisma.accountant.create({
                    data: {
                        userId,
                        departmentId: dto.departmentId ?? null,
                    },
                });
            default:
                return this.prisma.staff.create({
                    data: {
                        userId,
                        designation: dto.designation,
                        departmentId: dto.departmentId ?? null,
                    },
                });
        }
    }
    listStaff(role) {
        const rolesFilter = role ? [role] : STAFF_ROLES;
        return this.prisma.user.findMany({
            where: { role: { in: rolesFilter } },
            include: {
                staff: true,
                nurse: { include: { ward: true } },
                receptionist: true,
                labTech: true,
                pharmacist: true,
                accountant: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getStaffByUserId(userId) {
        const staff = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                staff: true,
                nurse: { include: { ward: true } },
                receptionist: true,
                labTech: true,
                pharmacist: true,
                accountant: true,
            },
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        return staff;
    }
    async updateAssignment(userId, dto, adminId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Staff user not found');
        }
        switch (user.role) {
            case 'NURSE':
                await this.prisma.nurse.update({
                    where: { userId },
                    data: {
                        wardId: dto.wardId ?? undefined,
                        specialization: dto.designation ?? undefined,
                    },
                });
                break;
            case 'RECEPTIONIST':
                await this.prisma.receptionist.update({
                    where: { userId },
                    data: { departmentId: dto.departmentId ?? undefined },
                });
                break;
            case 'LAB_TECH':
                await this.prisma.labTech.update({
                    where: { userId },
                    data: { specializations: dto.designation ?? undefined },
                });
                break;
            case 'PHARMACIST':
                await this.prisma.pharmacist.update({
                    where: { userId },
                    data: {},
                });
                break;
            case 'ACCOUNTANT':
                await this.prisma.accountant.update({
                    where: { userId },
                    data: { departmentId: dto.departmentId ?? undefined },
                });
                break;
            default:
                await this.prisma.staff.update({
                    where: { userId },
                    data: {
                        designation: dto.designation ?? undefined,
                        departmentId: dto.departmentId ?? undefined,
                    },
                });
                break;
        }
        await this.audit.log({
            userId: adminId,
            action: 'UPDATE',
            resource: 'STAFF_ASSIGNMENT',
            resourceId: userId,
            newValues: dto,
        });
        return this.getStaffByUserId(userId);
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], StaffService);
//# sourceMappingURL=staff.service.js.map