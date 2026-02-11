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
exports.PrescriptionsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const prescriptions_service_1 = require("./prescriptions.service");
const prescriptions_dto_1 = require("./prescriptions.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let PrescriptionsController = class PrescriptionsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user.id);
    }
    findById(id) {
        return this.service.findById(id);
    }
    listByPatient(patientId) {
        return this.service.listByPatient(patientId);
    }
    updateStatus(id, dto, req) {
        return this.service.updateStatus(id, dto, req.user.id);
    }
};
exports.PrescriptionsController = PrescriptionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('DOCTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Create prescription' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [prescriptions_dto_1.CreatePrescriptionDto, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'PHARMACIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT'),
    (0, swagger_1.ApiOperation)({ summary: 'List prescriptions for patient' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "listByPatient", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('DOCTOR', 'PHARMACIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prescriptions_dto_1.UpdatePrescriptionStatusDto, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "updateStatus", null);
exports.PrescriptionsController = PrescriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Prescriptions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('prescriptions'),
    __metadata("design:paramtypes", [prescriptions_service_1.PrescriptionsService])
], PrescriptionsController);
//# sourceMappingURL=prescriptions.controller.js.map