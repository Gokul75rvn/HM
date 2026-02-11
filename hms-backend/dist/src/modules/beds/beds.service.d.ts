import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateWardDto, UpdateWardDto, CreateBedDto } from './beds.dto';
export declare class BedsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    createWard(dto: CreateWardDto, userId: string): Promise<{
        department: {
            id: string;
            name: string;
            code: string;
            description: string | null;
            headId: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        departmentId: string;
        type: string;
        totalBeds: number;
        occupiedBeds: number;
    }>;
    listWards(): Promise<({
        department: {
            id: string;
            name: string;
            code: string;
            description: string | null;
            headId: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        beds: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: string;
            bedNumber: string;
            wardId: string;
            bedType: string;
            charges: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        departmentId: string;
        type: string;
        totalBeds: number;
        occupiedBeds: number;
    })[]>;
    updateWard(id: string, dto: UpdateWardDto, userId: string): Promise<{
        department: {
            id: string;
            name: string;
            code: string;
            description: string | null;
            headId: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        departmentId: string;
        type: string;
        totalBeds: number;
        occupiedBeds: number;
    }>;
    createBed(dto: CreateBedDto, userId: string): Promise<{
        ward: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            departmentId: string;
            type: string;
            totalBeds: number;
            occupiedBeds: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        bedNumber: string;
        wardId: string;
        bedType: string;
        charges: number;
    }>;
    listBeds(filters: {
        wardId?: string;
        status?: string;
    }): Promise<({
        ward: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            departmentId: string;
            type: string;
            totalBeds: number;
            occupiedBeds: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        bedNumber: string;
        wardId: string;
        bedType: string;
        charges: number;
    })[]>;
    updateBedStatus(id: string, status: string, userId: string): Promise<{
        ward: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            departmentId: string;
            type: string;
            totalBeds: number;
            occupiedBeds: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        bedNumber: string;
        wardId: string;
        bedType: string;
        charges: number;
    }>;
    getAvailableBeds(wardId?: string): Promise<({
        ward: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            departmentId: string;
            type: string;
            totalBeds: number;
            occupiedBeds: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        bedNumber: string;
        wardId: string;
        bedType: string;
        charges: number;
    })[]>;
}
