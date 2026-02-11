import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto, PatientResponseDto } from './patients.dto';
export declare class PatientsController {
    private patientsService;
    constructor(patientsService: PatientsService);
    create(createPatientDto: CreatePatientDto, req: any): Promise<PatientResponseDto>;
    findAll(page?: number, limit?: number): Promise<{
        data: PatientResponseDto[];
        total: number;
    }>;
    search(query: string): Promise<PatientResponseDto[]>;
    findById(id: string): Promise<PatientResponseDto>;
    update(id: string, updatePatientDto: UpdatePatientDto, req: any): Promise<PatientResponseDto>;
}
