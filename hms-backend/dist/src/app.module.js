"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const patients_module_1 = require("./modules/patients/patients.module");
const doctors_module_1 = require("./modules/doctors/doctors.module");
const departments_module_1 = require("./modules/departments/departments.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const admissions_module_1 = require("./modules/admissions/admissions.module");
const beds_module_1 = require("./modules/beds/beds.module");
const prescriptions_module_1 = require("./modules/prescriptions/prescriptions.module");
const medicines_module_1 = require("./modules/medicines/medicines.module");
const lab_module_1 = require("./modules/lab/lab.module");
const pharmacy_module_1 = require("./modules/pharmacy/pharmacy.module");
const billing_module_1 = require("./modules/billing/billing.module");
const payments_module_1 = require("./modules/payments/payments.module");
const insurance_module_1 = require("./modules/insurance/insurance.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const audit_module_1 = require("./modules/audit/audit.module");
const roles_module_1 = require("./modules/roles/roles.module");
const staff_module_1 = require("./modules/staff/staff.module");
const reports_module_1 = require("./modules/reports/reports.module");
const health_module_1 = require("./common/health/health.module");
const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key';
const JWT_EXPIRY = (process.env.JWT_EXPIRY ?? '15m');
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: JWT_SECRET,
                signOptions: { expiresIn: JWT_EXPIRY },
            }),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            patients_module_1.PatientsModule,
            doctors_module_1.DoctorsModule,
            departments_module_1.DepartmentsModule,
            appointments_module_1.AppointmentsModule,
            admissions_module_1.AdmissionsModule,
            beds_module_1.BedsModule,
            prescriptions_module_1.PrescriptionsModule,
            medicines_module_1.MedicinesModule,
            lab_module_1.LabModule,
            pharmacy_module_1.PharmacyModule,
            billing_module_1.BillingModule,
            payments_module_1.PaymentsModule,
            insurance_module_1.InsuranceModule,
            notifications_module_1.NotificationsModule,
            roles_module_1.RolesModule,
            staff_module_1.StaffModule,
            reports_module_1.ReportsModule,
            audit_module_1.AuditModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map