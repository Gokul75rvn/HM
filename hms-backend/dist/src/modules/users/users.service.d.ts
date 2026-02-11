import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './users.dto';
import { AuditService } from '../audit/audit.service';
export declare class UsersService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(createUserDto: CreateUserDto, userId: string): Promise<UserResponseDto>;
    findAll(page?: number, limit?: number): Promise<{
        data: UserResponseDto[];
        total: number;
    }>;
    findById(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto, userId: string): Promise<UserResponseDto>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
    findByRegistrationId(registrationId: string): Promise<UserResponseDto | null>;
    assignRole(userId: string, role: string, adminId: string): Promise<UserResponseDto>;
    private formatUserResponse;
}
