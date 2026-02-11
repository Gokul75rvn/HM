import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}