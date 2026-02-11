import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PharmacyService } from './pharmacy.service';
import { DispensePrescriptionDto } from './pharmacy.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Pharmacy')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly service: PharmacyService) {}

  @Get('queue')
  @Roles('PHARMACIST', 'ADMIN')
  @ApiOperation({ summary: 'Pharmacy dispense queue' })
  listQueue(@Query('status') status?: string) {
    return this.service.listQueue(status);
  }

  @Post('dispense')
  @Roles('PHARMACIST', 'ADMIN')
  @ApiOperation({ summary: 'Dispense prescription' })
  dispense(@Body() dto: DispensePrescriptionDto, @Request() req) {
    return this.service.dispense(dto, req.user.id);
  }
}