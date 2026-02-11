export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    password: string;
    role: string;
}
export declare class LoginDto {
    registrationId: string;
    password: string;
}
export declare class LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        registrationId: string;
        firstName: string;
        lastName: string;
        email?: string;
        role: string;
        patientId?: string;
        doctorId?: string;
        redirectPath: string;
    };
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
