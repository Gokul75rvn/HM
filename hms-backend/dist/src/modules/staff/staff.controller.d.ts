import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffAssignmentDto } from './staff.dto';
export declare class StaffController {
    private readonly service;
    constructor(service: StaffService);
    create(dto: CreateStaffDto, req: any): Promise<{
        staff: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
            designation: string;
        } | null;
        nurse: ({
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            licenseNumber: string | null;
            specialization: string | null;
            wardId: string | null;
        }) | null;
        receptionist: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
        } | null;
        labTech: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            certifications: string | null;
            specializations: string | null;
        } | null;
        pharmacist: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            licenseNumber: string | null;
        } | null;
        accountant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        registrationId: string;
        email: string | null;
        phone: string | null;
        hospitalId: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        lastLoginIp: string | null;
    }>;
    list(role?: string): import(".prisma/client").Prisma.PrismaPromise<({
        staff: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
            designation: string;
        } | null;
        nurse: ({
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            licenseNumber: string | null;
            specialization: string | null;
            wardId: string | null;
        }) | null;
        receptionist: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
        } | null;
        labTech: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            certifications: string | null;
            specializations: string | null;
        } | null;
        pharmacist: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            licenseNumber: string | null;
        } | null;
        accountant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        registrationId: string;
        email: string | null;
        phone: string | null;
        hospitalId: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        lastLoginIp: string | null;
    })[]>;
    get(userId: string): Promise<{
        staff: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
            designation: string;
        } | null;
        nurse: ({
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            licenseNumber: string | null;
            specialization: string | null;
            wardId: string | null;
        }) | null;
        receptionist: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
        } | null;
        labTech: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            certifications: string | null;
            specializations: string | null;
        } | null;
        pharmacist: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            licenseNumber: string | null;
        } | null;
        accountant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        registrationId: string;
        email: string | null;
        phone: string | null;
        hospitalId: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        lastLoginIp: string | null;
    }>;
    updateAssignment(userId: string, dto: UpdateStaffAssignmentDto, req: any): Promise<{
        staff: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
            designation: string;
        } | null;
        nurse: ({
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            licenseNumber: string | null;
            specialization: string | null;
            wardId: string | null;
        }) | null;
        receptionist: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
        } | null;
        labTech: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            certifications: string | null;
            specializations: string | null;
        } | null;
        pharmacist: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            licenseNumber: string | null;
        } | null;
        accountant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            departmentId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        registrationId: string;
        email: string | null;
        phone: string | null;
        hospitalId: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        lastLoginIp: string | null;
    }>;
}
