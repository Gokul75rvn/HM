import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { GenerateBillDto } from './billing.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly service: BillingService) {}

  @Post('generate')
  @Roles('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT')
  @ApiOperation({ summary: 'Generate bill' })
  generate(@Body() dto: GenerateBillDto, @Request() req) {
    return this.service.generateBill(dto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT')
  @ApiOperation({ summary: 'List bills' })
  list(@Query('patientId') patientId?: string) {
    return this.service.listBills(patientId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'PATIENT')
  @ApiOperation({ summary: 'Get bill details' })
  findById(@Param('id') id: string) {
    return this.service.getBillById(id);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT')
  @ApiOperation({ summary: 'Update bill status' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req) {
    return this.service.markStatus(id, body.status, req.user.id);
  }
}