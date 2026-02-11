import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto, RegisterDto, ChangePasswordDto, LoginResponseDto } from './auth.dto';
import { AuditService } from '../audit/audit.service';

const ROLE_REDIRECT_PATHS = {
  SUPER_ADMIN: '/admin/super-admin-dashboard',
  ADMIN: '/admin/dashboard',
  DOCTOR: '/doctor/dashboard',
  PATIENT: '/patient/dashboard',
  NURSE: '/nurse/dashboard',
  RECEPTIONIST: '/receptionist/dashboard',
  LAB_TECH: '/lab/dashboard',
  PHARMACIST: '/pharmacy/dashboard',
  ACCOUNTANT: '/accounts/dashboard',
};

const ACCESS_TOKEN_OPTIONS: JwtSignOptions = {
  secret: process.env.JWT_SECRET ?? 'your-secret-key',
  expiresIn: (process.env.JWT_EXPIRY ?? '15m') as JwtSignOptions['expiresIn'],
};

const REFRESH_TOKEN_OPTIONS: JwtSignOptions = {
  secret: process.env.JWT_REFRESH_SECRET ?? 'your-refresh-secret-key',
  expiresIn: (process.env.JWT_REFRESH_EXPIRY ?? '7d') as JwtSignOptions['expiresIn'],
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private audit: AuditService,
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string): Promise<LoginResponseDto> {
    const { registrationId, password } = loginDto;

    // Find user by registrationId (unique identifier)
    const user = await this.prisma.user.findUnique({
      where: { registrationId },
      include: {
        permissions: true,
        doctor: true,
        patient: true,
        staff: true,
        nurse: true,
        receptionist: true,
        labTech: true,
        pharmacist: true,
        accountant: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid registration ID or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(`Account is ${user.status.toLowerCase()}`);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid registration ID or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // Log audit
    await this.audit.log({
      userId: user.id,
      action: 'LOGIN',
      resource: 'AUTH',
      resourceId: user.id,
      ipAddress,
    });

    // Determine redirect path based on role
    const redirectPath = ROLE_REDIRECT_PATHS[user.role] || '/dashboard';

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        registrationId: user.registrationId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || undefined,
        role: user.role,
        patientId: user.patient?.id,
        doctorId: user.doctor?.id,
        redirectPath,
      },
    };
  }

  async register(registerDto: RegisterDto, ipAddress?: string): Promise<LoginResponseDto> {
    const { firstName, lastName, email, phone, password, role } = registerDto;

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already registered');
      }
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already registered');
      }
    }

    // Generate unique registration ID
    const registrationId = await this.generateRegistrationId(role);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate hospital ID (you can customize this logic)
    const hospitalId = 'CARE-POINT-001';

    // Create user
    const user = await this.prisma.user.create({
      data: {
        registrationId,
        hospitalId,
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role,
        status: 'ACTIVE',
      },
    });

    let patientId: string | undefined;
    let doctorId: string | undefined;

    if (role === 'PATIENT') {
      const patient = await this.prisma.patient.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date('1990-01-01'),
          gender: 'OTHER',
          emergencyContact: 'Not Provided',
          emergencyPhone: '0000000000',
          address: 'Not Provided',
          city: 'Not Provided',
          state: 'Not Provided',
          pinCode: '000000',
          country: 'India',
        },
      });
      patientId = patient.id;
    }

    if (role === 'DOCTOR') {
      const registrationNumber = await this.generateDoctorRegistrationNumber();
      const doctor = await this.prisma.doctor.create({
        data: {
          userId: user.id,
          registrationNumber,
          specialization: 'General Medicine',
          qualification: 'MBBS',
          experienceYears: 0,
          consultationFee: 500,
        },
      });
      doctorId = doctor.id;
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // Log audit
    await this.audit.log({
      userId: user.id,
      action: 'REGISTER',
      resource: 'AUTH',
      resourceId: user.id,
      ipAddress,
    });

    // Determine redirect path based on role
    const redirectPath = ROLE_REDIRECT_PATHS[user.role] || '/dashboard';

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        registrationId: user.registrationId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || undefined,
        role: user.role,
        patientId,
        doctorId,
        redirectPath,
      },
    };
  }

  private async generateRegistrationId(role: string): Promise<string> {
    const rolePrefixes = {
      DOCTOR: 'DOC',
      PATIENT: 'PAT',
      NURSE: 'NUR',
      LAB_TECH: 'LAB',
      PHARMACIST: 'PHR',
      ACCOUNTANT: 'ACC',
      RECEPTIONIST: 'REC',
      ADMIN: 'ADM',
      SUPER_ADMIN: 'SUP',
    };

    const prefix = rolePrefixes[role] || 'USR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const registrationId = `${prefix}-${timestamp}-${random}`;

    // Check if exists (unlikely but just in case)
    const existing = await this.prisma.user.findUnique({
      where: { registrationId },
    });

    if (existing) {
      // Recursively generate a new one
      return this.generateRegistrationId(role);
    }

    return registrationId;
  }

  private async generateDoctorRegistrationNumber(): Promise<string> {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const registrationNumber = `MED-${timestamp}-${random}`;

    const existing = await this.prisma.doctor.findUnique({
      where: { registrationNumber },
    });

    if (existing) {
      return this.generateDoctorRegistrationNumber();
    }

    return registrationNumber;
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      });

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.revokedAt) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (new Date() > storedToken.expiresAt) {
        throw new UnauthorizedException('Refresh token expired');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User not found or inactive');
      }

      const newAccessToken = this.jwt.sign(
        {
          sub: user.id,
          registrationId: user.registrationId,
          hospitalId: user.hospitalId,
          role: user.role,
        },
        ACCESS_TOKEN_OPTIONS,
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, ipAddress?: string): Promise<{ message: string }> {
    // Revoke refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    // Log audit
    await this.audit.log({
      userId,
      action: 'LOGOUT',
      resource: 'AUTH',
      resourceId: userId,
      ipAddress,
    });

    return { message: 'Logged out successfully' };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    if (newPassword === currentPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      registrationId: user.registrationId,
      hospitalId: user.hospitalId,
      role: user.role,
    };

    const accessToken = this.jwt.sign(payload, ACCESS_TOKEN_OPTIONS);

    const refreshToken = this.jwt.sign(payload, REFRESH_TOKEN_OPTIONS);

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { accessToken, refreshToken };
  }
}
