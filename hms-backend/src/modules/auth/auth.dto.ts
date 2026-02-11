import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  registrationId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    registrationId: string;
    firstName: string;
    lastName: string;
    email?: string;
    role: string;
    patientId?: string;
    doctorId?: string;
    redirectPath: string;
  };
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
