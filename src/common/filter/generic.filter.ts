import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GenericFilter {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  public page: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public pageSize: number = 10;

  @IsOptional()
  @IsEnum(SortOrder)
  public orderBy?: SortOrder = SortOrder.DESC;
}
