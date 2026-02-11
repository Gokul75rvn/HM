import { Controller, Post, Body, UseGuards, Request, Get, Query, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BedsService } from './beds.service';
import { CreateWardDto, UpdateWardDto, CreateBedDto, UpdateBedStatusDto } from './beds.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Beds & Wards')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('beds')
export class BedsController {
  constructor(private readonly bedsService: BedsService) {}

  @Post('wards')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create ward' })
  createWard(@Body() dto: CreateWardDto, @Request() req) {
    return this.bedsService.createWard(dto, req.user.id);
  }

  @Patch('wards/:id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update ward details' })
  updateWard(@Param('id') id: string, @Body() dto: UpdateWardDto, @Request() req) {
    return this.bedsService.updateWard(id, dto, req.user.id);
  }

  @Get('wards')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  @ApiOperation({ summary: 'List wards with bed stats' })
  listWards() {
    return this.bedsService.listWards();
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create bed' })
  createBed(@Body() dto: CreateBedDto, @Request() req) {
    return this.bedsService.createBed(dto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  @ApiOperation({ summary: 'List beds with filters' })
  listBeds(@Query('wardId') wardId?: string, @Query('status') status?: string) {
    return this.bedsService.listBeds({ wardId, status });
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN', 'NURSE')
  @ApiOperation({ summary: 'Update bed status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBedStatusDto, @Request() req) {
    return this.bedsService.updateBedStatus(id, dto.status, req.user.id);
  }

  @Get('available')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')
  @ApiOperation({ summary: 'List available beds' })
  listAvailable(@Query('wardId') wardId?: string) {
    return this.bedsService.getAvailableBeds(wardId);
  }
}