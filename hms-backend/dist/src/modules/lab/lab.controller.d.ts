import { LabService } from './lab.service';
import { CreateLabTestDto, CreateLabOrderDto, UpdateLabOrderStatusDto, CreateLabResultDto } from './lab.dto';
export declare class LabController {
    private readonly labService;
    constructor(labService: LabService);
    createTest(dto: CreateLabTestDto, req: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        testCode: string;
        cost: number;
    }>;
    listTests(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        testCode: string;
        cost: number;
    }[]>;
    createOrder(dto: CreateLabOrderDto, req: any): Promise<{
        doctor: {
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
        };
        patient: {
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
            dateOfBirth: Date;
            gender: string;
            bloodGroup: string | null;
            maritalStatus: string | null;
            emergencyContact: string;
            emergencyPhone: string;
            address: string;
            city: string;
            state: string;
            pinCode: string;
            country: string;
            occupation: string | null;
            allergies: string | null;
            medicalHistory: string | null;
        };
        test: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            testCode: string;
            cost: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        patientId: string;
        doctorId: string;
        notes: string | null;
        orderNumber: string;
        testId: string;
        orderDate: Date;
        sampleCollectionDate: Date | null;
        sampleType: string | null;
    }>;
    listOrders(status?: string): import(".prisma/client").Prisma.PrismaPromise<({
        result: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            testId: string;
            orderId: string;
            value: string;
            normalRange: string | null;
            unit: string | null;
            isAbnormal: boolean;
            remarks: string | null;
            uploadedAt: Date;
        } | null;
        doctor: {
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
        };
        patient: {
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
            dateOfBirth: Date;
            gender: string;
            bloodGroup: string | null;
            maritalStatus: string | null;
            emergencyContact: string;
            emergencyPhone: string;
            address: string;
            city: string;
            state: string;
            pinCode: string;
            country: string;
            occupation: string | null;
            allergies: string | null;
            medicalHistory: string | null;
        };
        test: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            testCode: string;
            cost: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        patientId: string;
        doctorId: string;
        notes: string | null;
        orderNumber: string;
        testId: string;
        orderDate: Date;
        sampleCollectionDate: Date | null;
        sampleType: string | null;
    })[]>;
    updateOrderStatus(id: string, dto: UpdateLabOrderStatusDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        patientId: string;
        doctorId: string;
        notes: string | null;
        orderNumber: string;
        testId: string;
        orderDate: Date;
        sampleCollectionDate: Date | null;
        sampleType: string | null;
    }>;
    createResult(dto: CreateLabResultDto, req: any): Promise<{
        test: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            testCode: string;
            cost: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        testId: string;
        orderId: string;
        value: string;
        normalRange: string | null;
        unit: string | null;
        isAbnormal: boolean;
        remarks: string | null;
        uploadedAt: Date;
    }>;
}
