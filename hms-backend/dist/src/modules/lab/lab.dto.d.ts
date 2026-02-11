export declare class CreateLabTestDto {
    testCode?: string;
    name: string;
    description?: string;
    cost?: number;
}
export declare class CreateLabOrderDto {
    patientId: string;
    doctorId: string;
    testId: string;
    sampleType?: string;
    notes?: string;
}
export declare class UpdateLabOrderStatusDto {
    status: string;
}
export declare class CreateLabResultDto {
    orderId: string;
    value: string;
    normalRange?: string;
    unit?: string;
    isAbnormal?: boolean;
    remarks?: string;
}
