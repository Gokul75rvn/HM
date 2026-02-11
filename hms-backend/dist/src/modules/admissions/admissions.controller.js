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
exports.AdmissionsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const admissions_service_1 = require("./admissions.service");
const admissions_dto_1 = require("./admissions.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let AdmissionsController = class AdmissionsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user.id);
    }
    findAll(page = 1, limit = 10) {
        return this.service.findAll(Number(page), Number(limit));
    }
    discharge(id, dto, req) {
        return this.service.discharge(id, dto, req.user.id);
    }
};
exports.AdmissionsController = AdmissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('DOCTOR', 'NURSE', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new admission' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admissions_dto_1.CreateAdmissionDto, Object]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE'),
    (0, swagger_1.ApiOperation)({ summary: 'List admissions' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/discharge'),
    (0, roles_decorator_1.Roles)('DOCTOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Discharge an admission' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admissions_dto_1.DischargeAdmissionDto, Object]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "discharge", null);
exports.AdmissionsController = AdmissionsController = __decorate([
    (0, swagger_1.ApiTags)('Admissions'),
    (0, common_1.Controller)('admissions'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admissions_service_1.AdmissionsService])
], AdmissionsController);
//# sourceMappingURL=admissions.controller.js.map