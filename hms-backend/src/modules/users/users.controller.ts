import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './users.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(createUserDto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users list' })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(id, updateUserDto, req.user.id);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.usersService.delete(id, req.user.id);
  }

  @Put(':id/role')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: 200, description: 'Role assigned' })
  async assignRole(
    @Param('id') id: string,
    @Body() body: { role: string },
    @Request() req,
  ) {
    return this.usersService.assignRole(id, body.role, req.user.id);
  }
}
