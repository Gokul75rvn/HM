import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient {
    [key: string]: any;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
