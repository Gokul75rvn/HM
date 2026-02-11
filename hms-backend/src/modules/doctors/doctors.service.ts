import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateDoctorDto, UpdateDoctorDto, DoctorResponseDto } from './doctors.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto, userId: string): Promise<DoctorResponseDto> {
    const { email, phone, firstName, lastName, registrationNumber, ...doctorData } = createDoctorDto;

    // Check if email exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if registration number exists
    const existingRegNum = await this.prisma.doctor.findUnique({
      where: { registrationNumber },
    });
    if (existingRegNum) {
      throw new ConflictException('Registration number already exists');
    }

    // Create user account for doctor
    const doctorId = `DOC-${uuid().slice(0, 8).toUpperCase()}`;
    const temporaryPassword = uuid().slice(0, 12);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        registrationId: doctorId,
        firstName,
        lastName,
        email,
        phone: phone || null,
        password: hashedPassword,
        hospitalId: 'DEFAULT',
        role: 'DOCTOR',
        status: 'ACTIVE',
      },
    });

    // Create doctor record
    const doctor = await this.prisma.doctor.create({
      data: {
        userId: user.id,
        registrationNumber,
        ...doctorData,
      },
      include: { user: true, department: true },
    });

    // Log audit
    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'DOCTOR',
      resourceId: doctor.id,
      newValues: { registrationNumber, specialization: doctorData.specialization },
    });

    return this.formatDoctorResponse(doctor, user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: DoctorResponseDto[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [doctors, total] = await Promise.all([
      this.prisma.doctor.findMany({
        skip,
        take: limit,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.doctor.count(),
    ]);

    return {
      data: doctors.map((d) => this.formatDoctorResponse(d, d.user)),
      total,
    };
  }

  async findById(id: string): Promise<DoctorResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        appointments: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.formatDoctorResponse(doctor, doctor.user);
  }

  async findBySpecialization(specialization: string): Promise<DoctorResponseDto[]> {
    const doctors = await this.prisma.doctor.findMany({
      where: { specialization, deletedAt: null },
      include: { user: true },
    });

    return doctors.map((d) => this.formatDoctorResponse(d, d.user));
  }

  async findByDepartment(departmentId: string): Promise<DoctorResponseDto[]> {
    const doctors = await this.prisma.doctor.findMany({
      where: { departmentId, deletedAt: null },
      include: { user: true },
    });

    return doctors.map((d) => this.formatDoctorResponse(d, d.user));
  }

  async update(
    id: string,
    updateDoctorDto: UpdateDoctorDto,
    userId: string,
  ): Promise<DoctorResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const updatedDoctor = await this.prisma.doctor.update({
      where: { id },
      data: updateDoctorDto,
      include: { user: true },
    });

    // Log audit
    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'DOCTOR',
      resourceId: id,
      newValues: updateDoctorDto,
    });

    return this.formatDoctorResponse(updatedDoctor, updatedDoctor.user);
  }

  async setAvailability(id: string, isAvailable: boolean, userId: string): Promise<DoctorResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const updated = await this.prisma.doctor.update({
      where: { id },
      data: { isAvailable },
      include: { user: true },
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'DOCTOR_AVAILABILITY',
      resourceId: id,
      newValues: { isAvailable },
    });

    return this.formatDoctorResponse(updated, updated.user);
  }

  private formatDoctorResponse(doctor: any, user: any): DoctorResponseDto {
    return {
      id: doctor.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      specialization: doctor.specialization,
      consultationFee: doctor.consultationFee,
      isAvailable: doctor.isAvailable,
      departmentId: doctor.departmentId,
      createdAt: doctor.createdAt.toISOString(),
    };
  }
}
