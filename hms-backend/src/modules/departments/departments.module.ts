import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
