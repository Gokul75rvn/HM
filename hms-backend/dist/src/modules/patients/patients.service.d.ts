import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePatientDto, UpdatePatientDto, PatientResponseDto } from './patients.dto';
export declare class PatientsService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(createPatientDto: CreatePatientDto, userId: string): Promise<PatientResponseDto>;
    findAll(page?: number, limit?: number): Promise<{
        data: PatientResponseDto[];
        total: number;
    }>;
    findById(id: string): Promise<PatientResponseDto>;
    update(id: string, updatePatientDto: UpdatePatientDto, userId: string): Promise<PatientResponseDto>;
    searchByName(query: string): Promise<PatientResponseDto[]>;
    private formatPatientResponse;
}
