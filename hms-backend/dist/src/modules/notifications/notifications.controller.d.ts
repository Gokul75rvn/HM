import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './notifications.dto';
export declare class NotificationsController {
    private readonly service;
    constructor(service: NotificationsService);
    list(req: any): import(".prisma/client").Prisma.PrismaPromise<{
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
    markRead(id: string, req: any): Promise<{
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
}
