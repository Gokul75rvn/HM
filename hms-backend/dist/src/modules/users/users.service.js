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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let UsersService = class UsersService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(createUserDto, userId) {
        const { registrationId, email, phone, password, ...rest } = createUserDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { registrationId },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Registration ID already exists');
        }
        if (email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        if (phone) {
            const existingPhone = await this.prisma.user.findUnique({
                where: { phone },
            });
            if (existingPhone) {
                throw new common_1.ConflictException('Phone number already in use');
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                registrationId,
                email: email || null,
                phone: phone || null,
                password: hashedPassword,
                ...rest,
            },
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'USER',
            resourceId: user.id,
            newValues: {
                registrationId: user.registrationId,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
        return this.formatUserResponse(user);
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                where: { deletedAt: null },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({
                where: { deletedAt: null },
            }),
        ]);
        return {
            data: users.map((u) => this.formatUserResponse(u)),
            total,
        };
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                permissions: true,
                doctor: true,
                patient: true,
                staff: true,
            },
        });
        if (!user || user.deletedAt) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.formatUserResponse(user);
    }
    async update(id, updateUserDto, userId) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser || existingUser.deletedAt) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const duplicate = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (duplicate) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        if (updateUserDto.phone && updateUserDto.phone !== existingUser.phone) {
            const duplicate = await this.prisma.user.findUnique({
                where: { phone: updateUserDto.phone },
            });
            if (duplicate) {
                throw new common_1.ConflictException('Phone number already in use');
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'USER',
            resourceId: id,
            oldValues: existingUser,
            newValues: updateUserDto,
        });
        return this.formatUserResponse(updatedUser);
    }
    async delete(id, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user || user.deletedAt) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        await this.audit.log({
            userId,
            action: 'DELETE',
            resource: 'USER',
            resourceId: id,
            oldValues: user,
        });
        return { message: 'User deleted successfully' };
    }
    async findByRegistrationId(registrationId) {
        const user = await this.prisma.user.findUnique({
            where: { registrationId },
        });
        if (!user || user.deletedAt) {
            return null;
        }
        return this.formatUserResponse(user);
    }
    async assignRole(userId, role, adminId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.deletedAt) {
            throw new common_1.NotFoundException('User not found');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { role: role },
        });
        await this.audit.log({
            userId: adminId,
            action: 'UPDATE',
            resource: 'USER_ROLE',
            resourceId: userId,
            newValues: { role },
        });
        return this.formatUserResponse(updatedUser);
    }
    formatUserResponse(user) {
        return {
            id: user.id,
            registrationId: user.registrationId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], UsersService);
//# sourceMappingURL=users.service.js.map