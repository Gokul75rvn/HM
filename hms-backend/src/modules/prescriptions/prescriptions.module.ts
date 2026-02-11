import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';

@Module({
	imports: [PrismaModule, AuditModule],
	controllers: [PrescriptionsController],
	providers: [PrescriptionsService],
	exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
