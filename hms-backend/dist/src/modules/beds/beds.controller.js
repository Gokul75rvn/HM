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
exports.BedsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const beds_service_1 = require("./beds.service");
const beds_dto_1 = require("./beds.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let BedsController = class BedsController {
    bedsService;
    constructor(bedsService) {
        this.bedsService = bedsService;
    }
    createWard(dto, req) {
        return this.bedsService.createWard(dto, req.user.id);
    }
    updateWard(id, dto, req) {
        return this.bedsService.updateWard(id, dto, req.user.id);
    }
    listWards() {
        return this.bedsService.listWards();
    }
    createBed(dto, req) {
        return this.bedsService.createBed(dto, req.user.id);
    }
    listBeds(wardId, status) {
        return this.bedsService.listBeds({ wardId, status });
    }
    updateStatus(id, dto, req) {
        return this.bedsService.updateBedStatus(id, dto.status, req.user.id);
    }
    listAvailable(wardId) {
        return this.bedsService.getAvailableBeds(wardId);
    }
};
exports.BedsController = BedsController;
__decorate([
    (0, common_1.Post)('wards'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create ward' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [beds_dto_1.CreateWardDto, Object]),
    __metadata("design:returntype", void 0)
], BedsController.prototype, "createWard", null);
__decorate([
    (0, common_1.Patch)('wards/:id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ward details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, beds_dto_1.UpdateWardDto, Object]),
    __metadata("design:returntype", void 0)
], BedsController.prototype, "updateWard", null);
__decorate([
    (0, common_1.Get)('wards'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE'),
    (0, swagger_1.ApiOperation)({ summary: 'List wards with bed stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BedsController.prototype, "listWards", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create bed' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [beds_dto_1.CreateBedDto, Object]),
    __metadata("design:returntype", void 0)
], BedsController.prototype, "createBed", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE'),
    (0, swagger_1.ApiOperation)({ summary: 'List beds with filters' }),
    __param(0, (0, common_1.Query)('wardId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BedsController.prototype, "listBeds", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'NURSE'),
    (0, swagger_1.ApiOperation)({ summary: 'Update bed status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, beds_dto_1.UpdateBedStatusDto, Object]),
    __metadata("design:returntype", void 0)
], BedsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'),
    (0, swagger_1.ApiOperation)({ summary: 'List available beds' }),
    __param(0, (0, common_1.Query)('wardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BedsController.prototype, "listAvailable", null);
exports.BedsController = BedsController = __decorate([
    (0, swagger_1.ApiTags)('Beds & Wards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('beds'),
    __metadata("design:paramtypes", [beds_service_1.BedsService])
], BedsController);
//# sourceMappingURL=beds.controller.js.map