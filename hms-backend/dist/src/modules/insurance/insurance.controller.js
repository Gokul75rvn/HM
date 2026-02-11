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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const insurance_service_1 = require("./insurance.service");
const insurance_dto_1 = require("./insurance.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let InsuranceController = class InsuranceController {
    service;
    constructor(service) {
        this.service = service;
    }
    createPolicy(dto, req) {
        return this.service.createPolicy(dto, req.user.id);
    }
    listPolicies(patientId) {
        return this.service.listPolicies(patientId);
    }
    createClaim(dto, req) {
        return this.service.createClaim(dto, req.user.id);
    }
    listClaims(status) {
        return this.service.listClaims(status);
    }
    updateClaimStatus(id, dto, req) {
        return this.service.updateClaimStatus(id, dto, req.user.id);
    }
};
exports.InsuranceController = InsuranceController;
__decorate([
    (0, common_1.Post)('policies'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'),
    (0, swagger_1.ApiOperation)({ summary: 'Create insurance policy' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [insurance_dto_1.CreateInsurancePolicyDto, Object]),
    __metadata("design:returntype", void 0)
], InsuranceController.prototype, "createPolicy", null);
__decorate([
    (0, common_1.Get)('policies'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'PATIENT'),
    (0, swagger_1.ApiOperation)({ summary: 'List policies' }),
    __param(0, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InsuranceController.prototype, "listPolicies", null);
__decorate([
    (0, common_1.Post)('claims'),
    (0, roles_decorator_1.Roles)('ACCOUNTANT', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create insurance claim' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [insurance_dto_1.CreateInsuranceClaimDto, Object]),
    __metadata("design:returntype", void 0)
], InsuranceController.prototype, "createClaim", null);
__decorate([
    (0, common_1.Get)('claims'),
    (0, roles_decorator_1.Roles)('ACCOUNTANT', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'List insurance claims' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InsuranceController.prototype, "listClaims", null);
__decorate([
    (0, common_1.Patch)('claims/:id/status'),
    (0, roles_decorator_1.Roles)('ACCOUNTANT', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update claim status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.UpdateInsuranceClaimStatusDto, Object]),
    __metadata("design:returntype", void 0)
], InsuranceController.prototype, "updateClaimStatus", null);
exports.InsuranceController = InsuranceController = __decorate([
    (0, swagger_1.ApiTags)('Insurance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('insurance'),
    __metadata("design:paramtypes", [insurance_service_1.InsuranceService])
], InsuranceController);
//# sourceMappingURL=insurance.controller.js.map