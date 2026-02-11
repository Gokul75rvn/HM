import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InsuranceService } from './insurance.service';
import {
  CreateInsurancePolicyDto,
  CreateInsuranceClaimDto,
  UpdateInsuranceClaimStatusDto,
} from './insurance.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Insurance')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('insurance')
export class InsuranceController {
  constructor(private readonly service: InsuranceService) {}

  @Post('policies')
  @Roles('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT')
  @ApiOperation({ summary: 'Create insurance policy' })
  createPolicy(@Body() dto: CreateInsurancePolicyDto, @Request() req) {
    return this.service.createPolicy(dto, req.user.id);
  }

  @Get('policies')
  @Roles('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'PATIENT')
  @ApiOperation({ summary: 'List policies' })
  listPolicies(@Query('patientId') patientId?: string) {
    return this.service.listPolicies(patientId);
  }

  @Post('claims')
  @Roles('ACCOUNTANT', 'ADMIN')
  @ApiOperation({ summary: 'Create insurance claim' })
  createClaim(@Body() dto: CreateInsuranceClaimDto, @Request() req) {
    return this.service.createClaim(dto, req.user.id);
  }

  @Get('claims')
  @Roles('ACCOUNTANT', 'ADMIN')
  @ApiOperation({ summary: 'List insurance claims' })
  listClaims(@Query('status') status?: string) {
    return this.service.listClaims(status);
  }

  @Patch('claims/:id/status')
  @Roles('ACCOUNTANT', 'ADMIN')
  @ApiOperation({ summary: 'Update claim status' })
  updateClaimStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInsuranceClaimStatusDto,
    @Request() req,
  ) {
    return this.service.updateClaimStatus(id, dto, req.user.id);
  }
}