import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    userId: string;
    action: string;
    resource: string;
    resourceId: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action as any,
          resource: data.resource,
          resourceId: data.resourceId,
          oldValues: data.oldValues,
          newValues: data.newValues,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to log audit:', error);
    }
  }
}
