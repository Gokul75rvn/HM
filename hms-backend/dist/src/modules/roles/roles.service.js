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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let RolesService = class RolesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async createRole(dto, userId) {
        const existing = await this.prisma.roleDefinition.findUnique({ where: { name: dto.name } });
        if (existing) {
            throw new common_1.ConflictException('Role already exists');
        }
        const role = await this.prisma.$transaction(async (tx) => {
            const created = await tx.roleDefinition.create({
                data: {
                    name: dto.name,
                    description: dto.description ?? null,
                },
            });
            if (dto.permissions?.length) {
                await tx.permission.createMany({
                    data: dto.permissions.map((perm) => ({
                        roleId: created.id,
                        name: `${created.name}:${perm.resource}:${perm.action}`,
                        description: perm.description ?? null,
                        resource: perm.resource,
                        action: perm.action,
                    })),
                });
            }
            return created;
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'ROLE',
            resourceId: role.id,
            newValues: dto,
        });
        return this.findRoleById(role.id);
    }
    findRoleById(id) {
        return this.prisma.roleDefinition.findUnique({
            where: { id },
            include: { permissions: true },
        });
    }
    listRoles() {
        return this.prisma.roleDefinition.findMany({
            include: { permissions: true },
            orderBy: { name: 'asc' },
        });
    }
    listPermissions() {
        return this.prisma.permission.findMany({ orderBy: { resource: 'asc' } });
    }
    async updateRolePermissions(roleId, dto, userId) {
        const role = await this.prisma.roleDefinition.findUnique({ where: { id: roleId } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.permission.deleteMany({ where: { roleId } });
            await tx.permission.createMany({
                data: dto.permissions.map((perm) => ({
                    roleId,
                    name: `${role.name}:${perm.resource}:${perm.action}`,
                    description: perm.description ?? null,
                    resource: perm.resource,
                    action: perm.action,
                })),
            });
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'ROLE_PERMISSIONS',
            resourceId: roleId,
            newValues: dto,
        });
        return this.findRoleById(roleId);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], RolesService);
//# sourceMappingURL=roles.service.js.map