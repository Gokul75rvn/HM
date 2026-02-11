import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LabService } from './lab.service';
import { CreateLabTestDto, CreateLabOrderDto, UpdateLabOrderStatusDto, CreateLabResultDto } from './lab.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Lab')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Post('tests')
  @Roles('SUPER_ADMIN', 'ADMIN', 'LAB_TECH')
  @ApiOperation({ summary: 'Create lab test master record' })
  createTest(@Body() dto: CreateLabTestDto, @Request() req) {
    return this.labService.createTest(dto, req.user.id);
  }

  @Get('tests')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'LAB_TECH')
  @ApiOperation({ summary: 'List lab tests' })
  listTests() {
    return this.labService.listTests();
  }

  @Post('orders')
  @Roles('DOCTOR', 'LAB_TECH', 'ADMIN')
  @ApiOperation({ summary: 'Create lab order' })
  createOrder(@Body() dto: CreateLabOrderDto, @Request() req) {
    return this.labService.createOrder(dto, req.user.id);
  }

  @Get('orders')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'LAB_TECH')
  @ApiOperation({ summary: 'List lab orders' })
  listOrders(@Query('status') status?: string) {
    return this.labService.listOrders(status);
  }

  @Patch('orders/:id/status')
  @Roles('LAB_TECH', 'ADMIN')
  @ApiOperation({ summary: 'Update lab order status' })
  updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLabOrderStatusDto,
    @Request() req,
  ) {
    return this.labService.updateOrderStatus(id, dto, req.user.id);
  }

  @Post('results')
  @Roles('LAB_TECH')
  @ApiOperation({ summary: 'Upload lab result' })
  createResult(@Body() dto: CreateLabResultDto, @Request() req) {
    return this.labService.createResult(dto, req.user.id);
  }
}