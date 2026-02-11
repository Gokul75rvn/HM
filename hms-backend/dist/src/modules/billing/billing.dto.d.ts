export declare class BillItemDto {
    description: string;
    quantity: number;
    unitPrice: number;
}
export declare class GenerateBillDto {
    patientId: string;
    billType: string;
    dueDate: string;
    appointmentId?: string;
    admissionId?: string;
    prescriptionId?: string;
    discount?: number;
    items: BillItemDto[];
}
