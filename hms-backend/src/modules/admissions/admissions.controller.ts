import { Controller, Post, Patch, Get, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionDto, DischargeAdmissionDto } from './admissions.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Admissions')
@Controller('admissions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AdmissionsController {
  constructor(private service: AdmissionsService) {}

  @Post()
  @Roles('DOCTOR', 'NURSE', 'ADMIN')
  @ApiOperation({ summary: 'Create a new admission' })
  create(@Body() dto: CreateAdmissionDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  @ApiOperation({ summary: 'List admissions' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Patch(':id/discharge')
  @Roles('DOCTOR', 'ADMIN')
  @ApiOperation({ summary: 'Discharge an admission' })
  discharge(
    @Param('id') id: string,
    @Body() dto: DischargeAdmissionDto,
    @Request() req,
  ) {
    return this.service.discharge(id, dto, req.user.id);
  }
}
