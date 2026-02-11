export declare class CreatePaymentDto {
    billId: string;
    patientId: string;
    amount: number;
    method: string;
    transactionId?: string;
    reference?: string;
}
