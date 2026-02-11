import { BedsService } from './beds.service';
import { CreateWardDto, UpdateWardDto, CreateBedDto, UpdateBedStatusDto } from './beds.dto';
export declare class BedsController {
    private readonly bedsService;
    constructor(bedsService: BedsService);
    createWard(dto: CreateWardDto, req: any): Promise<{
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
    updateWard(id: string, dto: UpdateWardDto, req: any): Promise<{
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
    createBed(dto: CreateBedDto, req: any): Promise<{
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
    listBeds(wardId?: string, status?: string): Promise<({
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
    updateStatus(id: string, dto: UpdateBedStatusDto, req: any): Promise<{
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
    listAvailable(wardId?: string): Promise<({
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
