import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetAllPaginatedOptions } from '@/common/application/repository/get-all-paginated-options.interface';
import { PageFilterParamsDto } from '@/common/application/dto/page-filter-params.dto';
import { UserOrderParamsDto } from '../dto/user-order.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { PaginatedResponseDto } from '@/common/application/dto/paginated-response.';
import {
  IUserRepository,
  USER_REPOSITORY_KEY,
} from '../repository/user.repository.interface';
import { UserFilterQueryParamsDto } from '../dto/user-filter-query-params.dto';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_KEY) readonly userRepository: IUserRepository,
    @Inject(UserMapper) private readonly userMapper: UserMapper,
  ) {}

  async getAllPaginated(
    options?: GetAllPaginatedOptions<
      PageFilterParamsDto,
      UserOrderParamsDto,
      UserFilterQueryParamsDto
    >,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { skip, take } = options?.page;

    const users = await this.userRepository.getAll({
      page: { skip, take },
      orderBy: options?.orderBy,
      filter: options?.filter,
    });

    return new PaginatedResponseDto({
      ...users,
      data: users.data.map((user) =>
        this.userMapper.fromUserClassToUserResponseDto(user),
      ),
    });
  }

  async getOneByIdOrFail(id: number): Promise<UserResponseDto> {
    const store = await this.userRepository.getOneByIdOrFail(id);

    return this.userMapper.fromUserClassToUserResponseDto(store);
  }

  async createOne(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const store = await this.userRepository.createOne(
      this.userMapper.fromCreateUserDtoToUserClass(createUserDto),
    );

    return this.userMapper.fromUserClassToUserResponseDto(store);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.updateByIdOrFail(
      id,
      this.userMapper.fromUpdateUserDtoToUserClass(updateUserDto),
    );

    return this.userMapper.fromUserClassToUserResponseDto(user);
  }

  async remove(storeId: number): Promise<void> {
    await this.userRepository.remove(storeId);
  }
}
