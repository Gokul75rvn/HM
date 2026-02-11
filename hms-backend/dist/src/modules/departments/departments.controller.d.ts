import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';
export declare class DepartmentsController {
    private departmentsService;
    constructor(departmentsService: DepartmentsService);
    create(createDepartmentDto: CreateDepartmentDto, req: any): Promise<{
        head: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            registrationNumber: string;
            licenseNumber: string | null;
            specialization: string;
            qualification: string;
            departmentId: string | null;
            isAvailable: boolean;
            consultationFee: number;
            experienceYears: number;
        } | null;
    } & {
        id: string;
        name: string;
        code: string;
        description: string | null;
        headId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(): Promise<({
        head: ({
            user: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            registrationNumber: string;
            licenseNumber: string | null;
            specialization: string;
            qualification: string;
            departmentId: string | null;
            isAvailable: boolean;
            consultationFee: number;
            experienceYears: number;
        }) | null;
        _count: {
            doctors: number;
            wards: number;
        };
    } & {
        id: string;
        name: string;
        code: string;
        description: string | null;
        headId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    findById(id: string): Promise<{
        head: ({
            user: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            registrationNumber: string;
            licenseNumber: string | null;
            specialization: string;
            qualification: string;
            departmentId: string | null;
            isAvailable: boolean;
            consultationFee: number;
            experienceYears: number;
        }) | null;
        doctors: ({
            user: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            registrationNumber: string;
            licenseNumber: string | null;
            specialization: string;
            qualification: string;
            departmentId: string | null;
            isAvailable: boolean;
            consultationFee: number;
            experienceYears: number;
        })[];
    } & {
        id: string;
        name: string;
        code: string;
        description: string | null;
        headId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto, req: any): Promise<{
        head: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            registrationNumber: string;
            licenseNumber: string | null;
            specialization: string;
            qualification: string;
            departmentId: string | null;
            isAvailable: boolean;
            consultationFee: number;
            experienceYears: number;
        } | null;
    } & {
        id: string;
        name: string;
        code: string;
        description: string | null;
        headId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
