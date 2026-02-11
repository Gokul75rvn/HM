export declare class PermissionInputDto {
    resource: string;
    action: string;
    description?: string;
}
export declare class CreateRoleDto {
    name: string;
    description?: string;
    permissions?: PermissionInputDto[];
}
export declare class UpdateRolePermissionsDto {
    permissions: PermissionInputDto[];
}
