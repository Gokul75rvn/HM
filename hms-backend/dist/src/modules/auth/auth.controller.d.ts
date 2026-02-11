import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ChangePasswordDto, LoginResponseDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, req: any): Promise<LoginResponseDto>;
    login(loginDto: LoginDto, req: any): Promise<LoginResponseDto>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
