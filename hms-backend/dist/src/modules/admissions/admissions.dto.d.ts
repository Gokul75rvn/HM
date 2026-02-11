export declare class CreateAdmissionDto {
    patientId: string;
    departmentId: string;
    doctorId: string;
    bedId?: string;
    reason: string;
    diagnosis?: string;
}
export declare class DischargeAdmissionDto {
    dischargeDate?: string;
    dischargeSummary?: string;
}
