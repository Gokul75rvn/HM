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
exports.PatientsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const patients_service_1 = require("./patients.service");
const patients_dto_1 = require("./patients.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let PatientsController = class PatientsController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    async create(createPatientDto, req) {
        return this.patientsService.create(createPatientDto, req.user.id);
    }
    async findAll(page = 1, limit = 10) {
        return this.patientsService.findAll(page, limit);
    }
    async search(query) {
        return this.patientsService.searchByName(query);
    }
    async findById(id) {
        return this.patientsService.findById(id);
    }
    async update(id, updatePatientDto, req) {
        return this.patientsService.update(id, updatePatientDto, req.user.id);
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Register new patient' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient registered', type: patients_dto_1.PatientResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [patients_dto_1.CreatePatientDto, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all patients' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patients list' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Search patients by name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient found', type: patients_dto_1.PatientResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'PATIENT', 'RECEPTIONIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Update patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, patients_dto_1.UpdatePatientDto, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "update", null);
exports.PatientsController = PatientsController = __decorate([
    (0, swagger_1.ApiTags)('Patients'),
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map