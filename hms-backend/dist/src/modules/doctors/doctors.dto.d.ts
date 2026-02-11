export declare class CreateDoctorDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    registrationNumber: string;
    specialization: string;
    qualification: string;
    licenseNumber?: string;
    departmentId?: string;
    consultationFee?: number;
    experienceYears?: number;
}
export declare class UpdateDoctorDto {
    specialization?: string;
    consultationFee?: number;
    departmentId?: string;
    isAvailable?: boolean;
}
export declare class DoctorResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
    consultationFee: number;
    isAvailable: boolean;
    departmentId: string;
    createdAt: string;
}
