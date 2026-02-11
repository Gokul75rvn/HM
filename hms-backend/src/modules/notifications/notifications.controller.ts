import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './notifications.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for current user' })
  list(@Request() req) {
    return this.service.findForUser(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markRead(@Param('id') id: string, @Request() req) {
    return this.service.markAsRead(req.user.id, id);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Send manual notification' })
  create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }
}