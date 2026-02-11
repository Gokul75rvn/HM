export declare class CreatePatientDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup?: string;
    emergencyContact: string;
    emergencyPhone: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country?: string;
    allergies?: string;
    medicalHistory?: string;
}
export declare class UpdatePatientDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    allergies?: string;
    medicalHistory?: string;
}
export declare class PatientResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    address: string;
    city: string;
    state: string;
    createdAt: string;
    updatedAt: string;
}
