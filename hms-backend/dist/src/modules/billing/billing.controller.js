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
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const billing_service_1 = require("./billing.service");
const billing_dto_1 = require("./billing.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let BillingController = class BillingController {
    service;
    constructor(service) {
        this.service = service;
    }
    generate(dto, req) {
        return this.service.generateBill(dto, req.user.id);
    }
    list(patientId) {
        return this.service.listBills(patientId);
    }
    findById(id) {
        return this.service.getBillById(id);
    }
    updateStatus(id, body, req) {
        return this.service.markStatus(id, body.status, req.user.id);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate bill' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [billing_dto_1.GenerateBillDto, Object]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'),
    (0, swagger_1.ApiOperation)({ summary: 'List bills' }),
    __param(0, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'PATIENT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bill details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'),
    (0, swagger_1.ApiOperation)({ summary: 'Update bill status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "updateStatus", null);
exports.BillingController = BillingController = __decorate([
    (0, swagger_1.ApiTags)('Billing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map