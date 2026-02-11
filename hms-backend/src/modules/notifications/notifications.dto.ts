import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

const NOTIFICATION_TYPES = [
  'APPOINTMENT_REMINDER',
  'PRESCRIPTION_READY',
  'LAB_RESULT',
  'PAYMENT_DUE',
  'DISCHARGE_REMINDER',
  'GENERAL',
];

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsEnum(NOTIFICATION_TYPES)
  type: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  relatedId?: string;
}