import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_TAKE } from '../utils/constants/constants';

export class PageFilterParamsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  number?: number = DEFAULT_PAGE;

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Type(() => Number)
  take?: number = DEFAULT_TAKE;

  get skip(): number {
    return (this.number - 1) * this.take;
  }
}
