import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateStaffDto, UpdateStaffAssignmentDto } from './staff.dto';
export declare class StaffService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    createStaff(dto: CreateStaffDto, userId: string): Promise<{
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
    createRoleProfile(role: string, userId: string, dto: CreateStaffDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        departmentId: string | null;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        certifications: string | null;
        specializations: string | null;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        licenseNumber: string | null;
    }>;
    listStaff(role?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    getStaffByUserId(userId: string): Promise<{
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
    updateAssignment(userId: string, dto: UpdateStaffAssignmentDto, adminId: string): Promise<{
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
