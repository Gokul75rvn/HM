import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
