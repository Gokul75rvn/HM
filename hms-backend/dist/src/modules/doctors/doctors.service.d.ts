import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateDoctorDto, UpdateDoctorDto, DoctorResponseDto } from './doctors.dto';
export declare class DoctorsService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(createDoctorDto: CreateDoctorDto, userId: string): Promise<DoctorResponseDto>;
    findAll(page?: number, limit?: number): Promise<{
        data: DoctorResponseDto[];
        total: number;
    }>;
    findById(id: string): Promise<DoctorResponseDto>;
    findBySpecialization(specialization: string): Promise<DoctorResponseDto[]>;
    findByDepartment(departmentId: string): Promise<DoctorResponseDto[]>;
    update(id: string, updateDoctorDto: UpdateDoctorDto, userId: string): Promise<DoctorResponseDto>;
    setAvailability(id: string, isAvailable: boolean, userId: string): Promise<DoctorResponseDto>;
    private formatDoctorResponse;
}
