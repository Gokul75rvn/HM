export declare class DispenseItemDto {
    prescriptionItemId: string;
    quantity: number;
}
export declare class DispensePrescriptionDto {
    prescriptionId: string;
    items: DispenseItemDto[];
}
