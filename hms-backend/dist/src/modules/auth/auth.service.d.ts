import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto, RegisterDto, ChangePasswordDto, LoginResponseDto } from './auth.dto';
import { AuditService } from '../audit/audit.service';
export declare class AuthService {
    private prisma;
    private jwt;
    private audit;
    constructor(prisma: PrismaService, jwt: JwtService, audit: AuditService);
    login(loginDto: LoginDto, ipAddress?: string): Promise<LoginResponseDto>;
    register(registerDto: RegisterDto, ipAddress?: string): Promise<LoginResponseDto>;
    private generateRegistrationId;
    private generateDoctorRegistrationNumber;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(userId: string, ipAddress?: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    private generateTokens;
}
