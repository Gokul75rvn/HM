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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const ROLE_REDIRECT_PATHS = {
    SUPER_ADMIN: '/admin/super-admin-dashboard',
    ADMIN: '/admin/dashboard',
    DOCTOR: '/doctor/dashboard',
    PATIENT: '/patient/dashboard',
    NURSE: '/nurse/dashboard',
    RECEPTIONIST: '/receptionist/dashboard',
    LAB_TECH: '/lab/dashboard',
    PHARMACIST: '/pharmacy/dashboard',
    ACCOUNTANT: '/accounts/dashboard',
};
const ACCESS_TOKEN_OPTIONS = {
    secret: process.env.JWT_SECRET ?? 'your-secret-key',
    expiresIn: (process.env.JWT_EXPIRY ?? '15m'),
};
const REFRESH_TOKEN_OPTIONS = {
    secret: process.env.JWT_REFRESH_SECRET ?? 'your-refresh-secret-key',
    expiresIn: (process.env.JWT_REFRESH_EXPIRY ?? '7d'),
};
let AuthService = class AuthService {
    prisma;
    jwt;
    audit;
    constructor(prisma, jwt, audit) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.audit = audit;
    }
    async login(loginDto, ipAddress) {
        const { registrationId, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { registrationId },
            include: {
                permissions: true,
                doctor: true,
                patient: true,
                staff: true,
                nurse: true,
                receptionist: true,
                labTech: true,
                pharmacist: true,
                accountant: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid registration ID or password');
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException(`Account is ${user.status.toLowerCase()}`);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid registration ID or password');
        }
        const tokens = await this.generateTokens(user);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date(),
                lastLoginIp: ipAddress,
            },
        });
        await this.audit.log({
            userId: user.id,
            action: 'LOGIN',
            resource: 'AUTH',
            resourceId: user.id,
            ipAddress,
        });
        const redirectPath = ROLE_REDIRECT_PATHS[user.role] || '/dashboard';
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                registrationId: user.registrationId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email || undefined,
                role: user.role,
                patientId: user.patient?.id,
                doctorId: user.doctor?.id,
                redirectPath,
            },
        };
    }
    async register(registerDto, ipAddress) {
        const { firstName, lastName, email, phone, password, role } = registerDto;
        if (email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Email already registered');
            }
        }
        if (phone) {
            const existingPhone = await this.prisma.user.findUnique({
                where: { phone },
            });
            if (existingPhone) {
                throw new common_1.ConflictException('Phone number already registered');
            }
        }
        const registrationId = await this.generateRegistrationId(role);
        const hashedPassword = await bcrypt.hash(password, 10);
        const hospitalId = 'CARE-POINT-001';
        const user = await this.prisma.user.create({
            data: {
                registrationId,
                hospitalId,
                firstName,
                lastName,
                email,
                phone,
                password: hashedPassword,
                role,
                status: 'ACTIVE',
            },
        });
        let patientId;
        let doctorId;
        if (role === 'PATIENT') {
            const patient = await this.prisma.patient.create({
                data: {
                    userId: user.id,
                    dateOfBirth: new Date('1990-01-01'),
                    gender: 'OTHER',
                    emergencyContact: 'Not Provided',
                    emergencyPhone: '0000000000',
                    address: 'Not Provided',
                    city: 'Not Provided',
                    state: 'Not Provided',
                    pinCode: '000000',
                    country: 'India',
                },
            });
            patientId = patient.id;
        }
        if (role === 'DOCTOR') {
            const registrationNumber = await this.generateDoctorRegistrationNumber();
            const doctor = await this.prisma.doctor.create({
                data: {
                    userId: user.id,
                    registrationNumber,
                    specialization: 'General Medicine',
                    qualification: 'MBBS',
                    experienceYears: 0,
                    consultationFee: 500,
                },
            });
            doctorId = doctor.id;
        }
        const tokens = await this.generateTokens(user);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date(),
                lastLoginIp: ipAddress,
            },
        });
        await this.audit.log({
            userId: user.id,
            action: 'REGISTER',
            resource: 'AUTH',
            resourceId: user.id,
            ipAddress,
        });
        const redirectPath = ROLE_REDIRECT_PATHS[user.role] || '/dashboard';
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                registrationId: user.registrationId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email || undefined,
                role: user.role,
                patientId,
                doctorId,
                redirectPath,
            },
        };
    }
    async generateRegistrationId(role) {
        const rolePrefixes = {
            DOCTOR: 'DOC',
            PATIENT: 'PAT',
            NURSE: 'NUR',
            LAB_TECH: 'LAB',
            PHARMACIST: 'PHR',
            ACCOUNTANT: 'ACC',
            RECEPTIONIST: 'REC',
            ADMIN: 'ADM',
            SUPER_ADMIN: 'SUP',
        };
        const prefix = rolePrefixes[role] || 'USR';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const registrationId = `${prefix}-${timestamp}-${random}`;
        const existing = await this.prisma.user.findUnique({
            where: { registrationId },
        });
        if (existing) {
            return this.generateRegistrationId(role);
        }
        return registrationId;
    }
    async generateDoctorRegistrationNumber() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const registrationNumber = `MED-${timestamp}-${random}`;
        const existing = await this.prisma.doctor.findUnique({
            where: { registrationNumber },
        });
        if (existing) {
            return this.generateDoctorRegistrationNumber();
        }
        return registrationNumber;
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
            });
            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
            });
            if (!storedToken || storedToken.revokedAt) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            if (new Date() > storedToken.expiresAt) {
                throw new common_1.UnauthorizedException('Refresh token expired');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || user.status !== 'ACTIVE') {
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            const newAccessToken = this.jwt.sign({
                sub: user.id,
                registrationId: user.registrationId,
                hospitalId: user.hospitalId,
                role: user.role,
            }, ACCESS_TOKEN_OPTIONS);
            return { accessToken: newAccessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId, ipAddress) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
        await this.audit.log({
            userId,
            action: 'LOGOUT',
            resource: 'AUTH',
            resourceId: userId,
            ipAddress,
        });
        return { message: 'Logged out successfully' };
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword, confirmPassword } = changePasswordDto;
        if (newPassword !== confirmPassword) {
            throw new common_1.BadRequestException('New password and confirm password do not match');
        }
        if (newPassword === currentPassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'Password changed successfully' };
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            registrationId: user.registrationId,
            hospitalId: user.hospitalId,
            role: user.role,
        };
        const accessToken = this.jwt.sign(payload, ACCESS_TOKEN_OPTIONS);
        const refreshToken = this.jwt.sign(payload, REFRESH_TOKEN_OPTIONS);
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map