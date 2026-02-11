-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "registrationId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PATIENT',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastLogin" DATETIME,
    "lastLoginIp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "RoleDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "roleId" TEXT,
    "userId" TEXT,
    CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleDefinition" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "headId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Department_headId_fkey" FOREIGN KEY ("headId") REFERENCES "Doctor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "departmentId" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "consultationFee" INTEGER NOT NULL DEFAULT 500,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Doctor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Nurse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "specialization" TEXT,
    "wardId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Nurse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Nurse_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Receptionist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Receptionist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LabTech" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "certifications" TEXT,
    "specializations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "LabTech_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pharmacist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Pharmacist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Accountant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Accountant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "maritalStatus" TEXT,
    "emergencyContact" TEXT NOT NULL,
    "emergencyPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "occupation" TEXT,
    "allergies" TEXT,
    "medicalHistory" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointmentNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "appointmentDate" DATETIME NOT NULL,
    "appointmentTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "type" TEXT NOT NULL DEFAULT 'OPD',
    "reason" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "consultationNotes" TEXT,
    "diagnosisCode" TEXT,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "totalBeds" INTEGER NOT NULL DEFAULT 20,
    "occupiedBeds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Ward_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bedNumber" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "bedType" TEXT NOT NULL,
    "charges" INTEGER NOT NULL DEFAULT 5000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Bed_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admissionNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "bedId" TEXT,
    "admissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dischargeDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ADMITTED',
    "reason" TEXT NOT NULL,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Admission_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Admission_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Admission_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Admission_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "Bed" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prescriptionNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "admissionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "issuedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "genericName" TEXT NOT NULL,
    "composition" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "unit" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER NOT NULL DEFAULT 50,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prescriptionId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PrescriptionItem_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrescriptionItem_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LabTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cost" INTEGER NOT NULL DEFAULT 500,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "LabOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ORDERED',
    "orderDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sampleCollectionDate" DATETIME,
    "sampleType" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "LabOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LabOrder_testId_fkey" FOREIGN KEY ("testId") REFERENCES "LabTest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LabOrder_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "normalRange" TEXT,
    "unit" TEXT,
    "isAbnormal" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LabResult_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LabOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LabResult_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LabResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "LabTest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "billNumber" TEXT NOT NULL,
    "billType" TEXT NOT NULL DEFAULT 'OPD',
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "admissionId" TEXT,
    "prescriptionId" TEXT,
    "billDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "subtotal" INTEGER NOT NULL DEFAULT 0,
    "tax" INTEGER NOT NULL DEFAULT 0,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    "paidAmount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Bill_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bill_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BillItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "billId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    CONSTRAINT "BillItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentNumber" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'CASH',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "reference" TEXT,
    "paymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Insurance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerName" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "patientId" TEXT,
    "memberName" TEXT NOT NULL,
    "relationWithMember" TEXT NOT NULL,
    "coverageType" TEXT NOT NULL,
    "sumInsured" INTEGER NOT NULL,
    "validFrom" DATETIME NOT NULL,
    "validUpto" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "InsuranceClaim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "claimNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "insuranceId" TEXT NOT NULL,
    "claimAmount" INTEGER NOT NULL,
    "approvedAmount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "submittedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedDate" DATETIME,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InsuranceClaim_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InsuranceClaim_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InsuranceClaim_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "Insurance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "relatedId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "oldValues" TEXT,
    "newValues" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_registrationId_key" ON "User"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_registrationId_idx" ON "User"("registrationId");

-- CreateIndex
CREATE INDEX "User_hospitalId_idx" ON "User"("hospitalId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RoleDefinition_name_key" ON "RoleDefinition"("name");

-- CreateIndex
CREATE INDEX "RoleDefinition_name_idx" ON "RoleDefinition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "Permission_resource_idx" ON "Permission"("resource");

-- CreateIndex
CREATE INDEX "Permission_action_idx" ON "Permission"("action");

-- CreateIndex
CREATE INDEX "Permission_roleId_idx" ON "Permission"("roleId");

-- CreateIndex
CREATE INDEX "Permission_userId_idx" ON "Permission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE INDEX "Department_headId_idx" ON "Department"("headId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_registrationNumber_key" ON "Doctor"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");

-- CreateIndex
CREATE INDEX "Doctor_departmentId_idx" ON "Doctor"("departmentId");

-- CreateIndex
CREATE INDEX "Doctor_specialization_idx" ON "Doctor"("specialization");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");

-- CreateIndex
CREATE INDEX "Staff_designation_idx" ON "Staff"("designation");

-- CreateIndex
CREATE UNIQUE INDEX "Nurse_userId_key" ON "Nurse"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Nurse_licenseNumber_key" ON "Nurse"("licenseNumber");

-- CreateIndex
CREATE INDEX "Nurse_wardId_idx" ON "Nurse"("wardId");

-- CreateIndex
CREATE UNIQUE INDEX "Receptionist_userId_key" ON "Receptionist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LabTech_userId_key" ON "LabTech"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacist_userId_key" ON "Pharmacist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacist_licenseNumber_key" ON "Pharmacist"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Accountant_userId_key" ON "Accountant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE INDEX "Patient_dateOfBirth_idx" ON "Patient"("dateOfBirth");

