import { PrismaService } from '../../common/prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(data: {
        userId: string;
        action: string;
        resource: string;
        resourceId: string;
        oldValues?: any;
        newValues?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void>;
}
