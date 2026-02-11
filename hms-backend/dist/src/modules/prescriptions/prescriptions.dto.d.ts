export declare class PrescriptionItemDto {
    medicineId: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    quantity: number;
}
export declare class CreatePrescriptionDto {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    admissionId?: string;
    validUntil: string;
    items: PrescriptionItemDto[];
}
export declare class UpdatePrescriptionStatusDto {
    status: string;
}
