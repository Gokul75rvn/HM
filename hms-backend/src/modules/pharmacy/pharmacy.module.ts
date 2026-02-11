import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';

@Module({
	imports: [PrismaModule, AuditModule],
	controllers: [PharmacyController],
	providers: [PharmacyService],
})
export class PharmacyModule {}
