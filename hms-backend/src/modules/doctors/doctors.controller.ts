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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto, DoctorResponseDto } from './doctors.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Doctors')
@Controller('doctors')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Register doctor' })
  @ApiResponse({ status: 201, description: 'Doctor registered', type: DoctorResponseDto })
  async create(@Body() createDoctorDto: CreateDoctorDto, @Request() req) {
    return this.doctorsService.create(createDoctorDto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'Doctors list' })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.doctorsService.findAll(page, limit);
  }

  @Get('specialization/:specialization')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PATIENT', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Get doctors by specialization' })
  @ApiResponse({ status: 200, description: 'Doctors found' })
  async findBySpecialization(@Param('specialization') specialization: string) {
    return this.doctorsService.findBySpecialization(specialization);
  }

  @Get('department/:departmentId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PATIENT', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Get doctors by department' })
  @ApiResponse({ status: 200, description: 'Doctors found' })
  async findByDepartment(@Param('departmentId') departmentId: string) {
    return this.doctorsService.findByDepartment(departmentId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')
  @ApiOperation({ summary: 'Get doctor details' })
  @ApiResponse({ status: 200, description: 'Doctor found', type: DoctorResponseDto })
  async findById(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR')
  @ApiOperation({ summary: 'Update doctor' })
  @ApiResponse({ status: 200, description: 'Doctor updated' })
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @Request() req,
  ) {
    return this.doctorsService.update(id, updateDoctorDto, req.user.id);
  }

  @Put(':id/availability')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR')
  @ApiOperation({ summary: 'Set doctor availability' })
  @ApiResponse({ status: 200, description: 'Availability updated' })
  async setAvailability(
    @Param('id') id: string,
    @Body() body: { isAvailable: boolean },
    @Request() req,
  ) {
    return this.doctorsService.setAvailability(id, body.isAvailable, req.user.id);
  }
}
