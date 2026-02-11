import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  registrationId: string;
  hospitalId: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        permissions: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      registrationId: user.registrationId,
      hospitalId: user.hospitalId,
      role: user.role,
      email: user.email,
      permissions: user.permissions.map((p) => ({ resource: p.resource, action: p.action })),
    };
  }
}
