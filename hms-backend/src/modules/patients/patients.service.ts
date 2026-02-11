import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePatientDto, UpdatePatientDto, PatientResponseDto } from './patients.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(createPatientDto: CreatePatientDto, userId: string): Promise<PatientResponseDto> {
    const { email, phone, firstName, lastName, dateOfBirth, ...patientData } = createPatientDto;

    // Check if email exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Create user account for patient
    const registrationId = `PAT-${uuid().slice(0, 8).toUpperCase()}`;
    const temporaryPassword = uuid().slice(0, 12);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        registrationId,
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        hospitalId: 'DEFAULT',
        role: 'PATIENT',
        status: 'ACTIVE',
      },
    });

    // Create patient record
    const patient = await this.prisma.patient.create({
      data: {
        userId: user.id,
        dateOfBirth: new Date(dateOfBirth),
        ...patientData,
      },
    });

    // Log audit
    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'PATIENT',
      resourceId: patient.id,
      newValues: {
        registrationId,
        firstName,
        lastName,
        email,
      },
    });

    return this.formatPatientResponse(patient, user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: PatientResponseDto[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        skip,
        take: limit,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count(),
    ]);

    return {
      data: patients.map((p) => this.formatPatientResponse(p, p.user)),
      total,
    };
  }

  async findById(id: string): Promise<PatientResponseDto> {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        user: true,
        appointments: { orderBy: { createdAt: 'desc' }, take: 5 },
        admissions: { orderBy: { createdAt: 'desc' }, take: 5 },
        prescriptions: { orderBy: { createdAt: 'desc' }, take: 5 },
        bills: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.formatPatientResponse(patient, patient.user);
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
    userId: string,
  ): Promise<PatientResponseDto> {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Update user if needed
    const userUpdateData: any = {};
    if (updatePatientDto.firstName) userUpdateData.firstName = updatePatientDto.firstName;
    if (updatePatientDto.lastName) userUpdateData.lastName = updatePatientDto.lastName;
    if (updatePatientDto.email) {
      const duplicate = await this.prisma.user.findUnique({
        where: { email: updatePatientDto.email },
      });
      if (duplicate && duplicate.id !== patient.userId) {
        throw new ConflictException('Email already in use');
      }
      userUpdateData.email = updatePatientDto.email;
    }
    if (updatePatientDto.phone) {
      const duplicate = await this.prisma.user.findUnique({
        where: { phone: updatePatientDto.phone },
      });
      if (duplicate && duplicate.id !== patient.userId) {
        throw new ConflictException('Phone already in use');
      }
      userUpdateData.phone = updatePatientDto.phone;
    }

    if (Object.keys(userUpdateData).length > 0) {
      await this.prisma.user.update({
        where: { id: patient.userId },
        data: userUpdateData,
      });
    }

    const patientUpdateData = { ...updatePatientDto };
    delete patientUpdateData.email;
    delete patientUpdateData.phone;
    delete patientUpdateData.firstName;
    delete patientUpdateData.lastName;

    const updatedPatient = await this.prisma.patient.update({
      where: { id },
      data: patientUpdateData,
      include: { user: true },
    });

    // Log audit
    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'PATIENT',
      resourceId: id,
      newValues: updatePatientDto,
    });

    return this.formatPatientResponse(updatedPatient, updatedPatient.user);
  }

  async searchByName(query: string): Promise<PatientResponseDto[]> {
    const patients = await this.prisma.patient.findMany({
      where: {
        OR: [
          { user: { firstName: { contains: query } } },
          { user: { lastName: { contains: query } } },
          { user: { email: { contains: query } } },
        ],
      },
      include: { user: true },
      take: 10,
    });

    return patients.map((p) => this.formatPatientResponse(p, p.user));
  }

  private formatPatientResponse(patient: any, user: any): PatientResponseDto {
    return {
      id: patient.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0],
      gender: patient.gender,
      bloodGroup: patient.bloodGroup || 'Not specified',
      address: patient.address,
      city: patient.city,
      state: patient.state,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
  }
}
