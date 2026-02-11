import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateNotificationDto } from './notifications.dto';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateNotificationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: string;
        message: string;
        title: string;
        relatedId: string | null;
        isRead: boolean;
    }>;
    findForUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: string;
        message: string;
        title: string;
        relatedId: string | null;
        isRead: boolean;
    }[]>;
    markAsRead(userId: string, notificationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: string;
        message: string;
        title: string;
        relatedId: string | null;
        isRead: boolean;
    }>;
}
