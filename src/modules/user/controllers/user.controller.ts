import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { UserService } from '../application/service/user.service';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageFilterParamsDto } from '@/common/application/dto/page-filter-params.dto';
import { UserOrderParamsDto } from '../application/dto/user-order.dto';
import { PaginatedResponseDto } from '@/common/application/dto/paginated-response.';
import { UserResponseDto } from '../application/dto/user-response.dto';
import { UserFilterQueryParamsDto } from '../application/dto/user-filter-query-params.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(
    @Query('page') page: PageFilterParamsDto,
    @Query('filter') filter: UserFilterQueryParamsDto,
    @Query('order') orderBy?: UserOrderParamsDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.userService.getAllPaginated({
      page,
      orderBy,
      filter,
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<UserResponseDto> {
    return this.userService.getOneByIdOrFail(id);
  }

  @Post()
  async createOne(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createOne(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
