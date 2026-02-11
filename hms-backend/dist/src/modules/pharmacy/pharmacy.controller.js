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
exports.PharmacyController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const pharmacy_service_1 = require("./pharmacy.service");
const pharmacy_dto_1 = require("./pharmacy.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let PharmacyController = class PharmacyController {
    service;
    constructor(service) {
        this.service = service;
    }
    listQueue(status) {
        return this.service.listQueue(status);
    }
    dispense(dto, req) {
        return this.service.dispense(dto, req.user.id);
    }
};
exports.PharmacyController = PharmacyController;
__decorate([
    (0, common_1.Get)('queue'),
    (0, roles_decorator_1.Roles)('PHARMACIST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Pharmacy dispense queue' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "listQueue", null);
__decorate([
    (0, common_1.Post)('dispense'),
    (0, roles_decorator_1.Roles)('PHARMACIST', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Dispense prescription' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pharmacy_dto_1.DispensePrescriptionDto, Object]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "dispense", null);
exports.PharmacyController = PharmacyController = __decorate([
    (0, swagger_1.ApiTags)('Pharmacy'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('pharmacy'),
    __metadata("design:paramtypes", [pharmacy_service_1.PharmacyService])
], PharmacyController);
//# sourceMappingURL=pharmacy.controller.js.map