import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto, UpdatePrescriptionStatusDto } from './prescriptions.dto';
export declare class PrescriptionsController {
    private readonly service;
    constructor(service: PrescriptionsService);
    create(dto: CreatePrescriptionDto, req: any): Promise<({
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
        medicines: ({
            medicine: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                unit: string;
                genericName: string;
                composition: string;
                manufacturer: string;
                batchNumber: string;
                expiryDate: Date;
                price: number;
                stock: number;
                reorderLevel: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            prescriptionId: string;
            medicineId: string;
            dosage: string;
            frequency: string;
            duration: string;
            instructions: string | null;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        patientId: string;
        doctorId: string;
        prescriptionNumber: string;
        appointmentId: string | null;
        admissionId: string | null;
        issuedDate: Date;
        validUntil: Date;
    }) | null>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__PrescriptionClient<({
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
        medicines: ({
            medicine: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                unit: string;
                genericName: string;
                composition: string;
                manufacturer: string;
                batchNumber: string;
                expiryDate: Date;
                price: number;
                stock: number;
                reorderLevel: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            prescriptionId: string;
            medicineId: string;
            dosage: string;
            frequency: string;
            duration: string;
            instructions: string | null;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        patientId: string;
        doctorId: string;
        prescriptionNumber: string;
        appointmentId: string | null;
        admissionId: string | null;
        issuedDate: Date;
        validUntil: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    listByPatient(patientId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        medicines: ({
            medicine: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                unit: string;
                genericName: string;
                composition: string;
                manufacturer: string;
                batchNumber: string;
                expiryDate: Date;
                price: number;
                stock: number;
                reorderLevel: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            prescriptionId: string;
            medicineId: string;
            dosage: string;
            frequency: string;
            duration: string;
            instructions: string | null;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        patientId: string;
        doctorId: string;
        prescriptionNumber: string;
        appointmentId: string | null;
        admissionId: string | null;
        issuedDate: Date;
        validUntil: Date;
    })[]>;
    updateStatus(id: string, dto: UpdatePrescriptionStatusDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        patientId: string;
        doctorId: string;
        prescriptionNumber: string;
        appointmentId: string | null;
        admissionId: string | null;
        issuedDate: Date;
        validUntil: Date;
    }>;
}
