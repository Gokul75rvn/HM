"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function seedDepartments() {
    const departments = [
        { name: 'Cardiology', code: 'CARD', description: 'Heart and vascular care' },
        { name: 'Radiology', code: 'RAD', description: 'Imaging and diagnostics' },
        { name: 'Emergency', code: 'ER', description: '24/7 emergency services' },
        { name: 'Laboratory', code: 'LAB', description: 'Clinical lab services' },
        { name: 'Pharmacy', code: 'PHARM', description: 'Medication and dispensing' },
        { name: 'Revenue Cycle', code: 'RCM', description: 'Billing and claims' },
    ];
    const records = await Promise.all(departments.map((department) => prisma.department.upsert({
        where: { code: department.code },
        update: {
            name: department.name,
            description: department.description,
        },
        create: department,
    })));
    return records.reduce((acc, department) => {
        acc[department.code] = department.id;
        return acc;
    }, {});
}
async function seedUsers(passwordHash, departmentIds) {
    const users = [
        {
            registrationId: 'DOC-SEED-001',
            role: 'DOCTOR',
            firstName: 'Aisha',
            lastName: 'Reynolds',
            email: 'doctor@carepoint.test',
            phone: '+1555010001',
        },
        {
            registrationId: 'PAT-SEED-001',
            role: 'PATIENT',
            firstName: 'Sophia',
            lastName: 'Patel',
            email: 'patient@carepoint.test',
            phone: '+1555010002',
        },
        {
            registrationId: 'LAB-SEED-001',
            role: 'LAB_TECH',
            firstName: 'Noah',
            lastName: 'Alvarez',
            email: 'lab@carepoint.test',
            phone: '+1555010003',
        },
        {
            registrationId: 'PHR-SEED-001',
            role: 'PHARMACIST',
            firstName: 'Maya',
            lastName: 'Singh',
            email: 'pharmacy@carepoint.test',
            phone: '+1555010004',
        },
        {
            registrationId: 'ACC-SEED-001',
            role: 'ACCOUNTANT',
            firstName: 'Ethan',
            lastName: 'Brown',
            email: 'accounts@carepoint.test',
            phone: '+1555010005',
        },
        {
            registrationId: 'ADM-SEED-001',
            role: 'ADMIN',
            firstName: 'Olivia',
            lastName: 'Martinez',
            email: 'admin@carepoint.test',
            phone: '+1555010006',
        },
    ];
    const createdUsers = await Promise.all(users.map((user) => prisma.user.upsert({
        where: { registrationId: user.registrationId },
        update: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            password: passwordHash,
        },
        create: {
            registrationId: user.registrationId,
            hospitalId: 'CARE-POINT-001',
            password: passwordHash,
            status: 'ACTIVE',
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
        },
    })));
    const doctorUser = createdUsers.find((user) => user.registrationId === 'DOC-SEED-001');
    const patientUser = createdUsers.find((user) => user.registrationId === 'PAT-SEED-001');
    if (!doctorUser || !patientUser) {
        throw new Error('Seed users not created');
    }
    const doctor = await prisma.doctor.upsert({
        where: { registrationNumber: 'MED-0001' },
        update: {
            specialization: 'Cardiology',
            departmentId: departmentIds.CARD,
        },
        create: {
            userId: doctorUser.id,
            registrationNumber: 'MED-0001',
            specialization: 'Cardiology',
            qualification: 'MBBS, MD',
            experienceYears: 8,
            consultationFee: 750,
            departmentId: departmentIds.CARD,
        },
    });
    const patient = await prisma.patient.upsert({
        where: { userId: patientUser.id },
        update: {
            emergencyContact: 'Aisha Patel',
            emergencyPhone: '+1555099988',
        },
        create: {
            userId: patientUser.id,
            dateOfBirth: new Date('1990-01-12'),
            gender: 'FEMALE',
            bloodGroup: 'O_POSITIVE',
            emergencyContact: 'Aisha Patel',
            emergencyPhone: '+1555099988',
            address: '901 Wellness Ave',
            city: 'Healthcare City',
            state: 'HC',
            pinCode: '12345',
            country: 'India',
            occupation: 'Software Engineer',
            allergies: 'Penicillin',
            medicalHistory: 'Hypertension',
        },
    });
    return { doctor, patient };
}
async function seedClinicalData(doctorId, patientId, departmentIds) {
    const appointment = await prisma.appointment.upsert({
        where: { appointmentNumber: 'APT-SEED-001' },
        update: {
            status: 'CONFIRMED',
        },
        create: {
            appointmentNumber: 'APT-SEED-001',
            patientId,
            doctorId,
            departmentId: departmentIds.CARD,
            appointmentDate: new Date(),
            appointmentTime: '10:00',
            status: 'CONFIRMED',
            type: 'FOLLOW_UP',
            reason: 'Follow-up consultation',
        },
    });
    const labTest = await prisma.labTest.upsert({
        where: { testCode: 'LT-CBC-01' },
        update: { name: 'Complete Blood Count', cost: 450 },
        create: {
            testCode: 'LT-CBC-01',
            name: 'Complete Blood Count',
            description: 'Standard CBC panel',
            cost: 450,
        },
    });
    const labOrder = await prisma.labOrder.upsert({
        where: { orderNumber: 'LAB-SEED-001' },
        update: { status: 'ORDERED' },
        create: {
            orderNumber: 'LAB-SEED-001',
            patientId,
            doctorId,
            testId: labTest.id,
            sampleType: 'Blood',
            notes: 'Routine CBC',
        },
    });
    const existingResult = await prisma.labResult.findUnique({
        where: { orderId: labOrder.id },
    });
    if (!existingResult) {
        await prisma.labResult.create({
            data: {
                orderId: labOrder.id,
                patientId,
                testId: labTest.id,
                value: 'WBC 6.1, RBC 4.5, HGB 13.2',
                normalRange: 'WBC 4.0-11.0',
                unit: 'cells/L',
                isAbnormal: false,
                remarks: 'Within normal limits',
            },
        });
    }
    const medicine = await prisma.medicine.upsert({
        where: { name: 'Atorvastatin' },
        update: { stock: 220 },
        create: {
            name: 'Atorvastatin',
            genericName: 'Atorvastatin',
            composition: 'Atorvastatin Calcium 20mg',
            manufacturer: 'CarePoint Pharma',
            batchNumber: 'AT-2026-01',
            expiryDate: new Date('2027-12-31'),
            unit: 'TABLET',
            price: 15,
            stock: 220,
            reorderLevel: 60,
        },
    });
    const prescription = await prisma.prescription.upsert({
        where: { prescriptionNumber: 'RX-SEED-001' },
        update: { status: 'ISSUED' },
        create: {
            prescriptionNumber: 'RX-SEED-001',
            patientId,
            doctorId,
            appointmentId: appointment.id,
            status: 'ISSUED',
            validUntil: new Date(new Date().setDate(new Date().getDate() + 30)),
        },
    });
    const prescriptionItem = await prisma.prescriptionItem.findFirst({
        where: { prescriptionId: prescription.id, medicineId: medicine.id },
    });
    if (!prescriptionItem) {
        await prisma.prescriptionItem.create({
            data: {
                prescriptionId: prescription.id,
                medicineId: medicine.id,
                dosage: '20mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take after dinner',
                quantity: 30,
            },
        });
    }
    const bill = await prisma.bill.upsert({
        where: { billNumber: 'BILL-SEED-001' },
        update: { status: 'GENERATED' },
        create: {
            billNumber: 'BILL-SEED-001',
            billType: 'OPD',
            patientId,
            appointmentId: appointment.id,
            prescriptionId: prescription.id,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
            status: 'GENERATED',
            subtotal: 1200,
            tax: 144,
            discount: 0,
            totalAmount: 1344,
            paidAmount: 0,
        },
    });
    const billItemExists = await prisma.billItem.findFirst({
        where: { billId: bill.id },
    });
    if (!billItemExists) {
        await prisma.billItem.createMany({
            data: [
                { billId: bill.id, description: 'Consultation Fee', quantity: 1, unitPrice: 750, totalPrice: 750 },
                { billId: bill.id, description: 'Lab Test - CBC', quantity: 1, unitPrice: 450, totalPrice: 450 },
            ],
        });
    }
    const insurance = await prisma.insurance.upsert({
        where: { policyNumber: 'POL-CARE-001' },
        update: { status: 'ACTIVE' },
        create: {
            providerName: 'BlueShield',
            policyNumber: 'POL-CARE-001',
            patientId,
            memberName: 'Sophia Patel',
            relationWithMember: 'Self',
            coverageType: 'OPD + IPD',
            sumInsured: 500000,
            validFrom: new Date('2025-01-01'),
            validUpto: new Date('2026-12-31'),
            status: 'ACTIVE',
        },
    });
    await prisma.insuranceClaim.upsert({
        where: { claimNumber: 'CLM-SEED-001' },
        update: { status: 'SUBMITTED', approvedAmount: 0 },
        create: {
            claimNumber: 'CLM-SEED-001',
            patientId,
            billId: bill.id,
            insuranceId: insurance.id,
            claimAmount: 1344,
            approvedAmount: 0,
            status: 'SUBMITTED',
            remarks: 'Initial submission',
        },
    });
}
async function main() {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const departments = await seedDepartments();
    const { doctor, patient } = await seedUsers(passwordHash, departments);
    await seedClinicalData(doctor.id, patient.id, departments);
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map