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
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const uuid_1 = require("uuid");
const bcrypt = __importStar(require("bcrypt"));
let DoctorsService = class DoctorsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(createDoctorDto, userId) {
        const { email, phone, firstName, lastName, registrationNumber, ...doctorData } = createDoctorDto;
        const existingEmail = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already registered');
        }
        const existingRegNum = await this.prisma.doctor.findUnique({
            where: { registrationNumber },
        });
        if (existingRegNum) {
            throw new common_1.ConflictException('Registration number already exists');
        }
        const doctorId = `DOC-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        const temporaryPassword = (0, uuid_1.v4)().slice(0, 12);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
        const user = await this.prisma.user.create({
            data: {
                registrationId: doctorId,
                firstName,
                lastName,
                email,
                phone: phone || null,
                password: hashedPassword,
                hospitalId: 'DEFAULT',
                role: 'DOCTOR',
                status: 'ACTIVE',
            },
        });
        const doctor = await this.prisma.doctor.create({
            data: {
                userId: user.id,
                registrationNumber,
                ...doctorData,
            },
            include: { user: true, department: true },
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'DOCTOR',
            resourceId: doctor.id,
            newValues: { registrationNumber, specialization: doctorData.specialization },
        });
        return this.formatDoctorResponse(doctor, user);
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [doctors, total] = await Promise.all([
            this.prisma.doctor.findMany({
                skip,
                take: limit,
                include: { user: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.doctor.count(),
        ]);
        return {
            data: doctors.map((d) => this.formatDoctorResponse(d, d.user)),
            total,
        };
    }
    async findById(id) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
            include: {
                user: true,
                department: true,
                appointments: { orderBy: { createdAt: 'desc' }, take: 10 },
            },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        return this.formatDoctorResponse(doctor, doctor.user);
    }
    async findBySpecialization(specialization) {
        const doctors = await this.prisma.doctor.findMany({
            where: { specialization, deletedAt: null },
            include: { user: true },
        });
        return doctors.map((d) => this.formatDoctorResponse(d, d.user));
    }
    async findByDepartment(departmentId) {
        const doctors = await this.prisma.doctor.findMany({
            where: { departmentId, deletedAt: null },
            include: { user: true },
        });
        return doctors.map((d) => this.formatDoctorResponse(d, d.user));
    }
    async update(id, updateDoctorDto, userId) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const updatedDoctor = await this.prisma.doctor.update({
            where: { id },
            data: updateDoctorDto,
            include: { user: true },
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'DOCTOR',
            resourceId: id,
            newValues: updateDoctorDto,
        });
        return this.formatDoctorResponse(updatedDoctor, updatedDoctor.user);
    }
    async setAvailability(id, isAvailable, userId) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const updated = await this.prisma.doctor.update({
            where: { id },
            data: { isAvailable },
            include: { user: true },
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'DOCTOR_AVAILABILITY',
            resourceId: id,
            newValues: { isAvailable },
        });
        return this.formatDoctorResponse(updated, updated.user);
    }
    formatDoctorResponse(doctor, user) {
        return {
            id: doctor.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            specialization: doctor.specialization,
            consultationFee: doctor.consultationFee,
            isAvailable: doctor.isAvailable,
            departmentId: doctor.departmentId,
            createdAt: doctor.createdAt.toISOString(),
        };
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map