export declare class CreateStaffDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    designation: string;
    departmentId?: string;
    wardId?: string;
}
export declare class UpdateStaffAssignmentDto {
    departmentId?: string;
    wardId?: string;
    designation?: string;
}
