import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './application/service/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './infrastructure/database/entities/user.entity';
import { UserMapper } from './application/mapper/user.mapper';
import { USER_REPOSITORY_KEY } from './application/repository/user.repository.interface';
import { UserMysqlRepository } from './infrastructure/database/user.mysql.repository';

const userRepositoryProvider: Provider = {
  provide: USER_REPOSITORY_KEY,
  useClass: UserMysqlRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserMapper, userRepositoryProvider],
  exports: [UserMapper, UserService, userRepositoryProvider],
})
export class UserModule {}
