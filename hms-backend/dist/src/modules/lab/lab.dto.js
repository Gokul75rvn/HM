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
exports.CreateLabResultDto = exports.UpdateLabOrderStatusDto = exports.CreateLabOrderDto = exports.CreateLabTestDto = void 0;
const class_validator_1 = require("class-validator");
class CreateLabTestDto {
    testCode;
    name;
    description;
    cost;
}
exports.CreateLabTestDto = CreateLabTestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "testCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabTestDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateLabTestDto.prototype, "cost", void 0);
class CreateLabOrderDto {
    patientId;
    doctorId;
    testId;
    sampleType;
    notes;
}
exports.CreateLabOrderDto = CreateLabOrderDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "testId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "sampleType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "notes", void 0);
class UpdateLabOrderStatusDto {
    status;
}
exports.UpdateLabOrderStatusDto = UpdateLabOrderStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(['ORDERED', 'SAMPLE_COLLECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    __metadata("design:type", String)
], UpdateLabOrderStatusDto.prototype, "status", void 0);
class CreateLabResultDto {
    orderId;
    value;
    normalRange;
    unit;
    isAbnormal;
    remarks;
}
exports.CreateLabResultDto = CreateLabResultDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "normalRange", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLabResultDto.prototype, "isAbnormal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "remarks", void 0);
//# sourceMappingURL=lab.dto.js.map