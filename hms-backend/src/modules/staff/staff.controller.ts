import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffAssignmentDto } from './staff.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Staff')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create staff account' })
  create(@Body() dto: CreateStaffDto, @Request() req) {
    return this.service.createStaff(dto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'List staff members' })
  list(@Query('role') role?: string) {
    return this.service.listStaff(role);
  }

  @Get(':userId')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get staff profile' })
  get(@Param('userId') userId: string) {
    return this.service.getStaffByUserId(userId);
  }

  @Patch(':userId/assignment')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update staff assignment' })
  updateAssignment(
    @Param('userId') userId: string,
    @Body() dto: UpdateStaffAssignmentDto,
    @Request() req,
  ) {
    return this.service.updateAssignment(userId, dto, req.user.id);
  }
}