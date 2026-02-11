import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly service;
    constructor(service: ReportsService);
    overview(): Promise<{
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
