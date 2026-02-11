import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRolePermissionsDto } from './roles.dto';
export declare class RolesController {
    private readonly service;
    constructor(service: RolesService);
    create(dto: CreateRoleDto, req: any): Promise<({
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
    list(): import(".prisma/client").Prisma.PrismaPromise<({
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
    updatePermissions(id: string, dto: UpdateRolePermissionsDto, req: any): Promise<({
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
