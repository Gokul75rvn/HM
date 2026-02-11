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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const staff_service_1 = require("./staff.service");
const staff_dto_1 = require("./staff.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let StaffController = class StaffController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.createStaff(dto, req.user.id);
    }
    list(role) {
        return this.service.listStaff(role);
    }
    get(userId) {
        return this.service.getStaffByUserId(userId);
    }
    updateAssignment(userId, dto, req) {
        return this.service.updateAssignment(userId, dto, req.user.id);
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create staff account' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_dto_1.CreateStaffDto, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'List staff members' }),
    __param(0, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff profile' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':userId/assignment'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update staff assignment' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, staff_dto_1.UpdateStaffAssignmentDto, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "updateAssignment", null);
exports.StaffController = StaffController = __decorate([
    (0, swagger_1.ApiTags)('Staff'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map