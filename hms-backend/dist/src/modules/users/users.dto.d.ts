export declare class CreateUserDto {
    registrationId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
    hospitalId: string;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    status?: string;
}
export declare class UserResponseDto {
    id: string;
    registrationId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}
