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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const roles_service_1 = require("./roles.service");
const roles_dto_1 = require("./roles.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let RolesController = class RolesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.createRole(dto, req.user.id);
    }
    list() {
        return this.service.listRoles();
    }
    listPermissions() {
        return this.service.listPermissions();
    }
    updatePermissions(id, dto, req) {
        return this.service.updateRolePermissions(id, dto, req.user.id);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create role' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [roles_dto_1.CreateRoleDto, Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'List roles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'List permissions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "listPermissions", null);
__decorate([
    (0, common_1.Patch)(':id/permissions'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update role permissions' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, roles_dto_1.UpdateRolePermissionsDto, Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "updatePermissions", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)('Roles & Permissions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map