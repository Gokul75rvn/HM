import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto, PatientResponseDto } from './patients.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Register new patient' })
  @ApiResponse({ status: 201, description: 'Patient registered', type: PatientResponseDto })
  async create(@Body() createPatientDto: CreatePatientDto, @Request() req) {
    return this.patientsService.create(createPatientDto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'Patients list' })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.patientsService.findAll(page, limit);
  }

  @Get('search')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Search patients by name' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query('q') query: string) {
    return this.patientsService.searchByName(query);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT')
  @ApiOperation({ summary: 'Get patient details' })
  @ApiResponse({ status: 200, description: 'Patient found', type: PatientResponseDto })
  async findById(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PATIENT', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Update patient' })
  @ApiResponse({ status: 200, description: 'Patient updated' })
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @Request() req,
  ) {
    return this.patientsService.update(id, updatePatientDto, req.user.id);
  }
}
