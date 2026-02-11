import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto, DoctorResponseDto } from './doctors.dto';
export declare class DoctorsController {
    private doctorsService;
    constructor(doctorsService: DoctorsService);
    create(createDoctorDto: CreateDoctorDto, req: any): Promise<DoctorResponseDto>;
    findAll(page?: number, limit?: number): Promise<{
        data: DoctorResponseDto[];
        total: number;
    }>;
    findBySpecialization(specialization: string): Promise<DoctorResponseDto[]>;
    findByDepartment(departmentId: string): Promise<DoctorResponseDto[]>;
    findById(id: string): Promise<DoctorResponseDto>;
    update(id: string, updateDoctorDto: UpdateDoctorDto, req: any): Promise<DoctorResponseDto>;
    setAvailability(id: string, body: {
        isAvailable: boolean;
    }, req: any): Promise<DoctorResponseDto>;
}
