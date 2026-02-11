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
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const doctors_service_1 = require("./doctors.service");
const doctors_dto_1 = require("./doctors.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let DoctorsController = class DoctorsController {
    doctorsService;
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }
    async create(createDoctorDto, req) {
        return this.doctorsService.create(createDoctorDto, req.user.id);
    }
    async findAll(page = 1, limit = 10) {
        return this.doctorsService.findAll(page, limit);
    }
    async findBySpecialization(specialization) {
        return this.doctorsService.findBySpecialization(specialization);
    }
    async findByDepartment(departmentId) {
        return this.doctorsService.findByDepartment(departmentId);
    }
    async findById(id) {
        return this.doctorsService.findById(id);
    }
    async update(id, updateDoctorDto, req) {
        return this.doctorsService.update(id, updateDoctorDto, req.user.id);
    }
    async setAvailability(id, body, req) {
        return this.doctorsService.setAvailability(id, body.isAvailable, req.user.id);
    }
};
exports.DoctorsController = DoctorsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Register doctor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Doctor registered', type: doctors_dto_1.DoctorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [doctors_dto_1.CreateDoctorDto, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all doctors' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctors list' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('specialization/:specialization'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'PATIENT', 'RECEPTIONIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctors by specialization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctors found' }),
    __param(0, (0, common_1.Param)('specialization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "findBySpecialization", null);
__decorate([
    (0, common_1.Get)('department/:departmentId'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'PATIENT', 'RECEPTIONIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctors by department' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctors found' }),
    __param(0, (0, common_1.Param)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "findByDepartment", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctor found', type: doctors_dto_1.DoctorResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Update doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctor updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, doctors_dto_1.UpdateDoctorDto, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/availability'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Set doctor availability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "setAvailability", null);
exports.DoctorsController = DoctorsController = __decorate([
    (0, swagger_1.ApiTags)('Doctors'),
    (0, common_1.Controller)('doctors'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [doctors_service_1.DoctorsService])
], DoctorsController);
//# sourceMappingURL=doctors.controller.js.map