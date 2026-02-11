import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
	imports: [PrismaModule, AuditModule],
	controllers: [PaymentsController],
	providers: [PaymentsService],
})
export class PaymentsModule {}
