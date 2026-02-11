import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto, UpdatePrescriptionStatusDto } from './prescriptions.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly service: PrescriptionsService) {}

  @Post()
  @Roles('DOCTOR')
  @ApiOperation({ summary: 'Create prescription' })
  create(@Body() dto: CreatePrescriptionDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'PHARMACIST')
  @ApiOperation({ summary: 'Get prescription by id' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('patient/:patientId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT')
  @ApiOperation({ summary: 'List prescriptions for patient' })
  listByPatient(@Param('patientId') patientId: string) {
    return this.service.listByPatient(patientId);
  }

  @Patch(':id/status')
  @Roles('DOCTOR', 'PHARMACIST')
  @ApiOperation({ summary: 'Update prescription status' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePrescriptionStatusDto,
    @Request() req,
  ) {
    return this.service.updateStatus(id, dto, req.user.id);
  }
}