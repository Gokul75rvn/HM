import { PrismaService } from '../../common/prisma/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOperationalOverview(): Promise<{
        patients: number;
        doctors: number;
        nurses: number;
        liveAppointments: number;
        activeAdmissions: number;
        beds: {
            available: number;
            occupied: number;
        };
        revenue: number;
        outstanding: number;
    }>;
}
