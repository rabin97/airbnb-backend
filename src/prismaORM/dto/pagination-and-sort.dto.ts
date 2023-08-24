import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}
export class PaginationAndSortDto {
  @ApiProperty()
  @ValidateIf((o) => !!o.perPage)
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  pageNo: number;

  @ApiProperty()
  @ValidateIf((o) => !!o.pageNo)
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  perPage: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  orderBy: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Order)
  @IsString()
  @IsNotEmpty()
  order: Order;
}
