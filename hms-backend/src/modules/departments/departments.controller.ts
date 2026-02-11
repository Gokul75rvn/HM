import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Departments')
@Controller('departments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  async create(@Body() createDepartmentDto: CreateDepartmentDto, @Request() req) {
    return this.departmentsService.create(createDepartmentDto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'NURSE')
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE')
  async findById(@Param('id') id: string) {
    return this.departmentsService.findById(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Request() req,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto, req.user.id);
  }
}
