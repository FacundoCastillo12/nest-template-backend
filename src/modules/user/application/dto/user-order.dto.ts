import { SortType } from '@/common/application/utils/enum/sort-type.enum';
import { IsDefined, IsEnum, IsIn, IsOptional } from 'class-validator';

export class UserOrderParamsDto {
  @IsOptional()
  @IsIn(['firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'id'])
  orderBy?: string;

  @IsOptional()
  @IsEnum(SortType)
  @IsIn(Object.values(SortType))
  orderDir?: SortType;

  @IsDefined()
  get bothPresent() {
    return !!this.orderBy === !!this.orderDir ? true : null;
  }
}
