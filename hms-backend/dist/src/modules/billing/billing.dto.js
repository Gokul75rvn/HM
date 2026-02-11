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
exports.GenerateBillDto = exports.BillItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const BILL_TYPES = ['OPD', 'IPD', 'LAB', 'PHARMACY', 'EMERGENCY'];
class BillItemDto {
    description;
    quantity;
    unitPrice;
}
exports.BillItemDto = BillItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], BillItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], BillItemDto.prototype, "unitPrice", void 0);
class GenerateBillDto {
    patientId;
    billType;
    dueDate;
    appointmentId;
    admissionId;
    prescriptionId;
    discount;
    items;
}
exports.GenerateBillDto = GenerateBillDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GenerateBillDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(BILL_TYPES),
    __metadata("design:type", String)
], GenerateBillDto.prototype, "billType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GenerateBillDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GenerateBillDto.prototype, "appointmentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GenerateBillDto.prototype, "admissionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GenerateBillDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GenerateBillDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BillItemDto),
    __metadata("design:type", Array)
], GenerateBillDto.prototype, "items", void 0);
//# sourceMappingURL=billing.dto.js.map