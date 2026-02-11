import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    registrationId: string;
    hospitalId: string;
    role: string;
    iat: number;
    exp: number;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        registrationId: string;
        hospitalId: string;
        role: string;
        email: string | null;
        permissions: {
            resource: string;
            action: string;
        }[];
    } | null>;
}
export {};
