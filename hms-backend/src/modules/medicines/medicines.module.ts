import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { MedicinesController } from './medicines.controller';
import { MedicinesService } from './medicines.service';

@Module({
	imports: [PrismaModule, AuditModule],
	controllers: [MedicinesController],
	providers: [MedicinesService],
	exports: [MedicinesService],
})
export class MedicinesModule {}
