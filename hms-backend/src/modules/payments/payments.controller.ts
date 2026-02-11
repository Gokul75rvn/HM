import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './payments.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('pay')
  @Roles('ACCOUNTANT', 'ADMIN')
  @ApiOperation({ summary: 'Record payment against bill' })
  create(@Body() dto: CreatePaymentDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  @Roles('ACCOUNTANT', 'ADMIN')
  @ApiOperation({ summary: 'List payments' })
  list(@Query('patientId') patientId?: string) {
    return this.service.list(patientId);
  }
}