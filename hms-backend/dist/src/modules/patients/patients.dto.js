"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientResponseDto = exports.UpdatePatientDto = exports.CreatePatientDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePatientDto {
    firstName;
    lastName;
    email;
    phone;
    dateOfBirth;
    gender;
    bloodGroup;
    emergencyContact;
    emergencyPhone;
    address;
    city;
    state;
    pinCode;
    country;
    allergies;
    medicalHistory;
}
exports.CreatePatientDto = CreatePatientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['MALE', 'FEMALE', 'OTHER']),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE']),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "bloodGroup", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "emergencyPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "pinCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "allergies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "medicalHistory", void 0);
class UpdatePatientDto {
    firstName;
    lastName;
    email;
    phone;
    address;
    allergies;
    medicalHistory;
}
exports.UpdatePatientDto = UpdatePatientDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "allergies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "medicalHistory", void 0);
class PatientResponseDto {
    id;
    firstName;
    lastName;
    email;
    phone;
    dateOfBirth;
    gender;
    bloodGroup;
    address;
    city;
    state;
    createdAt;
    updatedAt;
}
exports.PatientResponseDto = PatientResponseDto;
//# sourceMappingURL=patients.dto.js.map