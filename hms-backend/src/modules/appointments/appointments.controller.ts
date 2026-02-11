import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private service: AppointmentsService) {}

  @Post()
  @Roles('PATIENT', 'RECEPTIONIST', 'ADMIN')
  async create(@Body() body: any, @Request() req) {
    return this.service.create(body, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(page, limit);
  }

  @Get('patient/:patientId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')
  async findByPatient(@Param('patientId') patientId: string) {
    return this.service.findByPatient(patientId);
  }

  @Get('doctor/:doctorId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE')
  async findByDoctor(@Param('doctorId') doctorId: string) {
    return this.service.findByDoctor(doctorId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id/status')
  @Roles('DOCTOR', 'RECEPTIONIST', 'ADMIN')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req) {
    return this.service.updateStatus(id, body.status, req.user.id);
  }
}
