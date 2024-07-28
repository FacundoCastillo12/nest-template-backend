import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { IUserRepository } from '../../application/repository/user.repository.interface';
import { Repository } from 'typeorm';
import { User } from '../../domain/user.domain';
import { PaginatedResponseDto } from '@/common/application/dto/paginated-response.';
import { GetAllPaginatedOptions } from '@/common/application/repository/get-all-paginated-options.interface';
import { PageFilterParamsDto } from '@/common/application/dto/page-filter-params.dto';
import { UserOrderParamsDto } from '../../application/dto/user-order.dto';
import {
  DEFAULT_SKIP,
  DEFAULT_TAKE,
} from '@/common/application/utils/constants/constants';
import { UserFilterQueryParamsDto } from '../../application/dto/user-filter-query-params.dto';
import { Inject } from '@nestjs/common';
import { UserMapper } from '../../application/mapper/user.mapper';
import { UserNotFoundException } from './exception/user-not-found.exception';

export class UserMysqlRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    @Inject(UserMapper) private readonly userMapper: UserMapper,
  ) {}

  async getAll(
    options?: GetAllPaginatedOptions<
      PageFilterParamsDto,
      UserOrderParamsDto,
      UserFilterQueryParamsDto
    >,
  ): Promise<PaginatedResponseDto<User>> {
    const { page: page, orderBy: orderByOptions, filter } = options || {};
    const { orderBy, orderDir } = orderByOptions || {};
    const orderOptions = { [orderBy]: orderDir };

    const [items, itemCount] = await this.repository.findAndCount({
      where: filter,
      order: orderOptions,
      take: page.take || DEFAULT_TAKE,
      skip: page.skip || DEFAULT_SKIP,
    });

    return {
      data: items.map((user) =>
        this.userMapper.fromUserEntityToUserClass(user),
      ),
      pageNumber: page.number,
      pageSize: page.take,
      pageCount: Math.ceil(itemCount / page.take),
      itemCount,
    };
  }

  async getOneByIdOrFail(id: number): Promise<User> {
    const userEntity = await this.repository.findOne({
      where: { id },
    });

    if (!userEntity) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }

    return this.userMapper.fromUserEntityToUserClass(userEntity);
  }

  async createOne(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async updateByIdOrFail(
    id: number,
    updates: Partial<Omit<User, 'id'>>,
  ): Promise<User> {
    const userToUpdate = await this.repository.preload({
      ...updates,
      id,
    });

    if (!userToUpdate) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }

    return this.repository.save(userToUpdate);
  }

  async remove(id: number): Promise<void> {
    const userToDelete = await this.repository.findOne({ where: { id } });

    if (!userToDelete) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }

    await this.repository.softRemove(userToDelete);
  }
}
