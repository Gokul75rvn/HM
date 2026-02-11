export declare class CreateWardDto {
    name: string;
    type: string;
    departmentId: string;
    totalBeds?: number;
}
export declare class UpdateWardDto {
    name?: string;
    type?: string;
    departmentId?: string;
    totalBeds?: number;
}
export declare class CreateBedDto {
    bedNumber: string;
    wardId: string;
    bedType: string;
    charges?: number;
}
export declare class UpdateBedStatusDto {
    status: string;
}
