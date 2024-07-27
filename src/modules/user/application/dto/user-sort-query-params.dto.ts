import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SortType } from 'src/common/application/utils/enum/sort-type.enum';

export class UserSortQueryParamsDto {
  @ApiPropertyOptional()
  @IsEnum(SortType)
  @IsOptional()
  name?: SortType;

  @ApiPropertyOptional()
  @IsEnum(SortType)
  @IsOptional()
  lastName?: SortType;

  @ApiPropertyOptional()
  @IsEnum(SortType)
  @IsOptional()
  email?: SortType;
}
