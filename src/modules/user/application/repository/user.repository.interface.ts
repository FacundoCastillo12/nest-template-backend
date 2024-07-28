import { PageFilterParamsDto } from '@/common/application/dto/page-filter-params.dto';
import { PaginatedResponseDto } from '@/common/application/dto/paginated-response.';
import { GetAllPaginatedOptions } from '@/common/application/repository/get-all-paginated-options.interface';
import { User } from '../../domain/user.domain';
import { UserOrderParamsDto } from '../dto/user-order.dto';
import { UserFilterQueryParamsDto } from '../dto/user-filter-query-params.dto';

export const USER_REPOSITORY_KEY = 'user_repository';

export interface IUserRepository {
  getAll(
    options?: GetAllPaginatedOptions<
      PageFilterParamsDto,
      UserOrderParamsDto,
      UserFilterQueryParamsDto
    >,
  ): Promise<PaginatedResponseDto<User>>;

  getOneByIdOrFail(id: number): Promise<User>;
  createOne(user: User): Promise<User>;
  updateByIdOrFail(
    id: number,
    updates: Partial<Omit<User, 'id'>>,
  ): Promise<User>;
  remove(id: number): Promise<void>;
}
