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
exports.UpdateInsuranceClaimStatusDto = exports.CreateInsuranceClaimDto = exports.CreateInsurancePolicyDto = void 0;
const class_validator_1 = require("class-validator");
const INSURANCE_STATUS = ['ACTIVE', 'INACTIVE', 'EXPIRED'];
const CLAIM_STATUS = ['SUBMITTED', 'PROCESSING', 'APPROVED', 'REJECTED', 'PAID'];
class CreateInsurancePolicyDto {
    providerName;
    policyNumber;
    patientId;
    memberName;
    relationWithMember;
    coverageType;
    sumInsured;
    validFrom;
    validUpto;
    status;
}
exports.CreateInsurancePolicyDto = CreateInsurancePolicyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInsurancePolicyDto.prototype, "providerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInsurancePolicyDto.prototype, "policyNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInsurancePolicyDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsurancePolicyDto.prototype, "memberName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsurancePolicyDto.prototype, "relationWithMember", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsurancePolicyDto.prototype, "coverageType", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInsurancePolicyDto.prototype, "sumInsured", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInsurancePolicyDto.prototype, "validFrom", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInsurancePolicyDto.prototype, "validUpto", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(INSURANCE_STATUS),
    __metadata("design:type", String)
], CreateInsurancePolicyDto.prototype, "status", void 0);
class CreateInsuranceClaimDto {
    patientId;
    billId;
    insuranceId;
    claimAmount;
    remarks;
}
exports.CreateInsuranceClaimDto = CreateInsuranceClaimDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInsuranceClaimDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInsuranceClaimDto.prototype, "billId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInsuranceClaimDto.prototype, "insuranceId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateInsuranceClaimDto.prototype, "claimAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsuranceClaimDto.prototype, "remarks", void 0);
class UpdateInsuranceClaimStatusDto {
    status;
    approvedAmount;
    remarks;
}
exports.UpdateInsuranceClaimStatusDto = UpdateInsuranceClaimStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(CLAIM_STATUS),
    __metadata("design:type", String)
], UpdateInsuranceClaimStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInsuranceClaimStatusDto.prototype, "approvedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInsuranceClaimStatusDto.prototype, "remarks", void 0);
//# sourceMappingURL=insurance.dto.js.map