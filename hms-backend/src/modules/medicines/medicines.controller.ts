import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto, UpdateMedicineDto } from './medicines.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Medicines')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly service: MedicinesService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST')
  @ApiOperation({ summary: 'Create medicine' })
  create(@Body() dto: CreateMedicineDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'DOCTOR')
  @ApiOperation({ summary: 'List medicines' })
  list(@Query('q') q?: string) {
    return this.service.list(q);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST')
  @ApiOperation({ summary: 'Update medicine inventory' })
  update(@Param('id') id: string, @Body() dto: UpdateMedicineDto, @Request() req) {
    return this.service.update(id, dto, req.user.id);
  }

  @Get('low-stock')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST')
  @ApiOperation({ summary: 'Get low stock medicines' })
  lowStock() {
    return this.service.getLowStock();
  }
}