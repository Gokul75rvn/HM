export declare class CreateMedicineDto {
    name: string;
    genericName: string;
    composition: string;
    manufacturer: string;
    batchNumber: string;
    expiryDate: string;
    unit: string;
    price: number;
    stock: number;
    reorderLevel?: number;
}
export declare class UpdateMedicineDto {
    name?: string;
    stock?: number;
    price?: number;
    expiryDate?: string;
    reorderLevel?: number;
}
