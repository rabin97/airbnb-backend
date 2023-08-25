import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';
import { Prisma, $Enums } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

// Define a regular expression pattern for a strong password
const strongPasswordPattern =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;


export class UserRegisterDto {
  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'use strong password' })
  @IsNotEmpty()
  @Matches(strongPasswordPattern, { message: 'Please enter a strong password' })
  password: string;
  
  @ApiProperty({ description: 'define role' })
  @IsEnum($Enums.RoleType)
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  role: $Enums.RoleType;
}
