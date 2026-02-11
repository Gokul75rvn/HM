import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRolePermissionsDto } from './roles.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create role' })
  create(@Body() dto: CreateRoleDto, @Request() req) {
    return this.service.createRole(dto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'List roles' })
  list() {
    return this.service.listRoles();
  }

  @Get('permissions')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'List permissions' })
  listPermissions() {
    return this.service.listPermissions();
  }

  @Patch(':id/permissions')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update role permissions' })
  updatePermissions(
    @Param('id') id: string,
    @Body() dto: UpdateRolePermissionsDto,
    @Request() req,
  ) {
    return this.service.updateRolePermissions(id, dto, req.user.id);
  }
}