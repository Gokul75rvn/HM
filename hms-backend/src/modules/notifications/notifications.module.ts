import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
	imports: [PrismaModule, AuditModule],
	controllers: [NotificationsController],
	providers: [NotificationsService],
})
export class NotificationsModule {}
