import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { BedsModule } from './modules/beds/beds.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { MedicinesModule } from './modules/medicines/medicines.module';
import { LabModule } from './modules/lab/lab.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { BillingModule } from './modules/billing/billing.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';
import { RolesModule } from './modules/roles/roles.module';
import { StaffModule } from './modules/staff/staff.module';
import { ReportsModule } from './modules/reports/reports.module';
import { HealthModule } from './common/health/health.module';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key';
const JWT_EXPIRY = (process.env.JWT_EXPIRY ?? '15m') as JwtSignOptions['expiresIn'];

@Module({
  imports: [
    // Core modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRY },
    }),

    // Infrastructure
    PrismaModule,
    HealthModule,

    // Feature modules
    AuthModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
    DepartmentsModule,
    AppointmentsModule,
    AdmissionsModule,
    BedsModule,
    PrescriptionsModule,
    MedicinesModule,
    LabModule,
    PharmacyModule,
    BillingModule,
    PaymentsModule,
    InsuranceModule,
    NotificationsModule,
    RolesModule,
    StaffModule,
    ReportsModule,
    AuditModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
