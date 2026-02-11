import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { BedsService } from './beds.service';
import { BedsController } from './beds.controller';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [BedsController],
  providers: [BedsService],
  exports: [BedsService],
})
export class BedsModule {}
