import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';

@Module({
	imports: [PrismaModule, AuditModule],
	controllers: [InsuranceController],
	providers: [InsuranceService],
})
export class InsuranceModule {}
