import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './users.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, req: any): Promise<UserResponseDto>;
    findAll(page?: number, limit?: number): Promise<{
        data: UserResponseDto[];
        total: number;
    }>;
    findById(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<UserResponseDto>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
    assignRole(id: string, body: {
        role: string;
    }, req: any): Promise<UserResponseDto>;
}