-- CreateIndex
CREATE INDEX "Patient_bloodGroup_idx" ON "Patient"("bloodGroup");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_appointmentNumber_key" ON "Appointment"("appointmentNumber");

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "Appointment"("doctorId");

-- CreateIndex
CREATE INDEX "Appointment_departmentId_idx" ON "Appointment"("departmentId");

-- CreateIndex
CREATE INDEX "Appointment_appointmentDate_idx" ON "Appointment"("appointmentDate");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_name_key" ON "Ward"("name");

-- CreateIndex
CREATE INDEX "Ward_departmentId_idx" ON "Ward"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Bed_bedNumber_key" ON "Bed"("bedNumber");

-- CreateIndex
CREATE INDEX "Bed_wardId_idx" ON "Bed"("wardId");

-- CreateIndex
CREATE INDEX "Bed_status_idx" ON "Bed"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Admission_admissionNumber_key" ON "Admission"("admissionNumber");

-- CreateIndex
CREATE INDEX "Admission_patientId_idx" ON "Admission"("patientId");

-- CreateIndex
CREATE INDEX "Admission_departmentId_idx" ON "Admission"("departmentId");

-- CreateIndex
CREATE INDEX "Admission_doctorId_idx" ON "Admission"("doctorId");

-- CreateIndex
CREATE INDEX "Admission_bedId_idx" ON "Admission"("bedId");

-- CreateIndex
CREATE INDEX "Admission_status_idx" ON "Admission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_prescriptionNumber_key" ON "Prescription"("prescriptionNumber");

-- CreateIndex
CREATE INDEX "Prescription_patientId_idx" ON "Prescription"("patientId");

-- CreateIndex
CREATE INDEX "Prescription_doctorId_idx" ON "Prescription"("doctorId");

-- CreateIndex
CREATE INDEX "Prescription_status_idx" ON "Prescription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_name_key" ON "Medicine"("name");

-- CreateIndex
CREATE INDEX "Medicine_name_idx" ON "Medicine"("name");

-- CreateIndex
CREATE INDEX "Medicine_genericName_idx" ON "Medicine"("genericName");

-- CreateIndex
CREATE INDEX "Medicine_expiryDate_idx" ON "Medicine"("expiryDate");

-- CreateIndex
CREATE INDEX "PrescriptionItem_prescriptionId_idx" ON "PrescriptionItem"("prescriptionId");

-- CreateIndex
CREATE INDEX "PrescriptionItem_medicineId_idx" ON "PrescriptionItem"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "LabTest_testCode_key" ON "LabTest"("testCode");

-- CreateIndex
CREATE INDEX "LabTest_name_idx" ON "LabTest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_orderNumber_key" ON "LabOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "LabOrder_patientId_idx" ON "LabOrder"("patientId");

-- CreateIndex
CREATE INDEX "LabOrder_testId_idx" ON "LabOrder"("testId");

-- CreateIndex
CREATE INDEX "LabOrder_doctorId_idx" ON "LabOrder"("doctorId");

-- CreateIndex
CREATE INDEX "LabOrder_status_idx" ON "LabOrder"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LabResult_orderId_key" ON "LabResult"("orderId");

-- CreateIndex
CREATE INDEX "LabResult_patientId_idx" ON "LabResult"("patientId");

-- CreateIndex
CREATE INDEX "LabResult_testId_idx" ON "LabResult"("testId");

-- CreateIndex
CREATE UNIQUE INDEX "Bill_billNumber_key" ON "Bill"("billNumber");

-- CreateIndex
CREATE INDEX "Bill_patientId_idx" ON "Bill"("patientId");

-- CreateIndex
CREATE INDEX "Bill_billDate_idx" ON "Bill"("billDate");

-- CreateIndex
CREATE INDEX "Bill_status_idx" ON "Bill"("status");

-- CreateIndex
CREATE INDEX "BillItem_billId_idx" ON "BillItem"("billId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentNumber_key" ON "Payment"("paymentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_billId_idx" ON "Payment"("billId");

-- CreateIndex
CREATE INDEX "Payment_patientId_idx" ON "Payment"("patientId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Insurance_policyNumber_key" ON "Insurance"("policyNumber");

-- CreateIndex
CREATE INDEX "Insurance_policyNumber_idx" ON "Insurance"("policyNumber");

-- CreateIndex
CREATE INDEX "Insurance_status_idx" ON "Insurance"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceClaim_claimNumber_key" ON "InsuranceClaim"("claimNumber");

-- CreateIndex
CREATE INDEX "InsuranceClaim_patientId_idx" ON "InsuranceClaim"("patientId");

-- CreateIndex
CREATE INDEX "InsuranceClaim_billId_idx" ON "InsuranceClaim"("billId");

-- CreateIndex
CREATE INDEX "InsuranceClaim_insuranceId_idx" ON "InsuranceClaim"("insuranceId");

-- CreateIndex
CREATE INDEX "InsuranceClaim_status_idx" ON "InsuranceClaim"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
