import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  [key: string]: any;

  constructor() {
    super({
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
