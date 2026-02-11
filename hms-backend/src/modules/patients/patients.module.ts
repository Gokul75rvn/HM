import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
