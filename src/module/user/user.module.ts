import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/database/entities/user.entity';
import { UserService } from './application/service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
