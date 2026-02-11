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
exports.LabController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const lab_service_1 = require("./lab.service");
const lab_dto_1 = require("./lab.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let LabController = class LabController {
    labService;
    constructor(labService) {
        this.labService = labService;
    }
    createTest(dto, req) {
        return this.labService.createTest(dto, req.user.id);
    }
    listTests() {
        return this.labService.listTests();
    }
    createOrder(dto, req) {
        return this.labService.createOrder(dto, req.user.id);
    }
    listOrders(status) {
        return this.labService.listOrders(status);
    }
    updateOrderStatus(id, dto, req) {
        return this.labService.updateOrderStatus(id, dto, req.user.id);
    }
    createResult(dto, req) {
        return this.labService.createResult(dto, req.user.id);
    }
};
exports.LabController = LabController;
__decorate([
    (0, common_1.Post)('tests'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'LAB_TECH'),
    (0, swagger_1.ApiOperation)({ summary: 'Create lab test master record' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_dto_1.CreateLabTestDto, Object]),
    __metadata("design:returntype", void 0)
], LabController.prototype, "createTest", null);
__decorate([
    (0, common_1.Get)('tests'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'LAB_TECH'),
    (0, swagger_1.ApiOperation)({ summary: 'List lab tests' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LabController.prototype, "listTests", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, roles_decorator_1.Roles)('DOCTOR', 'LAB_TECH', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create lab order' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_dto_1.CreateLabOrderDto, Object]),
    __metadata("design:returntype", void 0)
], LabController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'LAB_TECH'),
    (0, swagger_1.ApiOperation)({ summary: 'List lab orders' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabController.prototype, "listOrders", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    (0, roles_decorator_1.Roles)('LAB_TECH', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lab order status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_dto_1.UpdateLabOrderStatusDto, Object]),
    __metadata("design:returntype", void 0)
], LabController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Post)('results'),
    (0, roles_decorator_1.Roles)('LAB_TECH'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload lab result' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_dto_1.CreateLabResultDto, Object]),
    __metadata("design:returntype", void 0)
], LabController.prototype, "createResult", null);
exports.LabController = LabController = __decorate([
    (0, swagger_1.ApiTags)('Lab'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('lab'),
    __metadata("design:paramtypes", [lab_service_1.LabService])
], LabController);
//# sourceMappingURL=lab.controller.js.map