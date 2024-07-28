import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.domain';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';
import { ICreateUserDto } from '../dto/interfaces/create-user.interface';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserMapper {
  fromUserEntityToUserClass(userEntity: UserEntity): User {
    const user = new User();
    user.firstName = userEntity.firstName;
    user.lastName = userEntity.lastName;
    user.email = userEntity.email;
    user.id = userEntity.id;
    user.createdAt = userEntity.createdAt;
    user.updatedAt = userEntity.updatedAt;
    user.deletedAt = userEntity.deletedAt;

    return user;
  }

  fromUserClassToUserResponseDto(userClass: User): User {
    const user = new UserResponseDto();

    user.id = userClass.id;
    user.firstName = userClass.firstName;
    user.lastName = userClass.lastName;
    user.email = userClass.email;
    user.createdAt = userClass.createdAt;
    user.updatedAt = userClass.updatedAt;
    user.deletedAt = userClass.deletedAt;

    return user;
  }

  fromUserClassToUserEntity(userEntity: UserEntity): User {
    const user = new UserResponseDto();

    user.id = userEntity.id;
    user.firstName = userEntity.firstName;
    user.lastName = userEntity.lastName;
    user.email = userEntity.email;
    user.createdAt = userEntity.createdAt;
    user.updatedAt = userEntity.updatedAt;
    user.deletedAt = userEntity.deletedAt;

    return user;
  }
  fromCreateUserDtoToUserClass(userDto: ICreateUserDto): User {
    const user = new User();
    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;
    user.email = userDto.email;

    return user;
  }

  fromUpdateUserDtoToUserClass(userDto: UpdateUserDto): User {
    const user = new User();
    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;
    user.email = userDto.email;
    return user;
  }
}
