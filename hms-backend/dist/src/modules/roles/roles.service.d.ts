import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateRoleDto, UpdateRolePermissionsDto } from './roles.dto';
export declare class RolesService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    createRole(dto: CreateRoleDto, userId: string): Promise<({
        permissions: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            action: string;
            resource: string;
            roleId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findRoleById(id: string): import(".prisma/client").Prisma.Prisma__RoleDefinitionClient<({
        permissions: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            action: string;
            resource: string;
            roleId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    listRoles(): import(".prisma/client").Prisma.PrismaPromise<({
        permissions: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            action: string;
            resource: string;
            roleId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    listPermissions(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        action: string;
        resource: string;
        roleId: string | null;
    }[]>;
    updateRolePermissions(roleId: string, dto: UpdateRolePermissionsDto, userId: string): Promise<({
        permissions: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            action: string;
            resource: string;
            roleId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
